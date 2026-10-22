
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null;
        }

        // Read credentials when upload is called
        const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
        const apiKey = process.env.CLOUDINARY_API_KEY;
        const apiSecret = process.env.CLOUDINARY_API_SECRET;

        console.log("Cloudinary config check:", {
            cloudNameLoaded: Boolean(cloudName),
            apiKeyLoaded: Boolean(apiKey),
            apiSecretLoaded: Boolean(apiSecret)
        });

        if (!cloudName || !apiKey || !apiSecret) {
            throw new Error("Cloudinary credentials missing from .env");
        }

        // Configure Cloudinary before uploading
        cloudinary.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret
        });

        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        });

        console.log("Cloudinary upload successful:", response.secure_url);

        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return response;

    } catch (error) {
        console.error("Cloudinary upload failed:", error.message);

        if (localFilePath && fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        return null;
    }
};

export { uploadOnCloudinary };
