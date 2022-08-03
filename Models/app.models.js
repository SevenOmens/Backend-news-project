const db = require("../db/connection")

exports.fetchTopics = () => {
    return db
    .query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
}

exports.fetchArticle = (id) => {
    return db
    .query('SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id WHERE articles.article_id=$1 GROUP BY articles.article_id', [id])
    .then(({rows} ) => {
        if (artID.length === 0){
            return Promise.reject({
                status:404,
                msg: `No article found for article_id: ${id}`
            })
        } 
        return rows[0]
    })
}


exports.updateArticle = (id, votes) => {
    return db
    .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [votes, id])
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

exports.fetchUsers = () => {
    return db
    .query('SELECT * FROM users').then(({ rows }) => {
        return rows
    })
}