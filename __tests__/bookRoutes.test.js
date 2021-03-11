process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("../app");
const db = require("../db");
const Book = require("../models/book");

describe("Test Book class", () => {
  beforeEach(async () => {
    await db.query("DELETE FROM books;");

    let b = await Book.create({
      isbn: "0691161518",
      amazon_url: "http://a.co/eobPtX2",
      author: "Matthew Lane",
      language: "english",
      pages: 264,
      publisher: "Princeton University Press",
      title: "Power-Up: Unlocking Hidden Math in Video Games",
      year: 2017,
    });
  });

  describe("POST /books", () => {
    test("create Book validates with correct info", async () => {
      let response = await request(app).post("/books").send({
        isbn: "11111111",
        amazon_url: "http://a.co/eobPtX2",
        author: "TEST BOOK",
        language: "english",
        pages: 264,
        publisher: "SOME TEST PUBLISHER",
        title: "TEST TITLE",
        year: 2021,
      });

      expect(response.body).toEqual({
        book: {
          isbn: "11111111",
          amazon_url: "http://a.co/eobPtX2",
          author: "TEST BOOK",
          language: "english",
          pages: 264,
          publisher: "SOME TEST PUBLISHER",
          title: "TEST TITLE",
          year: 2021,
        },
      });
    });

    test("book with missing info displays status 400 error", async () => {
      let response = await request(app).post("/books").send({
        isbn: "222222222",
        amazon_url: "http://a.co/eobPtX2",
        language: "english",
        pages: 264,
        publisher: "MISSING AUTHOR",
        title: "MISSING AUTHOR",
        year: 2021,
      });

      expect(response.statusCode).toEqual(400);
    });
  });

  describe("PUT /books/:isbn", () => {
    test("update Book validates with correct info", async () => {
      let response = await request(app).put("/books/0691161518").send({
        isbn: "0691161518",
        amazon_url: "http://a.co/eobPtX2",
        author: "TEST BOOK",
        language: "english",
        pages: 264,
        publisher: "SOME TEST PUBLISHER",
        title: "TEST TITLE",
        year: 2021,
      });

      expect(response.body).toEqual({
        book: {
          isbn: "0691161518",
          amazon_url: "http://a.co/eobPtX2",
          author: "TEST BOOK",
          language: "english",
          pages: 264,
          publisher: "SOME TEST PUBLISHER",
          title: "TEST TITLE",
          year: 2021,
        },
      });
      expect(response.statusCode).toEqual(200);
    });

    test("update fails with invalid info, status code 400", async () => {
      let response = await request(app).put("/books/0691161518").send({
        isbn: "11111111",
        amazon_url: "http://a.co/eobPtX2",
        language: "english",
        pages: 264,
        publisher: "SOME TEST PUBLISHER",
        title: "TEST TITLE",
        year: 2021,
      });
      expect(response.statusCode).toEqual(400);
    });
  });
});

afterAll(async function () {
  await db.end();
});
