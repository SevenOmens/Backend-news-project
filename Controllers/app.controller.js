const {
    fetchTopics,
    fetchArticle,
    updateArticle
} = require('../Models/app.models')



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
