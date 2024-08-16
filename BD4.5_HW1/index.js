//npm install express sqlite3 sqlite
//node BD4.5_HW1/initDB.js
//node BD4.5_HW1
const { Console } = require("console");
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

const app = express();
const PORT = process.env.PORT || 3000;
let db;

(async () => {
  db = await open({
    filename: "./BD4.5_HW1/database.sqlite",
    driver: sqlite3.Database,
  });
})();

app.get("/", (req, res) => {
  res.status(200).json({ message: "BD4.5_HW1" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

/*
Exercise 1: Fetch Courses by Minimum Rating

Create an endpoint /courses/rating to return courses with a rating greater than a specified value.

Declare a variable minRating to store the query parameter

Create a function filterCoursesByRating to fetch the courses from the database based on the minimum rating.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses/rating?minRating=4
*/
// function to fetch courses by minimum rating
async function filterCoursesByRating(minRating) {
  let query = "SELECT * FROM courses WHERE rating > ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [minRating]);
    if (!result || result.length == 0) {
      throw new Error(
        "No Courses found with rating greater than :" + minRating,
      );
    }
    return { courses: result };
  } catch (error) {
    console.log("Error in fetching Courses ", error.message);
    throw error;
  }
}
// end point to fetch courses by minimum rating
app.get("/courses/rating", async (req, res) => {
  try {
    let minRating = req.query.minRating;
    let result = await filterCoursesByRating(minRating);
    console.log(
      "Succesfully fetched " +
        result.courses.length +
        " courses with rating greater than :" +
        minRating,
    );
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "No Courses found with rating greater than :" + minRating
    ) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
/*
Exercise 2: Fetch Courses by Instructor and Minimum Duration

Create an endpoint /courses/instructor-duration to return courses by a specific instructor with a duration greater than a specified value.

Declare 2 variables instructor & minDuration to store query parameters.

Create a function filterCoursesByInstructorAndDuration to fetch the courses from the database based on the instructor and greater than minimum duration.

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses/instructor-duration?instructor=Instructor%20A&minDuration=7
*/
// function to fetch courses by instructor and minimum duration
async function filterCoursesByInstructorAndDuration(instructor, minDuration) {
  let query = "SELECT * FROM courses WHERE instructor = ? AND duration > ?";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, [instructor, minDuration]);
    if (!result || result.length == 0) {
      throw new Error(
        "No Courses found with instructor :" +
          instructor +
          " and duration greater than :" +
          minDuration,
      );
    }
    return { courses: result };
  } catch (error) {
    console.log("Error in fetching Courses ", error.message);
    throw error;
  }
}
// end point to fetch courses by instructor and minimum duration
app.get("/courses/instructor-duration", async (req, res) => {
  try {
    let instructor = req.query.instructor;
    let minDuration = req.query.minDuration;
    let result = await filterCoursesByInstructorAndDuration(
      instructor,
      minDuration,
    );
    console.log(
      "Succesfully fetched " +
        result.courses.length +
        " courses with instructor :" +
        instructor +
        " and duration greater than :" +
        minDuration,
    );
    return res.status(200).json(result);
  } catch (error) {
    if (
      error.message ===
      "No Courses found with instructor :" +
        instructor +
        " and duration greater than :" +
        minDuration
    ) {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});

/*
Exercise 3: Fetch Courses Ordered by Price

Create an endpoint /courses/ordered-by-price to return courses ordered by price in descending order.

Create a function fetchCoursesOrderedByPrice to fetch the courses from the database and order them by price. ( highest to lowest price )

Wrap the function call in a try-catch block.

Ensure that errors are caught and return res.status(500).json({ error: error.message }) if anything goes wrong.

Return a 404 error if no data is found.

API Call:

http://localhost:3000/courses/ordered-by-price
*/
// function to fetch courses ordered by price
async function fetchCoursesOrderedByPrice() {
  let query = "SELECT * FROM courses ORDER BY price DESC";
  try {
    if (!db) {
      throw new Error("Database not connected");
    }
    let result = await db.all(query, []);
    if (!result || result.length == 0) {
      throw new Error("No Courses found");
    }
    return { courses: result };
  } catch (error) {
    console.log("Error in fetching Courses ", error.message);
    throw error;
  }
}
// end point to fetch courses ordered by price
app.get("/courses/ordered-by-price", async (req, res) => {
  try {
    let result = await fetchCoursesOrderedByPrice();
    console.log(
      "Succesfully fetched " +
        result.courses.length +
        " courses ordered by price",
    );
    return res.status(200).json(result);
  } catch (error) {
    if (error.message === "No Courses found") {
      return res.status(404).json({ status: 404, error: error.message });
    } else {
      return res.status(500).json({ status: 500, error: error.message });
    }
  }
});
