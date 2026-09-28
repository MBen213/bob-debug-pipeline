import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    message: "Bob Debug Pipeline API",
  });
});

app.post("/api/analyze", (_req, res) => {
  res.json({
    bug: {
      file: "test-project/tests/userService.test.js",
      test: "getUserById(999)",
      expected: "null",
      received: "undefined",
    },

    rootCause:
      "Array.find() returns undefined when no user matches the given ID. The test contract requires null when the user does not exist.",

    regressionTest: {
      name: "getUserById(999)",
      expected: "null",
    },

    fix: {
      file: "test-project/src/userService.js",
      before: "return users.find(user => user.id === id);",
      after: "return users.find(user => user.id === id) ?? null;",
    },

    validation: {
      status: "passed",
      testFile: "tests/userService.test.js",
      testsPassed: 2,
    },
  });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});