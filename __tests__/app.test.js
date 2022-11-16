const request = require("supertest");
const app = require("../app.js");
const db = require("../db/connection.js");
const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data/index.js");

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("/api/categories", () => {
  test("GET - 200: responds with an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((res) => {
        res.body.categoriesArr.forEach((category) =>
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
    return request(app).get("/api/test").expect(404);
  });
});

describe("/api/reviews", () => {
  test("GET - 200: responds with an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((res) => {
        res.body.reviews.forEach((review) =>
          expect(review).toMatchObject({
            title: expect.any(String),
            designer: expect.any(String),
            owner: expect.any(String),
            review_img_url: expect.any(String),
            review_body: expect.any(String),
            category: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
});

describe("/api/reviews/review_id", () => {
  test("GET - 200: responds with an object of specified review", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          title: "Agricola",
          designer: "Uwe Rosenberg",
          owner: "mallionaire",
          review_img_url:
            "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
          review_body: "Farmyard fun!",
          category: "euro game",
          created_at: expect.any(String),
          votes: 1,
          review_id: 1,
        });
      });
  });
});

describe("/api/review/review_id", () => {
  test("ERR - 404 not found - review ID", () => {
    return request(app)
      .get("/api/reviews/99")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid review id");
      });
  });
});

describe("/api/review/review_id", () => {
  test("ERR - 400 bad request, string input", () => {
    return request(app)
      .get("/api/reviews/test")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});
