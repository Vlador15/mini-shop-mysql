const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const { bd } = require("./models/connect");

const sessionStore = new MySQLStore(
  {
    clearExpired: true,
    checkExpirationInterval: 600000,
    expiration: 600000,
  },
  bd
);

app.use(
  session({
    key: "session_name",
    secret: "session_secret",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);

// middleware
app.disable("x-powered-by");
app.use(express.static(__dirname + "/public"));
app.use(require("cookie-parser")());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set("view engine", "ejs");

app.use(async (req, res, next) => {
  let [category] = await bd.query("SELECT * FROM `category`");
  let result = category.map((x) => ({ path: x.path, name: x.name }));
  req.session.menu = result || [];
  next();
});

// controllers
const mainRouter = require("./routes/main.router");
const productRouter = require("./routes/product.router");
const orderRouter = require("./routes/order.router");
const adminRouter = require("./routes/admin.router");

app.use("/", mainRouter);
app.use("/", productRouter);
app.use("/", orderRouter);
app.use("/admin", adminRouter);

// start
let serverHttp = require("http")
  .createServer(app)
  .listen(5000, function () {
    console.log(`Server start on port: 5000`);
  });
