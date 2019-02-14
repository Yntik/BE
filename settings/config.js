const OPTION = require('./MYSQL_OPTION');
const convict = require('convict');

const conf = convict({
    env: {
        doc: "The applicaton environment.",
        format: ["production", "development", "test"],
        default: process.env.env,
        arg: 'nodeEnv',
        env: process.env.NODE_ENV
    },
    CORS: {
        doc: 'The domen',
        format: 'url',
        default: {
            origin: ['http://localhost:4200', 'http://localhost:3000', 'http://clientclockware.s3-website.eu-central-1.amazonaws.com', 'http://clockware.s3-website.eu-central-1.amazonaws.com', 'https://pure-ocean-58040.herokuapp.com'],
            optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
        },
        env: "NODE_ENV"
    },
    database: {
        "dev": {
            "host": "clockware.cggiayikq57u.eu-central-1.rds.amazonaws.com",
            "user": "clockware",
            "password": "passwordsecret",
            "port": "3306",
            "database": "clockware",
            "driver": "mysql"
        },
        env: "NODE_ENV"
    }
});

if (conf.get('env') === 'production') {
    // в боевом окружении используем другой порт и сервер БД
    console.log('prood');
    console.log(conf.get('env'));
    console.log(process.env.env);
    conf.load({
        CORS: {
            origin: ['http://localhost:4200', 'https://8b84052e.ngrok.io', 'https://7fcd2d87.ngrok.io', 'http://clockware.s3-website.eu-central-1.amazonaws.com', 'http://localhost:3000', 'https://mighty-harbor-39325.herokuapp.com']
        }
    });
}
else if (conf.get('env') === 'test') {
    // в боевом окружении используем другой порт и сервер БД
    conf.load({
        database: {
            "dev": {
                "host": "icopoghru9oezxh8.cbetxkdyhwsb.us-east-1.rds.amazonaws.com",
                "user": "c0np7i7uf18zhpc4",
                "password": "r9h7mk9ta0875chh",
                "port": "3306",
                "database": "j2o2ipmq4n3nmtzf",
                "driver": "mysql"
            }
        }
    });

}
const config = {
    BACK_END_PORT: 3000,
    CORS_OPTIONS: conf.get('CORS'),
    MYSQL_OPTION: OPTION.MYSQL_OPTION,
    DATABASE: conf.get('database'),
    // Token life time
    JWT_EXPIRATION_TIME: 3600, // 1h
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