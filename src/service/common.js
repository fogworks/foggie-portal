const process = require('node:process');

module.exports = {
    getHomePath: () => {
        if (process.platform === 'win32') {
            return process.env.USERPROFILE;
          } else {
            return process.env.HOME;
          }
    }
}