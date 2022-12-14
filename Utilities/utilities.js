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

