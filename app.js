const express = require("express");
const app = express();
const seed = require ('./db/seeds/seed')
app.use(express.json());

const {
    getTopics,
} = require ('./Controllers/app.controller')




app.get("/api/topics", getTopics)





/////
app.use((err, req, res, next) => {
      console.log(err);
  res.status(500).send("Server Error!");
});



module.exports = app;