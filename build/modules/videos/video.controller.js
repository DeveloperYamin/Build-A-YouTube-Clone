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
exports.findVideosHandler = exports.streamVideoHandler = exports.updateVideoHandler = exports.uploadVideoHandler = void 0;
const busboy_1 = __importDefault(require("busboy"));
const fs_1 = __importDefault(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const video_service_1 = require("./video.service");
const MIME_TYPES = ["video/mp4"];
const CHUNK_SIZE_IN_BYTES = 1000000; // 1mb
function getPath({ videoId, extension, }) {
    return `${process.cwd()}/videos/${videoId}.${extension}`;
}
function uploadVideoHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const bb = (0, busboy_1.default)({ headers: req.headers });
        const user = res.locals.user;
        const video = yield (0, video_service_1.createVideo)({ owner: user._id });
        bb.on("file", (_, file, info) => __awaiter(this, void 0, void 0, function* () {
            if (!MIME_TYPES.includes(info.mimeType)) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("Invalid file type");
            }
            const extension = info.mimeType.split("/")[1];
            const filePath = getPath({
                videoId: video.videoId,
                extension,
            });
            video.extension = extension;
            yield video.save();
            const stream = fs_1.default.createWriteStream(filePath);
            file.pipe(stream);
        }));
        bb.on("close", () => {
            res.writeHead(http_status_codes_1.StatusCodes.CREATED, {
                Connection: "close",
                "Content-Type": "application/json",
            });
            res.write(JSON.stringify(video));
            res.end();
        });
        return req.pipe(bb);
    });
}
exports.uploadVideoHandler = uploadVideoHandler;
function updateVideoHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { videoId } = req.params;
        const { title, description, published } = req.body;
        const { _id: userId } = res.locals.user;
        const video = yield (0, video_service_1.findVideo)(videoId);
        if (!video) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("Video not found");
        }
        if (String(video.owner) !== String(userId)) {
            return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).send("Unauthorized");
        }
        video.title = title;
        video.description = description;
        video.published = published;
        yield video.save();
        return res.status(http_status_codes_1.StatusCodes.OK).send(video);
    });
}
exports.updateVideoHandler = updateVideoHandler;
function streamVideoHandler(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const { videoId } = req.params;
        const range = req.headers.range;
        if (!range) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).send("range must be provided");
        }
        const video = yield (0, video_service_1.findVideo)(videoId);
        if (!video) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("video not found");
        }
        const filePath = getPath({
            videoId: video.videoId,
            extension: video.extension,
        });
        const fileSizeInBytes = fs_1.default.statSync(filePath).size;
        const chunkStart = Number(range.replace(/\D/g, ""));
        const chunkEnd = Math.min(chunkStart + CHUNK_SIZE_IN_BYTES, fileSizeInBytes - 1);
        const contentLength = chunkEnd - chunkStart + 1;
        const headers = {
            "Content-Range": `bytes ${chunkStart}-${chunkEnd}/${fileSizeInBytes}`,
            "Accept-Ranges": "bytes",
            "Content-length": contentLength,
            "Content-Type": `video/${video.extension}`,
            "Cross-Origin-Resource-Policy": "cross-origin",
        };
        res.writeHead(http_status_codes_1.StatusCodes.PARTIAL_CONTENT, headers);
        const videoStream = fs_1.default.createReadStream(filePath, {
            start: chunkStart,
            end: chunkEnd,
        });
        videoStream.pipe(res);
    });
}
exports.streamVideoHandler = streamVideoHandler;
function findVideosHandler(_, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const videos = yield (0, video_service_1.findVideos)();
        return res.status(http_status_codes_1.StatusCodes.OK).send(videos);
    });
}
exports.findVideosHandler = findVideosHandler;
