const {
    fetchTopics,
    fetchArticle,
    updateArticle,
    fetchUsers,
    fetchAllArticles,
    fetchArticleComments,
    postComment
} = require('../Models/app.models')

const {checkIfArticleExists,
} = require('../Utilities/utilities')

exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.send({ topics})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticle = (req, res, next) => {
    const article = req.params.article_id
    fetchArticle(article).then((result) => {
        res.send({result})
    })
    .catch((err) => {
        next(err)
    })  
}

exports.patchArticle = (req, res, next) => {
    const article = req.params.article_id
    const newVotes = req.body.inc_votes
    updateArticle(article, newVotes).then((article) => {
        res.status(202)
        res.send({article})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getUsers = (req, res, next)  => {
    fetchUsers().then((users) => {
        res.send({users})
    })
    .catch((err) => {
        next(err)
    })
}

exports.getAllArticles = (req, res, next) => {
    const queryObj = req.query 
    const sortBy = queryObj.sort_by
    const orderBy = queryObj.order
    const topicFilter = queryObj.topic
    fetchAllArticles(sortBy, orderBy, topicFilter).then((articles)=> {
        res.send(articles)
    })
    .catch((err) => {
        next(err)
    })
}

exports.getArticleComments = (req, res, next) => {
    const article = req.params.article_id
    Promise.all([fetchArticleComments(article), checkIfArticleExists(article)]).then((result) => {
        res.send(result[0])
    })
    .catch((err) => {
        next(err)
    })
}

exports.postNewComment= (req, res, next) => {
    const article = req.params.article_id
    const newComment = req.body
   postComment(article, newComment)
    .then((result) => {
        res.send({comment: result})
    })
    .catch((err) => {
        next(err)
    })
}