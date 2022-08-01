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
  });
  it('responds with an array of topic objects with the slug properties and description', () => {
    return request(app)
    .get("/api/topics")
    .expect(200)
    .then(({ body }) => {
        const { topics } = body;
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
});



