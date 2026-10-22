import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const healthcheck = asyncHandler(async (_req, res) => {
  return res.status(200).json(new ApiResponse(200, { status: "ok", uptime: process.uptime() }, "API is healthy"));
});
export { healthcheck };
