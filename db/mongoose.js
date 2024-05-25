const mongoosedb = require("mongoose");
const config = require("../config/config");

mongoosedb.set("strictQuery", false);
mongoosedb.connect(config.mongoUrl)
    .then(() => console.log("connected to mongoDB"))
    .catch((err) => console.log(err));


module.exports = {mongoosedb};