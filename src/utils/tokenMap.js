export const setTokenMap = (id, token) => {
    let tokenMap = window.localStorage.getItem("tokenMap")
    if (tokenMap) {
        tokenMap = JSON.parse(tokenMap)
    } else {
        tokenMap = {}
    }
    if (id && token) {
        tokenMap[id] = token
        window.localStorage.setItem("tokenMap", JSON.stringify(tokenMap))
    }
}
export const getTokenMap = (id) => {
    let tokenMap = window.localStorage.getItem("tokenMap")
    let tokenObj = tokenMap ? JSON.parse(tokenMap) : {}
    return tokenObj[id] ? tokenObj[id] : ''
}
export const getTokenTotalMap = () => {
    let tokenMap = window.localStorage.getItem("tokenMap")
    let tokenObj = tokenMap ? JSON.parse(tokenMap) : {}
    return tokenObj
}