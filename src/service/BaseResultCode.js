class BaseResultCode {

    /***********************************/
    /**
     * code
     */
    code;
    /**
     * 说明
     */
    desc;

    constructor(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    /************************************/

    // 通用的异常code 1～9999
    static SUCCESS = new BaseResultCode(200, 'success');
    static FAILED = new BaseResultCode(500, 'failed');
    static VALIDATE_FAILED = new BaseResultCode(300, 'parameter valid failed');
    static API_NOT_FOUNT = new BaseResultCode(400, 'api not found');
    static API_BUSY = new BaseResultCode(600, 'operate frequently, try again later')

    // 用户的异常code 10000～19999
    static USER_NOT_EXIST = new BaseResultCode(10000, 'user is not exist');
    static PASSWORD_NOT_EXIST = new BaseResultCode(10001, 'password is not exist');
    static PASSWORD_EXIST = new BaseResultCode(10002, 'password is exist');
    static PASSWORD_VALID_FAILED = new BaseResultCode(10003, 'password is not match');
    static SAVE_PASSWORD_FAILED = new BaseResultCode(10004, 'save password failed');
    static SAVE_PRIVATE_KEY_FAILED = new BaseResultCode(10005, 'save private key failed');
    static RESET_PASSWORD_FAILED = new BaseResultCode(10006, 'reset password failed');
    static PRIVATE_KEY_NOT_EXIST = new BaseResultCode(10007, 'private key is not exist');
    static VALIDATE_LOGIN_FAILED = new BaseResultCode(10008, 'validate login failed');
    static GET_PRIVATE_KEY_FAILED = new BaseResultCode(10009, 'get private key failed');

    // 订单的异常code 20000～29999
    static ORDER_BUY_FAILED = new BaseResultCode(20000, 'buy failed');
    // 文件的异常code 30000～39999
    static FILE_NOT_EXIST = new BaseResultCode(30000, 'file is not exist');
    static SAVE_FILE_FAILED = new BaseResultCode(30001, 'save file failed');
    static QUERY_FILE_FAILED = new BaseResultCode(30002, 'query file failed');
    static UPLOAD_FILE_FAILED = new BaseResultCode(30003, 'upload file failed');
    static CREATE_FILE_FAILED = new BaseResultCode(30004, 'create file failed');
    static NOT_SUPPORT_FILE_TYPE = new BaseResultCode(30005, 'not support file type');
    static OPEN_FILE_FAILED = new BaseResultCode(30006, 'open file failed');
    static READ_FILE_FAILED = new BaseResultCode(30007, 'read file failed');
    static DELETE_FILE_FAILED = new BaseResultCode(30008, 'delete file failed');
    static COMPLETE_FILE_FAILED = new BaseResultCode(30009, 'complete file failed');
    static PUSH_MERKLE_FAILED = new BaseResultCode(30010, 'push merkle failed');
    static GET_MERKLE_FAILED = new BaseResultCode(30011, 'get merkle failed');
    static GET_FILE_CODEBOOK_FAILED = new BaseResultCode(30012, 'get file codebook failed');
    static REQ_CHALLENGE_FAILED = new BaseResultCode(30013, 'req challenge failed');
}

module.exports = BaseResultCode