const db = require("../db/connection")

exports.fetchTopics = () => {
    return db
    .query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
}

exports.fetchArticle = (ID) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1', [ID])
    .then(({rows} ) => {
        const artID = rows
        if (artID.length === 0){
            return Promise.reject({
                status:404,
                msg: `No article found for article_id: ${ID}`
            })
        } 
        return rows[0]
    })
}

exports.updateArticle = (ID, votes) => {
    return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [votes, ID])
    .then(({rows}) => {
        const artID = rows
        if (artID.length === 0){
            return Promise.reject({
                status:404,
                msg: `No article found for article_id: ${ID}`
            })
        } 
        return rows[0]
    })
}

