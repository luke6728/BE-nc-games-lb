const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require('../db/seeds/seed.js')
const testData = require('../db/data/test-data/index.js')

afterAll(() => {
  return db.end();
});

beforeEach(() => {
    return seed(testData)
})

describe("/api/categories", () => {
  test("GET - 200: responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        res.body.Categories.forEach((category) =>
          expect(category).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
      });
  });
});

describe("/api/test", () => {
    test("ERR - 404 not found", () => {
        return request(app)
        .get("/api/test")
        .expect(404)
    })
})