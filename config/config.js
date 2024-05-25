let config = {
    JWT_SECRET: process.env.JWT_SECRET || "secret" ,
    MONGODB_SECRET: process.env.MONGODB_SECRET || "photo-stock",
    mongoUrl: process.env.mongoUrl || "mongodb://0.0.0.0:27017/userDB",
    port: 5000
}

module.exports = config;