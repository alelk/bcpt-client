/**
 * Configuration for production
 *
 * Created by Alex Elkin on 05.09.2017.
 */

const BcmsConfig = (function () {
    const constants = {
        'rest-api-uri':"/"
    };
    return {
        get: function (name) {
            return constants[name];
        }
    }
})();

export default BcmsConfig;