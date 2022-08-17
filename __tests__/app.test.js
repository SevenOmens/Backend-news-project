const app = require("../app")
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require('../db/data/test-data')
const jest_sorted = require('jest-sorted')
const endpointsFile = require('../endpoints.json')


beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
return db.end();
});

describe("GET /api", () => {
  it("Responds with an object containing all endpoints", () => {
     return request(app)
      .get("/api")
      .expect(200)
    .then(({ body}) => {
      const {endpoints} = body
        expect(endpoints).toEqual(endpointsFile)
      });
  })
})

describe('ALL /*', () => {
  it("Responds with status 404 msg: 'URL not found' when passed an endpoint that doesnt exist", () => {
    return request(app)
    .get("/ferrets")
    .expect(404)
      .then(({body}) => {
        console.log(body)
      expect(body).toEqual({msg: 'URL not found'})
    })
  })
})

describe("GET /api/topics", () => {
  it("Responds with an array", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
    .then(({ body }) => {
        const { topics } = body;
        expect(topics).toBeInstanceOf(Array);
      });
  })
  it("responds with an array of topic objects with the slug properties and description", () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
        const { topics } = body;
        expect(topics.length).toBe(3)
        topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  })
})

describe("GET /api/articles/:article_id", () => {
  it("Status 200, responds with a single article with author, title, article_id, body, topic, created_at and votes properties", () => {
    const article_id = 4
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(200)
    .then(( {body} ) => {
      const { result } = body
      expect(result).toEqual(
        expect.objectContaining({
          author: "rogersop",
          title: "Student SUES Mitch!",
          article_id: 4,
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          topic: "mitch",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0
        })
      )
    })
  })
  it("Status 200, responds with a single article with the comment_count property", () => {
        const article_id = 4
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(200)
    .then(( {body} ) => {
      const { result } = body
      expect(result).toEqual(
        expect.objectContaining({
          author: "rogersop",
          title: "Student SUES Mitch!",
          article_id: 4,
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          topic: "mitch",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 0,
          comment_count: 0
        })
      )
    })
 
  })
  it("Responds with status: 404, msg: 'No article found for article_id: 500' when passed an endpoint that doesnt exist", () => {
    const article_id = 500
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: 'No article found for article_id: 500'})
    })
  })
  it("Responds with status 400, msg: 'Invalid Endpoint' when passed a bad endpoint", () => {
    return request(app)
    .get('/api/articles/banana')
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'Invalid Endpoint'})
    })
  })
})

describe('PATCH api/articles/:article_id', () => {
  it("Responds with the specified article, with the votes property updated in line with the inc_votes when the inc_votes property is a positive number", () => {
    const newVotes = {inc_votes: 50}
    return request(app)
    .patch("/api/articles/4")
    .send(newVotes)
    .expect(202)
    .then(({body}) => {
      expect(body.article).toEqual({
        author: "rogersop",          title: "Student SUES Mitch!",
          article_id: 4,
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          topic: "mitch",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: 50
      })
    })
  })
  it("Responds with the specified article, with the votes property updated in line with the inc_votes when the inc_votes property is a negative number", () => {
    const newVotes = {inc_votes: -50}
    return request(app)
    .patch("/api/articles/4")
    .send(newVotes)
    .expect(202)
    .then(({body}) => {
      expect(body.article).toEqual({
        author: "rogersop",
          title: "Student SUES Mitch!",
          article_id: 4,
          body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
          topic: "mitch",
          created_at: "2020-05-06T01:14:00.000Z",
          votes: -50
      })
    })
  })
  it("responds with status 404, msg: No article found for article_id: 500 when passed an endpoint that doesn't exist", () => {
      const article_id = 500
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: 'No article found for article_id: 500'})
    })
  })
   it("Responds with status 400, msg: 'Invalid Endpoint' when passed a bad endpoint", () => {
    return request(app)
    .get('/api/articles/banana')
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'Invalid Endpoint'})
    })
  })
})

describe('GET /api/users', () => {
  it("Responds with an array of user objects with the username, name, and avatar_url properties", () => {
    return request(app)
    .get('/api/users')
    .expect(200)
     .then(({ body }) => {
        const { users } = body;
        expect(users.length).toBe(4)
        users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String)
            })
          );
        });
      });
  })
})

describe('GET /api/articles', () => {
  it("Responds with an array of article objects with the author, title, article_id, topic, created_at, votes and comment_count properties, sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: articles }) => {
        expect(articles.length).toBe(12)
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
             author: expect.any(String),
             title: expect.any(String),
             article_id: expect.any(Number),
             topic: expect.any(String),
             created_at: expect.any(String),
             votes: expect.any(Number),
             comment_count: expect.any(Number)
            })
          );
        });
        expect(articles).toBeSortedBy('created_at', {descending: true})
      });
  })
})

describe('GET /api/articles/:article_id/comments', () => {
  it("Responds with an array of comment objects for the article_id with the comment_id, votes, created_at, author and body properties", () => {
    const article_id = 5
    return request(app)
    .get(`/api/articles/${article_id}/comments`)
    .expect(200)
        .then(({ body }) => {
        expect(body.length).toBe(2)
        body.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
             comment_id: expect.any(Number),
             votes: expect.any(Number),
             created_at: expect.any(String),
             author: expect.any(String),
             body: expect.any(String)
            })
          );
        });
      });
  })
   it("Responds with status 400, msg: 'Invalid Endpoint' when passed a bad endpoint", () => {
    return request(app)
    .get('/api/articles/banana/comments')
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'Invalid Endpoint'})
    })
  })
    it("responds with status 404, msg: No article found for article_id: 500 when passed an endpoint that doesn't exist", () => {
      const article_id = 500
    return request(app)
    .get(`/api/articles/${article_id}/comments`)
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: 'No article found for article_id: 500'})
    })
  })
})

describe('POST /api/articles/:article_id/comments', () => {
  it("Responds with status 201 and the posted comment", () => {
    const newComment = {
      username: "lurker",
      body: "This article is great"
    }
    return request(app)
    .post('/api/articles/5/comments')
    .send(newComment)
    .expect(200)
    .then(({ body}) => {
      expect(body.comment).toEqual({
        comment_id: expect.any(Number),
             votes: expect.any(Number),
             created_at: expect.any(String),
             author: "lurker",
             body: "This article is great",
             article_id: 5
      })
    })
  })
     it("Responds with status 400, msg: 'Invalid Endpoint' when passed a bad endpoint", () => {
    return request(app)
    .get('/api/articles/banana/comments')
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'Invalid Endpoint'})
    })
  })
      it("Responds with status 404, msg: No article found for article_id: 500 when passed an endpoint that doesn't exist", () => {
      const article_id = 500
    return request(app)
    .get(`/api/articles/${article_id}/comments`)
    .expect(404)
    .then(({body}) => {
      expect(body).toEqual({msg: 'No article found for article_id: 500'})
    })
  })
  it("Responds with status 400 msg: 'Comment must have more than 0 characters to post on an article'", () => {
     const badComment = {
      username: "lurker",
      body: ""
    }
     return request(app)
    .post('/api/articles/5/comments')
    .send(badComment)
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'Comment must have more than 0 characters to post on an article'})
    })
  })
  it("Responds with status 400 msg: 'You must be logged in to post a comment. Please log in or register to continue the conversation' when the user doesn't exist", () => {
    const badUser = {
      username: "News_lover",
      body: "I want to comment on this article but I cant :("
    }
      return request(app)
    .post('/api/articles/5/comments')
    .send(badUser)
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'You must be logged in to post a comment. Please log in or register to continue the conversation'})
    })
  })
})

describe('GET /api/articles with queries', () => {
  it("Responds with status 200 Order results by created_at", () => {
    return request(app)
    .get("/api/articles?sort_by=created_at")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('created_at', {descending: true})
    })
  })
   it("Responds with status 200 Order results by comment count", () => {
    return request(app)
    .get("/api/articles?sort_by=comment_count")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('comment_count', {descending: true})
    })
  })
  it("Responds with status 200 Order results by votes", () => {
    return request(app)
    .get("/api/articles?sort_by=votes")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('votes', {descending: true})
    })
  })
  it("Responds with status 200 Order results by author", () => {
    return request(app)
    .get("/api/articles?sort_by=author")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('author', {descending: true})
    })
  })
  it("Responds with status 200 Order results by votes in ascending order", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&order=ASC")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('votes')
    })
  })
  it("Responds with status 200 Order results by author in ascending order", () => {
    return request(app)
    .get("/api/articles?sort_by=author&order=ASC")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('author')
    })
  })
  it("Responds with status 400 msg: 'Not valid sort by criteria' when passed a sort_by clause that doesnt exist", () => {
    return request(app)
    .get("/api/articles?sort_by=ferrets")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'Not valid sort by criteria'})
    })
  })
   it("Responds with status 200 Filters articles by the topic passed in the query", () => {
    return request(app)
    .get("/api/articles?topic=mitch")
    .expect(200)
    .then(({ body: articles }) => {
        expect(articles.length).toBe(11)
        articles.forEach((article) => {
          expect(article).toMatchObject(
            ({
              title: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              topic: "mitch"
            })
          );
        });
      })
    })
      it("Responds with status 400 msg: 'No articles match this topic' when passed a topic clause that doesnt exist", () => {
    return request(app)
    .get("/api/articles?topic=ferrets")
    .expect(400)
    .then(({body}) => {
      expect(body).toEqual({msg: 'No articles match this topic'})
    })
  })
    it("Responds with status 200 Filter articles by mitch topic,order results by votes in ascending order ", () => {
    return request(app)
    .get("/api/articles?sort_by=votes&order=ASC&topic=mitch")
    .expect(200)
    .then(({body: articles}) => {
      expect(articles).toBeSortedBy('votes')
    })
  })
  it("Responds with an array of article objects with the author, title, article_id, topic, created_at, votes and comment_count properties, sorted by date in descending order when no queries are passed", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body: articles }) => {
        expect(articles.length).toBe(12)
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
             author: expect.any(String),
             title: expect.any(String),
             article_id: expect.any(Number),
             topic: expect.any(String),
             created_at: expect.any(String),
             votes: expect.any(Number),
             comment_count: expect.any(Number)
            })
          );
        });
        expect(articles).toBeSortedBy('created_at', {descending: true})
      });
  })
  it("Responds with an array of article objects with the author, title, article_id, topic, created_at, votes and comment_count properties, sorted by date in descending order when passed in queries that don't match anything in the database", () => {
    return request(app)
    .get("/api/articles?ferrets=cute")
    .expect(200)
    .then(({ body: articles }) => {
        expect(articles.length).toBe(12)
        articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
             author: expect.any(String),
             title: expect.any(String),
             article_id: expect.any(Number),
             topic: expect.any(String),
             created_at: expect.any(String),
             votes: expect.any(Number),
             comment_count: expect.any(Number)
            })
          );
        });
        expect(articles).toBeSortedBy('created_at', {descending: true})
      });
  })
  })

  describe('DELETE /api/comments/:comment_id', () => {
    it("Responds with status 204 no content", () => {
      return request(app)
      .delete('/api/comments/6')
      .expect(204)
    })
    it("responds with status 404, msg: 'Invalid Endpoint when passed a comment_id that is invalid", () => {
      return request(app)
      .delete('/api/comments/ferret')
      .expect(400)
      .then(({body}) => {
      expect(body).toEqual({msg: 'Invalid Endpoint'})
    })
  })
})
