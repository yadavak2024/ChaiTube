import multer from "multer";
import path from "path";
import crypto from "crypto";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, `${crypto.randomBytes(8).toString("hex")}${path.extname(file.originalname)}`)
    }
  })
  
export const upload = multer({ 
    storage, 
})