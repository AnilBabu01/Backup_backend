const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const routes = require("./routes/v1");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const upload = require("express-fileupload");
const path = require("path");
require("./db/db-connection");



const app = express();


if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}




app.use("*/images", express.static("public/uploads"));
app.use(upload({ limits: { fileSize: 50 * 1024 * 1024 } }));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(xss());
app.use(compression());
app.use(cors());
app.options("*", cors());
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);


app.set('views', __dirname + '../../public');
app.engine('html', require('ejs').renderFile);




app.get('/about', function (req, res){
  res.render('dataFrom.html');
});



// limit repeated failed requests to auth endpoints
// if (config.env === 'production') {
//   app.use('/api/auth', authLimiter);
// }
// v1 api routes
app.use("/api", routes);
// app.use((req, res, next) => {
//   next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
// });
app.use(errorConverter);
app.use(errorHandler);

module.exports = app;
