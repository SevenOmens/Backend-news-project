const express = require("express");
const app = express();
const seed = require ('./db/seeds/seed')
app.use(express.json());



const {
    getTopics,
    getArticle,
    patchArticle,
    getUsers,
    getAllArticles,
    getArticleComments,
    postNewComment,
    deleteComment
} = require ('./Controllers/app.controller')

const{
    handleCustomErrors,
    handleServerErrors,
    handlePsqlErrors
} = require ('./Errors/index')


//GET methods
app.get("/api/topics", getTopics)
app.get("/api/articles", getAllArticles)
app.get("/api/users", getUsers)
app.get("/api/articles/:article_id", getArticle)
app.get("/api/articles/:article_id/comments", getArticleComments)

//PATCH methods
app.patch("/api/articles/:article_id", patchArticle)

//POST methods
app.post("/api/articles/:article_id/comments", postNewComment)

//DELETE methods
app.delete("/api/comments/:comment_id", deleteComment)


app.use(handleCustomErrors)
app.use(handlePsqlErrors)
app.use(handleServerErrors)




module.exports = app;