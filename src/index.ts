import "dotenv/config";
import express from "express";
import morgan from "morgan";
import path from "path";
import indexRouter from "./routes";
import session from "express-session";
import flash from "connect-flash";
import livereload from "livereload";
import connectLivereload from "connect-livereload";
import expressLayouts from "express-ejs-layouts";

const app = express();
const PORT = process.env.PORT;

app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.set("views", path.join(__dirname, "views"));

app.use(expressLayouts);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

const liverReloadServer = livereload.createServer();
liverReloadServer.watch(path.join(__dirname + "/views"));
liverReloadServer.watch(path.join(__dirname + "/public"));

app.use(connectLivereload());
liverReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liverReloadServer.refresh("/");
  }, 100);
});

app.use(
  session({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(flash());
// Make flash messages available in all views
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
