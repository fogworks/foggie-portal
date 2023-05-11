const BizResultCode = require('./BaseResultCode');
const logger = require('./logger')('OrderTimer.js')
const userService = require('./UserService')
const orderService = require('./OrderService')
const DMC = require('dmc.js');
const config = require('config');

class OrderTimer {
    static async payChallengeTimer() {
        logger.info('payChallengeTimer start')
        var challengeList = await orderService.getChallengeFromDB(3);
        if (challengeList instanceof BizResultCode) {
            logger.info('payChallengeTimer challengeList is null')
            return;
        }
        if (challengeList.length == 0) {
            logger.info('payChallengeTimer challengeList is null')
            return;
        }

        for (const chanllenge of challengeList) {

            // compare timeout period
            var createTimestamp = new Date(chanllenge.create_time).getTime();
            var now = new Date().getTime();
            var challengeConfig = config.get("challengeConfig");
            var payChallengeTimeout = challengeConfig.get("payChallengeTimeout");

            if ((now - createTimestamp) < payChallengeTimeout) {
                logger.info("challenge is not timeout, orderId:{}", chanllenge.order_id);
                continue;
            }

            var email = chanllenge.email;
            var privateKey = await userService.getPrivateKeyByEmail(email);
            if (privateKey instanceof BizResultCode) {
                logger.error("get privateKey is error, email:{}", email);
                continue;
            }
            var chainId = orderService.getChainId();
            if (chainId instanceof BizResultCode) {
                logger.error("get chainId is error");
                continue;
            }
            var chainConfig = config.get('chainConfig');
            var httpEndpoint = chainConfig.get("httpEndpoint");
            var dmc_client = DMC({
                chainId: chainId,
                keyProvider: privateKey,
                httpEndpoint: httpEndpoint,
                logger: {
                    log: null,
                    error: null
                }
            });

            var result = await orderService.payChallenge4Timer(chanllenge, dmc_client);
            if (result instanceof BizResultCode) {
                logger.info('payChallengeTimer payChallenge is error, orderId:{}', chanllenge.order_id);
                continue;
            }
        }
        logger.info('payChallengeTimer end');
    }
}

module.exports = OrderTimer