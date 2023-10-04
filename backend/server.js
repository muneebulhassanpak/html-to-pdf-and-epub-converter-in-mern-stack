require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());

const fileRoute = require("./routes/FileUpload");

app.use("/api", fileRoute);

app.get("/test", (req, res, next) => {
  return res.json({
    message: "hello from server",
  });
});

app.use((err, req, res, next) => {
  const code = err.status;
  return res.status(code || 500).json({
    message: err.message || "Something went wrong",
    success: false,
    status: 500,
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
