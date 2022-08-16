"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requireUser_1 = __importDefault(require("../../middleware/requireUser"));
const video_controller_1 = require("./video.controller");
const router = express_1.default.Router();
router.post("/", requireUser_1.default, video_controller_1.uploadVideoHandler);
router.patch("/:videoId", requireUser_1.default, video_controller_1.updateVideoHandler);
router.get("/:videoId", video_controller_1.streamVideoHandler);
router.get("/", video_controller_1.findVideosHandler);
exports.default = router;
