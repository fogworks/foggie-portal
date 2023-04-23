*/
export async function bucketsPushPath(
  api: GrpcConnection,
  key: string,
  path: string,
  input: any,
  opts?: PushOptions,
  ctx?: ContextInterface,
): Promise<PushPathResult> {
  return new Promise<PushPathResult>(async (resolve, reject) => {
    // Only process the first input if there are more than one
    const source: File | undefined = (await normaliseInput(input).next()).value

    if (!source) {
      return reject(AbortError)
    }

    const clientjs = new APIServiceClient(api.serviceHost, api.rpcOptions)

    grpc.client()

    const metadata = { ...api.context.toJSON(), ...ctx?.toJSON() }

    const stream: BidirectionalStream< //双向流  2）ServerStreaming：服务端推送流  3）ClientStreaming：客户端推送流 4）BidirectionalStreaming：双向推送流
      PushPathRequest,
      PushPathResponse
    > = clientjs.pushPath(metadata)

    if (opts?.signal !== undefined) {
      opts.signal.addEventListener('abort', () => {
        stream.cancel()
        return reject(AbortError)
      })
    }

    stream.on('data', (message: PushPathResponse) => {
      // Let's just make sure we haven't aborted this outside this function
      if (opts?.signal?.aborted) {
        stream.cancel()
        return reject(AbortError)
      }
      if (message.hasEvent()) {
        const event = message.getEvent()?.toObject()
        if (event?.path) {
          // TODO: Is there an standard library/tool for this step in JS?
          const pth = event.path.startsWith('/ipfs/')
            ? event.path.split('/ipfs/')[1]
            : event.path
          const cid = new CID(pth)
          const res: PushPathResult = {
            path: {
              path: `/ipfs/${cid?.toString()}`,
              cid,
              root: cid,
              remainder: '',
            },
            root: event.root?.path ?? '',
          }
          return resolve(res)
        } else if (opts?.progress) {
          opts.progress(event?.bytes)
        }
      } else {
        return reject(new Error('Invalid reply'))
      }
    })

    stream.on('end', (status?: Status) => {
      if (status && status.code !== grpc.Code.OK) {
        return reject(new Error(status.details))
      } else {
        return reject(new Error('undefined result'))
      }
    })
    stream.on('status', (status?: Status) => {
      if (status && status.code !== grpc.Code.OK) {
        return reject(new Error(status.details))
      } else {
        return reject(new Error('undefined result'))
      }
    })

    const head = new PushPathRequest.Header() //实例化对象
    head.setPath(source.path || path)
    head.setKey(key)
    // Setting root here ensures pushes will error if root is out of date
    const root = await ensureRootString(api, key, opts?.root, ctx)
    head.setRoot(root)
    const req = new PushPathRequest()
    req.setHeader(head)

    stream.write(req) // 先发第一个请求header
    if (source.content) {
      for await (const chunk of source.content) {
        if (opts?.signal?.aborted) {
          // Let's just make sure we haven't aborted this outside this function
          try {
            // Should already have been handled
            stream.cancel()
          } catch {} // noop
          return reject(AbortError)
        }
        // Naively chunk into chunks smaller than CHUNK_SIZE bytes
        for (const chunklet of genChunks(chunk as Uint8Array, CHUNK_SIZE)) {
          const part = new PushPathRequest()
          part.setChunk(chunklet) //
          stream.write(part)  //再发chunk
        }
      }
    }
    stream.end()
  })
}