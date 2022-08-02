const express = require("express");
const app = express();
const seed = require ('./db/seeds/seed')
app.use(express.json());



const {
    getTopics,
    getArticle,
    patchArticle,
    getUsers
} = require ('./Controllers/app.controller')

const{
    handleCustomErrors,
    handleServerErrors,
    handlePsqlErrors
} = require ('./Errors/index')


//GET methods
app.get("/api/topics", getTopics)
app.get("/api/articles/:article_id", getArticle)
app.get("/api/users", getUsers)

//PATCH methods
app.patch("/api/articles/:article_id", patchArticle)



app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)




module.exports = app;