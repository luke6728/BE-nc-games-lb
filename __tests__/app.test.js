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
  test("GET - 200: responds with an object of specified review - comment count", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((res) => {
        expect(res.body.review).toMatchObject({
          title: 'Jenga',
          designer: 'Leslie Scott',
          owner: 'philippaclaire9',
          review_img_url:
            'https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png',
          review_body: 'Fiddly fun for all the family',
          category: 'dexterity',
          created_at: expect.any(String),
          votes: 5,
          comment_count: "3"
        });
      });
  });

  test("ERR - 404 not found - review ID", () => {
    return request(app)
      .get("/api/reviews/99")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid review id");
      });
  });

  test("ERR - 400 bad request, string input", () => {
    return request(app)
      .get("/api/reviews/test")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });

  test("PATCH - 200: when correct info passed, update votes field, respond with updated review object", () => {
    const updatedInfo = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedInfo)
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
          votes: 3,
        });
      });
  });
  test(" PATCH - 400  when no info passed, respond with 400", () => {
    const updatedInfo = {};
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedInfo)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test(" PATCH - 400  when incorrect info passed, respond with 400", () => {
    const updatedInfo = {
      inc_votes: "test",
    };
    return request(app)
      .patch("/api/reviews/1")
      .send(updatedInfo)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test(" PATCH - 404 not found - review ID", () => {
    const updatedInfo = { inc_votes: 2 };
    return request(app)
      .patch("/api/reviews/99")
      .send(updatedInfo)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid review id");
      });
  });
  test("ERR - 400 bad request, string input", () => {
    return request(app)
      .patch("/api/reviews/test")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("/api/reviews/review_id/comments", () => {
  test("GET - 200: responds with an object of specified review", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toMatchObject([
          {
            comment_id: 1,
            body: "I loved this game too!",
            review_id: 2,
            author: "bainesface",
            votes: 16,
            created_at: expect.any(String),
          },
          {
            comment_id: 4,
            body: "EPIC board game!",
            review_id: 2,
            author: "bainesface",
            votes: 16,
            created_at: expect.any(String),
          },
          {
            comment_id: 5,
            body: "Now this is a story all about how, board games turned my life upside down",
            review_id: 2,
            author: "mallionaire",
            votes: 13,
            created_at: expect.any(String),
          },
        ]);
      });
  });
});

describe("GET /api/reviews/review_id/comments", () => {
  test("GET - 200: responds with an empty array when no comments are available", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body.comments).toMatchObject([]);
      });
  });

  test("ERR - 404 no comment available for review id", () => {
    return request(app)
      .get("/api/reviews/99/comments")
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid review id");
      });
  });

  test("ERR - 400 bad request, string input", () => {
    return request(app)
      .get("/api/reviews/test/comments")
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/review/review_id/comments", () => {
  test("POST - 201: add a comment to the database and respond with newly created comment", () => {
    const newComment = {
      body: "WOW best game this year!",
      username: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(201)
      .then((res) => {
        expect(res.body.comment).toMatchObject({
          comment_id: 7,
          body: "WOW best game this year!",
          votes: 0,
          author: "mallionaire",
          review_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("ERR - 400: when no info passed, respond with 400", () => {
    const newComment = {};
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(400)
      .then((res) => {
        expect(res.body.msg).toBe("bad request");
      });
  });
  test("ERR - 404 invalid username", () => {
    const newComment = {
      body: "WOW best game this year!",
      username: "luke6728",
    };
    return request(app)
      .post("/api/reviews/1/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid username");
      });
  });
  test("ERR - 404 no review available for comment post", () => {
    const newComment = {
      body: "WOW best game this year!",
      username: "mallionaire",
    };
    return request(app)
      .post("/api/reviews/99/comments")
      .send(newComment)
      .expect(404)
      .then((res) => {
        expect(res.body.msg).toBe("invalid review id");
      });
  });
});

describe("/api/users", () => {
  test("GET /api/users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((res) => {
        res.body.users.forEach((user) =>
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          })
        );
      });
  });
});
