const crypto = require('crypto');

class Encrypt {
    /**
     * 加密
     * @param {*} content 需要加密的内容
     * @param {*} key     关键字，放在加密的内容中避免 相同的内容密文一致
     * @returns 密文
     */
    static encrypt(content, key) {
        var data = content + key;
        // 默认用 utf-8 编码格式解释字符串
        var base64data = Buffer.from(data).toString('base64');

        const cipherKey = crypto.scryptSync(key, 'salt', 24);
        const iv = Buffer.alloc(16, 0);
        var cipher = crypto.createCipheriv('aes-192-cbc', cipherKey, iv);
        var encrypted = cipher.update(base64data, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }


    /**
     * 解密
     * @param {*} crypted 需要解密的内容
     * @param {*} key     关键字，放在加密的内容中避免 相同的内容密文一致
     * @returns 明文
     */
    static decrypt(crypted, key) {
        const decipherKey = crypto.scryptSync(key, 'salt', 24);
        const iv = Buffer.alloc(16, 0);
        var decipher = crypto.createDecipheriv('aes-192-cbc', decipherKey, iv);
        var decrypted = decipher.update(crypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        // 默认用 utf-8 编码格式解释字符串
        var plainText = Buffer.from(decrypted, 'base64').toString('ascii');

        plainText = plainText.substring(0, plainText.length - key.length);
        return plainText;
    }

    /**
     * 简单加密
     * @param {*} content 需要加密的内容
     * @returns 密文
     */
    static simpleEncrypt(content) {
        const cipherKey = crypto.scryptSync('foggiev', 'salt', 24);
        const iv = Buffer.alloc(16, 0);
        var cipher = crypto.createCipheriv('aes-192-cbc', cipherKey, iv);
        var encrypted = cipher.update(content, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        return encrypted;
    }


    /**
     * 简单解密
     * @param {*} crypted 需要解密的内容
     * @returns 明文
     */
    static simpleDecrypt(crypted) {
        const decipherKey = crypto.scryptSync('foggiev', 'salt', 24);
        const iv = Buffer.alloc(16, 0);
        var decipher = crypto.createDecipheriv('aes-192-cbc', decipherKey, iv);
        var decrypted = decipher.update(crypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }
}
module.exports = Encrypt