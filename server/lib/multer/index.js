const multer = require('multer');

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
	if (file.mimetype.split("/")[1] === "pdf" || file.mimetype.split("/")[1] === "docx") {
		cb(null, true);
	} else {
		cb(new Error("Not a PDF or a DOCX File"), false);
	}
};

//Calling the "multer" Function
const multerUpload = multer({
	storage: multerStorage,
	fileFilter: multerFilter,
});
module.exports = multerUpload;