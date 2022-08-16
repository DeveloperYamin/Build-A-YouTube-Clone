"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_utils_1 = require("../modules/auth/auth.utils");
function deserializeUser(req, res, next) {
    const accessToken = (req.headers.authorization ||
        req.cookies.accessToken ||
        "").replace(/^Bearer\s/, "");
    if (!accessToken) {
        return next();
    }
    const decoded = (0, auth_utils_1.verifyJwt)(accessToken);
    if (decoded) {
        res.locals.user = decoded;
    }
    return next();
}
exports.default = deserializeUser;
