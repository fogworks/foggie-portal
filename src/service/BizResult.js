const BizResultCode = require('./BaseResultCode');

class BizResult {
   
    /**
     * 返回code
     */
    code;
    /**
     * 返回消息
     */
    msg;
    /**
     * 返回数据
     */
    data;
    /**
     * 返回时间
     */
    time;

    /**
     * 
     * @param code {number} 返回code
     * @param msg {string} 返回消息
     * @param data {any} 返回具体对象
     */
    constructor(code, msg, data) {
        this.code = code;
        this.msg = msg;
        this.data = data;
        this.time = Date.now();
    }

    /**
     * 成功
     * @param data {any} 返回对象
     * @return {BizResult}
     */
    static success(data) {
        return new BizResult(BizResultCode.SUCCESS.code, BizResultCode.SUCCESS.desc,new BizResult(BizResultCode.SUCCESS.code, BizResultCode.SUCCESS.desc, data));
    }

    /**
     * 失败
     * @param errData 
     * @return {BizResult}
     */
    static fail(bizResultCode, errData) {
        return new BizResult(bizResultCode.code, bizResultCode.desc, errData);
    }

    /**
     * 参数校验失败
     */
    static validateFailed(param) {
        return new BizResult(BizResultCode.VALIDATE_FAILED.code, BizResultCode.VALIDATE_FAILED.desc, param);
    }
}

module.exports = BizResult