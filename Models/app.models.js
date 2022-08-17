const db = require("../db/connection")
const fs = require('fs/promises')

exports.fetchEndpoints = () => {
    return fs.readFile(`${__dirname}/../endpoints.json`, "utf-8").then(
    (endpoints) => {
      return endpoints
    }
  );
}

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
        .then(({ rows }) => {
            const artID = rows
            if (artID.length === 0) {
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article_id: ${id}`
                })
            }
            return rows[0]
        })
}


exports.updateArticle = (id, votes) => {
    return db
        .query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [votes, id])
        .then(({ rows }) => {
            const artID = rows
            if (artID.length === 0) {
                return Promise.reject({
                    status: 404,
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

exports.fetchAllArticles = (sort, order, topic) => {
    let baseQuery = 'SELECT articles.*, COUNT (comments.article_id) :: INTEGER AS comment_count FROM articles LEFT JOIN comments ON comments.article_id = articles.article_id ' 
    let validQueries = ["created_at", "title", "author", "votes", "comment_count"]
   
     if (topic) {
            let topicQuery = `WHERE articles.topic=$1`
            baseQuery += topicQuery
            }
        
    
        baseQuery += ' GROUP BY articles.article_id '
    
    if (!sort) {
        baseQuery += 'ORDER BY created_at'
    }
     

    if (sort) {
        if (!validQueries.includes(sort)) {
            return Promise.reject({
                status: 400,
                msg: 'Not valid sort by criteria'
            })
        }
         let optionalQueryOne = 'ORDER BY '
        for (let i = 0; i < validQueries.length; i++) {
            if (sort === validQueries[i]) {
                optionalQueryOne += validQueries[i]
                baseQuery += optionalQueryOne
            }
        }
    } 
    
    if (!order) {
        baseQuery += " DESC"
    } else {
        if (order = " ASC") {
            baseQuery += " ASC"
        }
    }

    if (!topic){
    return db
        .query(baseQuery)
        .then(({ rows }) => {
            return rows
        })
    } else{
        return db
        .query(baseQuery, [topic])
        .then(({ rows }) => {
            if (rows.length === 0){
                return Promise.reject({
                    status: 400,
                    msg: 'No articles match this topic'
                })
            }
            return rows
        })
    }

}

exports.fetchArticleComments = (id) => {
    return db
        .query('SELECT * FROM comments WHERE article_id = $1', [id])
        .then(({ rows }) => {
            return rows
        })
}

exports.postComment = (id, comment) => {
    const commBody = comment.body
    const commAuth = comment.username
    if (commBody.length === 0) {
        return Promise.reject({
            status: 400,
            msg: 'Comment must have more than 0 characters to post on an article'
        })
    }
    return db
        .query(`INSERT INTO comments (body, author, article_id) 
    VALUES ($1, $2, $3) RETURNING *;`, [commBody, commAuth, id])
        .then(({ rows }) => {
            return rows[0]
        })


}

exports.removeComment = (comment) => {
    return db
    .query('DELETE FROM comments WHERE comment_id=$1', [comment])
    .then((result) => {
        return result
    })
}