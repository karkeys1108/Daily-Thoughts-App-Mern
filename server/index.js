const express = require("express");
require("dotenv").config();
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRouter = require("./routes/userRouter");
const corsOptions = {
  origin: true,
  credentials: true,
  exposedHeaders:["Set-cookie"]
};
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.set("trust  proxy", 1);
app.use("/api/v1", userRouter);
require("./config/connectDb").connectDb();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
