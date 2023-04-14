// import * as cyfs from "cyfs-sdk";
// 创建did和激活vood流程,取 'api/vps/ood_active'接口返回对象的data.ip和data.access_token
// ip":["154.64.63.133:1320"],"access_token":"ZKtO7dWHmh5U"
import { voodInfoCheck, voodActivate } from "./api";
export async function createDID(vpsId) {
	const g_oodName = "";
	const g_didName = "";
	const buildDid = new BuildDid();

	const mnemonicList = buildDid.createMnemonic();
	// console.log("mnemonicList>>>>>>>>>>>>", JSON.stringify(mnemonicList));

	const peopleInfo = {
		area: new cyfs.Area(0, 0, 0, 0),
		mnemonic: mnemonicList.join(" "),
		network: cyfs.get_current_network(),
		address_index: 0,
		name: g_didName,
		icon: undefined,
	};
	let peopleRet = buildDid.createPeople(peopleInfo);
	if (peopleRet.err) {
		console.error(`createPeople failed: ${peopleRet}`);
		return peopleRet;
	}
	const peopleInfoObj = peopleRet.unwrap();

	const r = await buildDid.getUniqueId(vpsId);
	if (!r.isIpCanUse) {
		console.error(`current vpsId(${vpsId}) is invalid.`);
		return;
	}
	const g_uniqueId = r.g_uniqueId;
	const g_country = 0;
	const g_city = 0;
	const deviceInfo = {
		unique_id: g_uniqueId,
		owner: peopleInfoObj.object.calculate_id(),
		owner_private: peopleInfoObj.privateKey,
		area: new cyfs.Area(g_country % 512, 0, g_city % 8192, 0),
		network: cyfs.get_current_network(),
		address_index: calcIndex(g_uniqueId),
		account: 0,
		nick_name: g_oodName,
		category: cyfs.DeviceCategory.OOD,
	};
	const deviceRet = buildDid.createDevice(deviceInfo);
	if (deviceRet.err) {
		console.error(
			`createDevice owner: ${deviceInfo.owner} failed: ${deviceRet}`
		);
		return deviceRet;
	}
	const deviceInfoObj = deviceRet.unwrap();

	peopleInfoObj.object
		.body_expect()
		.content()
		.ood_list.push(deviceInfoObj.device.device_id());
	const sign_ret = cyfs.sign_and_set_named_object(
		peopleInfoObj.privateKey,
		peopleInfoObj.object,
		new cyfs.SignatureRefIndex(255)
	);
	if (sign_ret.err) {
		console.error(
			`sign_and_set_named_object peopleInfoObj objectId: ${peopleInfoObj.object.calculate_id()} failed: ${sign_ret}`
		);
		return sign_ret;
	}
	const gen = cyfs.CyfsSeedKeyBip.from_private_key(
		deviceInfo.owner_private.to_vec().unwrap().toHex(),
		deviceInfo.owner.to_base_58()
	);
	const path = cyfs.CyfsChainBipPath.new_device(
		deviceInfo.account,
		deviceInfo.network,
		deviceInfo.address_index
	);
	const private_key_r = gen.unwrap().sub_key(path);
	if (private_key_r.err) {
		return private_key_r;
	}
	const private_key = private_key_r.unwrap();
	const unique = cyfs.UniqueId.copy_from_slice(str2array(deviceInfo.unique_id));
	const device = cyfs.Device.create(
		cyfs.Some(deviceInfo.owner),
		unique,
		[],
		[],
		[],
		private_key.public(),
		deviceInfo.area,
		deviceInfo.category,
		(builder) => {
			builder.no_create_time();
		}
	);
	let sign_r = cyfs.sign_and_set_named_object(
		deviceInfo.owner_private,
		device,
		new cyfs.SignatureRefIndex(254)
	);
	if (sign_r.err) {
		console.error(
			`sign_and_set_named_object deviceInfo unique_id: ${deviceInfo.unique_id} failed: ${sign_r} `
		);
		return sign_r;
	}

	const peopleUpChainR = await buildDid.upChain(
		peopleInfoObj.object,
		peopleInfoObj
	);
	if (!peopleUpChainR) {
		console.error(`upChain people failed.`);
	}
	const deviceUpChainR = await buildDid.upChain(
		deviceInfoObj.device,
		peopleInfoObj
	);
	if (!deviceUpChainR) {
		console.error(`upChain device failed.`);
	}
	return {
		owner: peopleInfoObj.object.to_hex().unwrap(),
		did: peopleInfoObj.object.people_id().to_base_58(),
		desc: deviceInfoObj.device.to_hex().unwrap(),
		sec: deviceInfoObj.privateKey.to_vec().unwrap().toHex(),
		mnemonic: peopleInfo.mnemonic,
		device_id: deviceInfoObj.device.device_id().to_base_58(),
		g_uniqueId,
	};
}

// 激活vood
export async function activeVOOD(bindInfoObj, vpsId) {
	// console.log("owner: ", bindInfoObj.owner);
	// console.log("desc: ", bindInfoObj.desc);
	// console.log("sec: ", bindInfoObj.sec);
	// console.log("g_uniqueId: ", bindInfoObj.g_uniqueId);
	const index = calcIndex(bindInfoObj.g_uniqueId);
	// console.log("index::", index);
	const bindInfo = {
		owner: bindInfoObj.owner,
		desc: bindInfoObj.desc,
		sec: bindInfoObj.sec,
		index,
	};
	try {
		const reqData = {
			vps_id: vpsId,
			bind_info: bindInfo,
		};
		console.log("voodActivate req data::", JSON.stringify(reqData));
		const activeteRet = await voodActivate(reqData);
		console.log(`activeteRet: ${JOSN.stringify(activeteRet)}`);
		if (!activeteRet.data.result) {
			console.error("Activete ood failed");
			return false;
		} else {
			return true;
		}
	} catch (e) {
		if (Object.keys(e).length === 0) {
			console.log('fake error, activate success.');
			return true;
		}
		console.error("Activete ood failed: ", e);
		return false;
	}
}

function calcIndex(uniqueStr) {
	// 示例用了cyfs sdk依赖的node-forge库进行计算
	const md5 = cyfs.forge.md.md5.create();
	md5.update(uniqueStr, "utf8");
	let result = cyfs.forge.util.binary.hex.encode(md5.digest());
	let index = hashCode(result);
	console.log(`calc init index: uniqueStr=${uniqueStr}, index=${index}`);
	return index;
}

function hashCode(strValue) {
	let hash = 0;
	for (let i = 0; i < strValue.length; i++) {
		let chr = strValue.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0; // Convert to 32bit integer
	}
	hash = Math.floor(Math.abs(hash) / 63336);
	return hash;
}

function str2array(str) {
	let out = new Uint8Array(str.length);
	for (let i = 0; i < str.length; ++i) {
		out[i] = str.charCodeAt(i);
	}
	return out;
}

class BuildDid {
	meta_client;
	constructor() {
		this.meta_client = cyfs.create_meta_client();
	}
	createMnemonic() {
		let mnemonic = cyfs.bip39.generateMnemonic(
			128,
			undefined,
			cyfs.bip39.wordlists.english
		);
		let mnemonicList = [];
		if (mnemonic) {
			mnemonicList = mnemonic.split(" ");
		}
		return mnemonicList;
	}
	createPeople(info) {
		let gen = cyfs.CyfsSeedKeyBip.from_mnemonic(info.mnemonic);
		if (gen.err) {
			return gen;
		}
		let path = cyfs.CyfsChainBipPath.new_people(
			info.network,
			info.address_index
		);
		let private_key_r = gen.unwrap().sub_key(path);
		if (private_key_r.err) {
			return private_key_r;
		}
		let private_key = private_key_r.unwrap();
		let people = cyfs.People.create(
			cyfs.None,
			[],
			private_key.public(),
			cyfs.Some(info.area),
			info.name,
			info.icon,
			(build) => {
				build.no_create_time();
			}
		);
		let people_id = people.calculate_id();
		console.log("create_people", people_id.to_base_58());
		return cyfs.Ok({
			objectId: people_id,
			object: people,
			privateKey: private_key,
			path: path.to_string(),
		});
	}
	createDevice(info) {
		let gen = cyfs.CyfsSeedKeyBip.from_private_key(
			info.owner_private.to_vec().unwrap().toHex(),
			info.owner.to_base_58()
		);
		let path = cyfs.CyfsChainBipPath.new_device(
			info.account,
			info.network,
			info.address_index
		);
		let private_key_r = gen.unwrap().sub_key(path);
		if (private_key_r.err) {
			return private_key_r;
		}
		let private_key = private_key_r.unwrap();
		let unique = cyfs.UniqueId.copy_from_slice(str2array(info.unique_id));
		console.info(
			`unique_str: ${info.unique_id} -> ${unique.as_slice().toHex()}`
		);
		let device = cyfs.Device.create(
			cyfs.Some(info.owner),
			unique,
			[],
			[],
			[],
			private_key.public(),
			info.area,
			info.category,
			(builder) => {
				builder.no_create_time();
			}
		);
		device.set_name(info.nick_name);
		let device_id = device.calculate_id();
		console.log("create_device", device_id.to_base_58());
		let sign_ret = cyfs.sign_and_set_named_object(
			info.owner_private,
			device,
			new cyfs.SignatureRefIndex(254)
		);
		if (sign_ret.err) {
			console.log("sign_ret-err", sign_ret);
			return sign_ret;
		}
		return cyfs.Ok({
			device: device,
			privateKey: private_key,
		});
	}
	async getUniqueId(vpsId) {
		let isIpCanUse = false;
		let g_uniqueId = "";
		try {
			const checkVoodRet = await voodInfoCheck(vpsId);
			// const activeteResponse = await fetch(
			// 	`http://${ip}/check?access_token=${token}`,
			// 	{
			// 		method: "get",
			// 		headers: {
			// 			Accept: "application/json",
			// 			"Content-Type": "application/json",
			// 		},
			// 	}
			// );
			// const activeteRet = await activeteResponse.json();
			console.log("checkVoodRet:", checkVoodRet);
			if (checkVoodRet.result?.data) {
				isIpCanUse = true;
				if (!checkVoodRet.result.data?.activation) {
					// console.log(ip + "check-result", activeteRet);
					g_uniqueId = String(checkVoodRet.result.data.device_info.mac_address);
				}
				// else {
				//     window.location.href = `cyfs://static/reset_did.html?action=bindVood&ip=[${ip}]&accessToken=${token}`;
				// }
				return { isIpCanUse, g_uniqueId };
			} else {
				return { isIpCanUse, g_uniqueId };
			}
		} catch (e) {
			console.error(`voodInfoCheck failed: ${e}`);
			isIpCanUse = false;
			return { isIpCanUse, g_uniqueId };
		}
	}
	transformBuckyResult(ret) {
		let result;
		if (ret.err) {
			result = { code: ret.val.code, msg: ret.val.msg };
		} else {
			result = { code: 0, value: ret.unwrap() };
		}
		return result;
	}
	async checkReceipt(txId, checkTimeoutSecs = 300) {
		const _sleep = (ms) => {
			return new Promise((resolve) => setTimeout(resolve, ms));
		};
		let interval = 1000;
		let waitTime = interval;
		let returnRet = false;
		let hasReturnRet = false;
		await _sleep(interval);
		while (waitTime < checkTimeoutSecs * 1000 && !hasReturnRet) {
			const ret = this.transformBuckyResult(
				await this.meta_client.getReceipt(txId)
			);
			console.log("get receipt:", txId, ret);
			if (ret.code == 0 && ret.value?.is_some()) {
				const [receipt, block] = ret.value.unwrap();
				console.log(
					"create or update desc receipt:",
					txId.to_base_58(),
					block,
					receipt.result
				);
				if (receipt && receipt.result == 0) {
					returnRet = true;
					hasReturnRet = true;
				} else {
					returnRet = false;
					hasReturnRet = true;
				}
			}
			waitTime += interval;
			await _sleep(interval);
			interval = Math.min(interval * 2, 5000);
		}
		if (waitTime >= checkTimeoutSecs * 1000) {
			console.log("update desc time out:", txId);
			returnRet = false;
		}
		return returnRet;
	}
	async check_object_on_meta(id) {
		const ret = await this.meta_client.getDesc(id);
		if (ret.ok) {
			ret.unwrap().match({
				// eslint-disable-next-line no-unused-vars
				People: (p) => {
					return true;
				},
				// eslint-disable-next-line no-unused-vars
				Device: (p) => {
					return true;
				},
			});
		}
		return false;
	}
	async upChain(obj, peopleInfoObj) {
		// getDesc up chain
		let check_p_ret = await this.check_object_on_meta(obj.calculate_id());
		console.log("check_p_ret", obj.calculate_id().to_base_58(), check_p_ret);
		// console.log(
		// 	"cyfs.Device.hex",
		// 	((obj as cyfs.Device) || cyfs.People).to_hex().unwrap()
		// );
		let p_tx;
		if (check_p_ret) {
			let p_ret = await this.meta_client.update_desc(
				peopleInfoObj.object,
				cyfs.SavedMetaObject.try_from(obj).unwrap(),
				cyfs.None,
				cyfs.None,
				peopleInfoObj.privateKey
			);
			console.log("update_p_ret", p_ret);
			p_tx = p_ret.unwrap();
		} else {
			let p_ret = await this.meta_client.create_desc(
				peopleInfoObj.object,
				cyfs.SavedMetaObject.try_from(obj).unwrap(),
				cyfs.JSBI.BigInt(0),
				0,
				0,
				peopleInfoObj.privateKey
			);
			console.log("create_p_ret", p_ret);
			p_tx = p_ret.unwrap();
		}
		// check up chain
		let p_meta_success = await this.checkReceipt(p_tx);
		console.log("people desc on meta:", p_meta_success);
		return p_meta_success;
	}
}
//# sourceMappingURL=did.js.map
