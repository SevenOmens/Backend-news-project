const db = require('../db/connection')

exports.checkIfArticleExists = (id) => {
    return db 
    .query('SELECT * FROM articles WHERE article_id=$1', [id])
    .then(({rows} ) => {
        const artID = rows
        if (artID.length === 0){
            return Promise.reject({
                status:404,
                msg: `No article found for article_id: ${id}`
            })
        } 
    })
}

exports.checkIfUserRegistered = (user) => {
    return db
    .query('SELECT * FROM users WHERE username= $1', [user])
    .then(({rows}) => {
        const userCheck = rows
        if(userCheck.length === 0){
            return Promiuse.reject ({
                status:400,
                msg: 'You must be logged in to post a comment. Please log in or register to continue the conversation'
            })
        }
    })
}