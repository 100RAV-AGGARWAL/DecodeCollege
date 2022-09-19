const multer = require('multer');

const allowedMimeTypes = ["application/pdf"];

//Configuration for Multer
const multerStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/files");
	},
	filename: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${req.user.id}-${file.originalname}-${Date.now()}.${ext}`);
	},
});

// Multer Filter
const multerFilter = (req, file, cb) => {
	if (allowedMimeTypes.includes(file.mimetype)) {
		cb(null, true);
	} else {
		cb(new Error("Not a PDF"), false);
	}
};

//Calling the "multer" Function
const multerUpload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
module.exports = multerUpload;