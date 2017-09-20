/**
 * Configuration
 *
 * Created by Alex Elkin on 05.09.2017.
 */

const BcmsConfig = (function () {
    const constants = {
        'rest-api-uri':"http://localhost:8080/rest-api-1.0.0-ALPHA/"
        //'rest-api-uri':"http://localhost:8080/web-app-1.0.1-BETA/"
    };
    return {
        get: function (name) {
            return constants[name];
        }
    }
})();

export default BcmsConfig;