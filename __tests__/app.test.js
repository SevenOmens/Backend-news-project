const app = require("../app")
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require('../db/data/test-data')
const jest_sorted = require('jest-sorted')

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
return db.end();
});

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
        author: "rogersop",
          title: "Student SUES Mitch!",
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
  it("Responds with an array of user objects with the author, title, article_id, topic, created_at, votes and comment_count properties, sorted by date in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body }) => {
        const { articles } = body;
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