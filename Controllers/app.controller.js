const {
    fetchTopics,
    fetchArticle
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