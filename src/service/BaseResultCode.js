class BaseResultCode {

    /***********************************/
    /**
     * code
     */
    code;
    /**
     * desc
     */
    desc;

    constructor(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    /************************************/

    // common exception code 1～9999
    static SUCCESS = new BaseResultCode(200, 'success');
    static FAILED = new BaseResultCode(500, 'failed');
    static VALIDATE_FAILED = new BaseResultCode(300, 'parameter valid failed');
    static API_NOT_FOUNT = new BaseResultCode(400, 'api not found');
    static API_BUSY = new BaseResultCode(600, 'operate frequently, try again later')

    // user exception code 10000～19999
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
    static GET_USERNAME_FAILED = new BaseResultCode(10010, 'get username failed');
    static PRIVATE_KEY_INVALID = new BaseResultCode(10011, 'private key is invalid');
    static CLAIM_ORDER_FAILED = new BaseResultCode(10012, 'claim order failed'); 
    static GET_USERINFO_FAILED = new BaseResultCode(10013, 'get userinfo failed');
    static GET_DIVIDEND_LIST_FAILED = new BaseResultCode(10014, 'get dividend list failed');
    static GET_DIVIDEND_COUNT_FAILED = new BaseResultCode(10015, 'get dividend count failed');
    static ACCOUNT_NOT_EXIST = new BaseResultCode(10016, 'account is not exist');
    static CHECK_ACCOUNT_FAILED = new BaseResultCode(10017, 'check account failed');
    static GET_USERNAME_FAILED = new BaseResultCode(10018, 'get username failed');

    // order exceptin code 20000～29999
    static ORDER_BUY_FAILED = new BaseResultCode(20000, 'buy failed');
    static SAVE_PUSH_MERKLE_RECORD_FAILED = new BaseResultCode(20001, 'save push merkle record failed');
    static QUERY_PUSH_MERKLE_RECORD_FAILED = new BaseResultCode(20002, 'query push merkle record failed');
    static SAVE_ORDER_FAILED = new BaseResultCode(20003, 'save order failed');
    static QUERY_ORDER_FAILED = new BaseResultCode(20004, 'query order failed');
    static GET_ORDER_BASIC_INFO_FAILED = new BaseResultCode(20005, 'get order basic info failed');
    static GET_BILL_MEMO_FAILED = new BaseResultCode(20006, 'get bill memo failed');
    static SYNC_ORDER_2_REGISTER_CENTER_FAILED = new BaseResultCode(20007, 'sync order to register center failed');
    static UPDTAE_ORDER_FAILED = new BaseResultCode(20008, 'update order failed');
    static QUERY_BILL_FAILED = new BaseResultCode(20010, 'query bill failed');
    static GET_TRANSACTION_ID_FAILED = new BaseResultCode(20011, 'get transaction id failed');
    static GET_EXPIRE_FAILED = new BaseResultCode(20012, 'get expire failed');
    static GET_TRANSACTION_FAILED = new BaseResultCode(20013, 'get transaction failed');
    static GET_PEER_ID_FAILED = new BaseResultCode(20014, 'get peer id failed');
    static GET_RPC_FAILED = new BaseResultCode(20015, 'get rpc failed');
    static ORDER_NOT_EXIST = new BaseResultCode(20016, 'order is not exist');
    static GET_CHANLLENGE_RECORD_FAILED = new BaseResultCode(20017, 'get challenge record failed');
    static SAVE_CHANLLLENGE_RECORD_FAILED = new BaseResultCode(20018, 'save challenge record failed');
    static RELEASE_FAILED = new BaseResultCode(20019, 'order release dmc failed');
    static APPEND_FAILED = new BaseResultCode(20020, 'order append dmc failed');
    static CANCEL_FAILED = new BaseResultCode(20021, 'order cancel dmc failed');
    static ORDER_CHALLENGE_NOT_RESPONSE = new BaseResultCode(20022, 'order challenge not response');
    static CHALLENGE_NO_RESPONSE = new BaseResultCode(20023, 'miner no response challenge, no allow push merkle');
    static GET_ORDER_FROM_CHAIN_FAILED = new BaseResultCode(20024, 'get order from chain failed');
    static UPDATE_CHANLLENGE_RECORD_FAILED = new BaseResultCode(20025, 'update challenge failed');
    static MERKLE_INCONSISTENT = new BaseResultCode(20026, 'merkle inconsistent');
    static ORDER_STATE_END = new BaseResultCode(20027, 'order state is end');
    static ORDER_USED_SPACE_NOT_ENOUGH = new BaseResultCode(20028, 'order used space not enough');
    static GET_CHANLLENGE_FROM_CHAIN_FAILED = new BaseResultCode(20029, 'get challenge from chain failed');
    static ORDER_STATE_INVALID_CHALLENGE = new BaseResultCode(20030, 'order state is invalid cannot challenge');
    static CHANLLENGE_STATE_INVALID_CHALLENGE = new BaseResultCode(20031, 'challenge state is invalid cannot challenge');
    static ORDER_DMC_NOT_ENOUGH = new BaseResultCode(20032, 'dmc is not enough, cannot reqchallenge');
    static ORDER_STATE_INVALID_CANCEL = new BaseResultCode(20033, 'order state is invalid cannot cancel');
    static BALANCE_NOT_ENOUGH = new BaseResultCode(20034, 'user balance is not enough, cannot buy order');

    // file exception code 30000～39999
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
    static BUILD_MERKLE_FAILED = new BaseResultCode(30014, 'build merkle failed');
    static SAVE_CODEBOOK_OFFSET_FAILED = new BaseResultCode(30015, 'save codebook offset failed');
    static GET_CODEBOOK_OFFSET_FAILED = new BaseResultCode(30016, 'get codebook offset failed');
    static SAVE_CODEBOOK_FAILED = new BaseResultCode(30017, 'save codebook failed');
    static GET_FILE_BY_MD5_FAILED = new BaseResultCode(30018, 'get file by md5 failed');
    static DONOT_DUPLICATE_UPLOAD = new BaseResultCode(30019, 'do not duplicate upload file');
    static SAVE_FILE_UPLOAD_RECORD_FAILED = new BaseResultCode(30020, 'save file upload record failed');
    static UPDATE_FILE_CODEBOOK_FAILED = new BaseResultCode(30021, 'update file codebook failed');
    static GET_FILE_UPLOAD_RECORD_FAILED = new BaseResultCode(30022, 'get file upload record failed');
    static REMOVE_FILE_FAILED = new BaseResultCode(30023, 'remove file failed');
    static DELETE_CODEBOOK_OFFSET_FAILED = new BaseResultCode(30024, 'delete codebook offset failed');
    static GET_FOGGIE_ID_FAILED = new BaseResultCode(30025, 'get foggie id failed');
    static GET_FILE_IDX_FAILED = new BaseResultCode(30026, 'get file idx failed');
    static PAY_CHALLENGE_FAILED = new BaseResultCode(30027, 'pay challenge failed');
    static GET_CHAIN_ID_FAILED = new BaseResultCode(30028, 'get chain id failed');
    static GET_BENCHMARK_PRICE_FAILED = new BaseResultCode(30029, 'get benchmark price failed');
    static ORDER_STATE_INVALID_UPLOAD = new BaseResultCode(30030, 'order state is invalid cannot upload file');
    static ORDER_REMAINING_SPACE_NOT_ENOUGH = new BaseResultCode(30031, 'order remaining space not enough');


    // asset exception code 40000～49999
    static TRANSFER_FAILED = new BaseResultCode(40000, 'transfer failed');
    static GET_TRANSFER_VALID_FAILED = new BaseResultCode(40001, 'get transfer valid failed');
    static GENERATE_QR_CODE_FAILED = new BaseResultCode(40002, 'generating QR code failed');
    static SAVE_TRANSFER_VALID_FAILED = new BaseResultCode(40003, 'save transfer valid failed');
    static TRANSFER_VALID_FAILED = new BaseResultCode(40004, 'transfer valid failed');
    static GET_USER_ASSET_FAILED = new BaseResultCode(40005, 'get user asset failed');
}

module.exports = BaseResultCode