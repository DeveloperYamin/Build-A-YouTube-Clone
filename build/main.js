"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./utils/database");
const helmet_1 = __importDefault(require("helmet"));
const user_route_1 = __importDefault(require("./modules/user/user.route"));
const auth_route_1 = __importDefault(require("./modules/auth/auth.route"));
const video_route_1 = __importDefault(require("./modules/videos/video.route"));
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}));
app.use((0, helmet_1.default)());
app.use(deserializeUser_1.default);
app.get("/", (req, res) => res.send("Hello World!"));
app.use("/api/users", user_route_1.default);
app.use("/api/auth", auth_route_1.default);
app.use("/api/videos", video_route_1.default);
console.log("process.env.NODE_ENV", process.env.NODE_ENV);
const server = app.listen(process.env.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, database_1.connectToDatabase)();
    console.log(`Server listening at http://localhost:${process.env.PORT}`);
}));
const signals = ["SIGTERM", "SIGINT"];
function gracefulShutdown(signal) {
    process.on(signal, () => __awaiter(this, void 0, void 0, function* () {
        console.log("Goodbye, got signal", signal);
        server.close();
        // disconnect from the db
        yield (0, database_1.disconnectFromDatabase)();
        console.log("My work here is done");
        process.exit(0);
    }));
}
for (let i = 0; i < signals.length; i++) {
    gracefulShutdown(signals[i]);
}
