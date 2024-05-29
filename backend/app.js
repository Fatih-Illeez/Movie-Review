const express = require("express");
require("./db");
const userRouter = require("./routes/user");

const app = express();
app.use(express.json());
app.use("/api/user", userRouter);

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

app.post(
  "/sign-in",
  (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.json("Missing email or password");
    }
    next();
  },
  (req, res) => {
    res.send("<h1>About Page</h1>");
  }
);

app.listen(8000, () => {
  console.log("Listening on port 8000");
});
