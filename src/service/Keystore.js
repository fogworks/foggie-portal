const { ethers } = require('ethers');
const fs = require('fs');
const config = require('config');
const userConfig = config.get('userConfig');
const keystorePath = userConfig.get('keyStoreFileName')

class Keystore {

  /**
   * generate keystore
   * @param {*} privateKey    用户的私钥
   * @param {*} password      用户的密码
   * @returns 
   */
  static generateKeystore(privateKey, password) {
    const wallet = new ethers.Wallet(privateKey);
    Promise.resolve(wallet.encrypt(password)).then(keystore => {
      fs.writeFileSync(keystorePath, keystore);
    });
  }

  /**
   * get private key from keystore
   * @param {*} password  用户的密码
   * @returns 用户的私钥
   */
  static getPrivateKey(password) {
    // read keystore from file
    const keystore = fs.readFileSync(keystorePath, 'utf8');

    Promise.resolve(ethers.Wallet.fromEncryptedJson(keystore, password)).then(wallet => {
      return wallet.privateKey;
    });
  }
}



module.exports = Keystore