const {
    fetchTopics
} = require('../Models/app.models')



exports.getTopics = (req, res, next) => {
    fetchTopics().then((topics) => {
        res.send({ topics})
    })
    .catch((err) => {
        next(err)
    })
}