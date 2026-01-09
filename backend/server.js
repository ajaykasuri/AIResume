const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
require("./register")

// Load env
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/resumes", require("./routes/resumeRoutes"));
app.use("/api/sections", require("./routes/sectionRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/ai", require("./routes/aiRoutes"));
app.use("/api/summary",require("./routes/summaryRoutes")) 

app.get("/", (req, res) =>
  res.json({ status: "Server is running " })
);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () =>
  console.log(` Server listening on port ${PORT}`)
);
