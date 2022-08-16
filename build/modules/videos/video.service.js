"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findVideos = exports.findVideo = exports.createVideo = void 0;
const video_model_1 = require("./video.model");
function createVideo({ owner }) {
    return video_model_1.VideoModel.create({ owner });
}
exports.createVideo = createVideo;
function findVideo(videoId) {
    return video_model_1.VideoModel.findOne({ videoId });
}
exports.findVideo = findVideo;
function findVideos() {
    return video_model_1.VideoModel.find({
        published: true,
    }).lean();
}
exports.findVideos = findVideos;
