const express = require("express");
const cors = require("cors");
const app = express();
app.use(express.json());
app.use(cors());

const signup = require("./routes/signup");
const signin = require("./routes/signin");
const products = require("./routes/products");
const cart = require("./routes/cart");
const orders = require("./routes/order");

app.get("/", (req, res) => {
  res.send("hello")
})

app.use("/signup", signup);
app.use("/signin", signin);
app.use("/", products);
app.use("/", cart);
app.use("/", orders);

app.listen(4000, () => console.log("server running"))