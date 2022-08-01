const express = require("express");
const app = express();
const seed = require ('./db/seeds/seed')
app.use(express.json());

const {
    getTopics,
} = require ('./Controllers/app.controller')




app.get("/api/topics", getTopics)


module.exports = app;