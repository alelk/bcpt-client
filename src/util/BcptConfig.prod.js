/**
 * Configuration for production
 *
 * Created by Alex Elkin on 05.09.2017.
 */

const BcptConfig = (function () {
    const constants = {
        'rest-api-uri':"/bcpt-api/",
        'base-uri' : "/bcpt"
    };
    return {
        get: function (name) {
            return constants[name];
        }
    }
})();

export default BcptConfig;