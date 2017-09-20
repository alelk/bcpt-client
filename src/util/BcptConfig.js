/**
 * Configuration
 *
 * Created by Alex Elkin on 13.07.2017.
 */

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./BcptConfig.prod')
} else {
    module.exports = require('./BcptConfig.dev')
}