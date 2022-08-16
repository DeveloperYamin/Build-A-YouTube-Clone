"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVideoSchema = void 0;
const zod_1 = require("zod");
exports.updateVideoSchema = {
    body: (0, zod_1.object)({
        title: (0, zod_1.string)(),
        description: (0, zod_1.string)(),
        published: (0, zod_1.boolean)(),
    }),
    params: (0, zod_1.object)({
        videoId: (0, zod_1.string)(),
    }),
};
