"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const routes_1 = __importDefault(require("./routes"));
const express_session_1 = __importDefault(require("express-session"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const livereload_1 = __importDefault(require("livereload"));
const connect_livereload_1 = __importDefault(require("connect-livereload"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const app = (0, express_1.default)();
const PORT = process.env.PORT;
app.set("view engine", "ejs");
app.set("layout", "layouts/main");
app.set("views", path_1.default.join(__dirname, "views"));
app.use(express_ejs_layouts_1.default);
app.use(express_1.default.json());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
const liverReloadServer = livereload_1.default.createServer();
liverReloadServer.watch(path_1.default.join(__dirname + "/views"));
liverReloadServer.watch(path_1.default.join(__dirname + "/public"));
app.use((0, connect_livereload_1.default)());
liverReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liverReloadServer.refresh("/");
    }, 100);
});
app.use((0, express_session_1.default)({
    secret: `${process.env.SESSION_SECRET}`,
    resave: false,
    saveUninitialized: true,
}));
app.use((0, connect_flash_1.default)());
// Make flash messages available in all views
app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});
app.use("/", routes_1.default);
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
