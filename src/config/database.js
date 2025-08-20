/**
 * Database Configuration for Cloud Services with MTProto Integration
 * All data operations go through cloud databases with encryption
 */

const MTProto = require('../lib/mtproto/mtproto_config');
const crypto = require('../lib/crypto/crypto_methods');

const config = {
    // MTProto Configuration for encrypted communication
    mtproto: {
        api_id: process.env.MTPROTO_API_ID || 94575,
        api_hash: process.env.MTPROTO_API_HASH || 'a3406de8d171bb422bb6ddf3bbd800e2',
        server: {
            dev: process.env.NODE_ENV !== 'production',
            useWSS: true,
            useTLS: true
        },
        encryption: {
            enabled: true,
            algorithm: 'AES-256-IGE',
            keyDerivation: 'PBKDF2'
        }
    },
    // MySQL Configuration (Primary Database)
    mysql: {
        uri: process.env.MYSQL_URI,
        maxConnections: parseInt(process.env.MYSQL_MAX_CONNECTIONS) || 20,
        timeout: 30000,
        ssl: {
            rejectUnauthorized: false
        },
        reconnect: true,
        acquireTimeout: 60000,
        connectionLimit: 20
    },

    // MongoDB Configuration (Document Storage)
    mongodb: {
        uri: process.env.MONGODB_URI,
        maxPoolSize: parseInt(process.env.MONGODB_MAX_POOL_SIZE) || 50,
        serverSelectionTimeoutMS: parseInt(process.env.MONGODB_TIMEOUT) || 10000,
        retryWrites: true,
        w: 'majority'
    },

    // Redis Configuration (Cache & Sessions)
    redis: {
        uri: process.env.REDIS_URI,
        maxConnections: parseInt(process.env.REDIS_MAX_CONNECTIONS) || 10,
        retryDelayOnFailover: 100,
        enableReadyCheck: false,
        maxRetriesPerRequest: null,
        lazyConnect: true
    },

    // Neo4j Configuration (Graph Database)
    neo4j: {
        uri: process.env.NEO4J_URI,
        username: process.env.NEO4J_USERNAME,
        password: process.env.NEO4J_PASSWORD,
        database: process.env.NEO4J_DATABASE,
        instanceId: process.env.AURA_INSTANCEID,
        instanceName: process.env.AURA_INSTANCENAME,
        maxConnectionPoolSize: 50,
        connectionTimeout: 30000
    }
};

module.exports = config;
