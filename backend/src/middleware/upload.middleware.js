import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, res, cb) => {
    if (file.mimeType.startWith) {
        cb(null, true);
    } else {
        cb(new Error("Only images files are allowed"), false);
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

export default upload;