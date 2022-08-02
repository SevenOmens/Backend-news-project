const app = require("../app")
const request = require("supertest");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const testData = require('../db/data/test-data')

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
  it('responds with an array of topic objects with the slug properties and description', () => {
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
  it("Responds with status: 404, msg: 'No article found for article_id: 500' when passed an endpoint that doesnt exist", () => {
    const article_id = 500
    return request(app)
    .get(`/api/articles/${article_id}`)
    .expect(404)
    .then(({_body}) => {
      expect(_body).toEqual({msg: 'No article found for article_id: 500'})
    })
  })
  it("responds with status 400, msg: 'Invalid Endpoint' when passed a bad endpoint", () => {
    return request(app)
    .get('/api/articles/banana')
    .expect(400)
    .then(({_body}) => {
      expect(_body).toEqual({msg: 'Invalid Endpoint'})
    })
  })
})


