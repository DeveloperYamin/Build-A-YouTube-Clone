"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerUserSchema = void 0;
const zod_1 = require("zod");
exports.registerUserSchema = {
    body: (0, zod_1.object)({
        username: (0, zod_1.string)({
            required_error: "username is required",
        }),
        email: (0, zod_1.string)({
            required_error: "email is required",
        }).email("must be a valid email"),
        password: (0, zod_1.string)({
            required_error: "password is required",
        })
            .min(6, "Password must be at least 6 characters long")
            .max(64, "Password should not be longer than 64 characters"),
        confirmPassword: (0, zod_1.string)({
            required_error: "username is required",
        }),
    }).refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
        path: ["confirmPassword"],
    }),
};
