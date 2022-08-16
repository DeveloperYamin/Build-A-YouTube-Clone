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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserHandler = void 0;
const http_status_codes_1 = require("http-status-codes");
const user_service_1 = require("./user.service");
function registerUserHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, email, password } = req.body;
        try {
            yield (0, user_service_1.createUser)({ username, email, password });
            return res.status(http_status_codes_1.StatusCodes.CREATED).send("user created successfully");
        }
        catch (e) {
            if (e.code === 11000) {
                return res.status(http_status_codes_1.StatusCodes.CONFLICT).send("User already exists");
            }
            return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send(e.message);
        }
    });
}
exports.registerUserHandler = registerUserHandler;
