import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 12, query, sortBy = "createdAt", sortType = "desc", userId } = req.query;
  page = Math.max(1, Number(page) || 1); limit = Math.min(50, Math.max(1, Number(limit) || 12));
  const filter = { isPublished: true };
  if (query) filter.$or = [{ title: { $regex: String(query), $options: "i" } }, { description: { $regex: String(query), $options: "i" } }];
  if (userId && isValidObjectId(userId)) filter.owner = userId;
  const allowedSort = ["createdAt", "views", "title"];
  const sortField = allowedSort.includes(sortBy) ? sortBy : "createdAt";
  const sort = { [sortField]: String(sortType).toLowerCase() === "asc" ? 1 : -1 };
  const [videos, total] = await Promise.all([
    Video.find(filter).sort(sort).skip((page - 1) * limit).limit(limit).populate("owner", "username fullName avatar"),
    Video.countDocuments(filter)
  ]);
  return res.status(200).json(new ApiResponse(200, { videos, total, page, limit, totalPages: Math.ceil(total / limit) }, "Videos fetched successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const videoLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;
  if (!title?.trim() || !description?.trim()) throw new ApiError(400, "Title and description are required");
  if (!videoLocalPath || !thumbnailLocalPath) throw new ApiError(400, "Video file and thumbnail are required");
  const [videoFile, thumbnail] = await Promise.all([uploadOnCloudinary(videoLocalPath), uploadOnCloudinary(thumbnailLocalPath)]);
  if (!videoFile?.secure_url && !videoFile?.url) throw new ApiError(500, "Video upload failed. Check Cloudinary configuration.");
  if (!thumbnail?.secure_url && !thumbnail?.url) throw new ApiError(500, "Thumbnail upload failed. Check Cloudinary configuration.");
  const video = await Video.create({ videoFile: videoFile.secure_url || videoFile.url, thumbnail: thumbnail.secure_url || thumbnail.url, title: title.trim(), description: description.trim(), duration: Number(videoFile.duration) || 0, owner: req.user._id });
  return res.status(201).json(new ApiResponse(201, video, "Video published successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  const video = await Video.findOneAndUpdate({ _id: videoId, isPublished: true }, { $inc: { views: 1 } }, { new: true }).populate("owner", "username fullName avatar");
  if (!video) throw new ApiError(404, "Video not found");
  return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  const video = await Video.findOne({ _id: videoId, owner: req.user._id });
  if (!video) throw new ApiError(404, "Video not found or you do not own it");
  if (req.body.title !== undefined) video.title = req.body.title.trim();
  if (req.body.description !== undefined) video.description = req.body.description.trim();
  if (req.file?.path) { const uploaded = await uploadOnCloudinary(req.file.path); if (uploaded) video.thumbnail = uploaded.secure_url || uploaded.url; }
  await video.save();
  return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  const video = await Video.findOneAndDelete({ _id: videoId, owner: req.user._id });
  if (!video) throw new ApiError(404, "Video not found or you do not own it");
  return res.status(200).json(new ApiResponse(200, video, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");
  const video = await Video.findOne({ _id: videoId, owner: req.user._id });
  if (!video) throw new ApiError(404, "Video not found or you do not own it");
  video.isPublished = !video.isPublished; await video.save();
  return res.status(200).json(new ApiResponse(200, video, "Publish status updated"));
});
export { getAllVideos, publishAVideo, getVideoById, updateVideo, deleteVideo, togglePublishStatus };
