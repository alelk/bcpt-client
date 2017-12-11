/**
 * Configuration
 *
 * Created by Alex Elkin on 05.09.2017.
 */

const BcptConfig = (function () {
    const constants = {
        'rest-api-uri':"http://localhost:8080/rest-api-1.0.0-ALPHA/",
        'base-uri' : "/"
    };
    return {
        get: function (name) {
            return constants[name];
        }
    }
})();

export default BcptConfig;