import { Router } from 'express';
import { deleteVideo, getAllVideos, getVideoById, publishAVideo, togglePublishStatus, updateVideo } from "../controllers/video.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
const router = Router();
// Public browsing endpoints
router.route("/").get(getAllVideos);
router.route("/:videoId").get(getVideoById);
// Publishing and management require authentication
router.post("/", verifyJWT, upload.fields([{ name: "videoFile", maxCount: 1 }, { name: "thumbnail", maxCount: 1 }]), publishAVideo);
router.route("/:videoId").delete(verifyJWT, deleteVideo).patch(verifyJWT, upload.single("thumbnail"), updateVideo);
router.route("/toggle/publish/:videoId").patch(verifyJWT, togglePublishStatus);
export default router;
