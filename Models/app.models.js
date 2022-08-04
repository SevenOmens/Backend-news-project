const db = require("../db/connection")

exports.fetchTopics = () => {
    return db
    .query('SELECT * FROM topics').then(({ rows }) => {
        return rows
    })
}

exports.fetchArticle = (id) => {
    return db
    .query(`SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles  
    LEFT JOIN comments ON comments.article_id = articles.article_id 
    WHERE articles.article_id=$1 GROUP BY articles.article_id`, [id])
    .then(({rows} ) => {
        const artID = rows
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

exports.fetchAllArticles = () => {
    return db
    .query('SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id  GROUP BY articles.article_id ORDER BY created_at DESC')
    .then(({rows}) => {
        return rows
    })
}

exports.fetchArticleComments = (id) => {
    return db
    .query('SELECT * FROM comments WHERE article_id = $1', [id])
    .then(({rows}) => {
        return rows
    })
}

exports.postComment = (id, comment) => {
     const commBody = comment.body 
     const commAuth = comment.username
     if(commBody.length === 0){
        return Promise.reject({
            status: 400,
            msg: 'Comment must have more than 0 characters to post on an article'
        })
     }
     return db
   .query( `INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) RETURNING *;`, [commBody, commAuth, id])
    .then(({rows})=> {
       return rows[0]
    })

  
}