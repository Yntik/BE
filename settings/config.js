const OPTION = require('./MYSQL_OPTION');
const convict = require('convict');
var conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development"],
        default: "production",
        env: "NODE_ENV"
    },
    CORS: {
        doc: 'The domen',
        format: 'url',
        default: {
            origin: 'https://pure-ocean-58040.herokuapp.com',
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        },
        env: "NODE_ENV"
    }
});

if (conf.get('env') === 'production') {
    // в боевом окружении используем другой порт и сервер БД
    conf.load({
        CORS: {
            origin: ['http://localhost:4200', 'https://8f58a176.ngrok.io']
        }
    });
}
const config = {
    BACK_END_PORT: 3000,
    CORS_OPTIONS: conf.get('CORS'),
    MYSQL_OPTION: OPTION.MYSQL_OPTION,
    // Token life time
    JWT_EXPIRATION_TIME: 3601, // 1h
    // https://www.random.org/strings/?num=10&len=10&digits=on&upperalpha=on&loweralpha=on&unique=on&format=html&rnd=new
    // ->
    // vIh2YQonCj
    // KlwuQXMCAz
    // hSJyRAtgWW
    // RfY0GikCr0
    // mCRmV416S7
    // FiUhNZruFo
    // 1dN33qCiHM
    // KBo0nLUadL
    // GSqIOwipMF
    // NwAyTtnv6h
    //
    // SHA256
    // -> DC70EF45184FC78B12FF196B97FEC30547861EE0D297D86F9A8200E90713B75E
    // SHA256
    // -> D37C954B810ACA0A9D9BD9C6A9F412CB25AC252DAB237070B0EF07DD3EDBFE6C
    // SHA256
    // -> 5C798FF4B7BA6235E26C709F295EA50C19E5A0AA464F06AA5076A9C29D00A4D4
    JWT_SECRET_KEY: '5C798FF4B7BA6235E26C709F295EA50C19E5A0AA464F06AA5076A9C29D00A4D4'

};

module.exports = config;