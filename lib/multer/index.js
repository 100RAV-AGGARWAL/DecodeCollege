const multer = require('multer');
const { google } = require('googleapis');
const GoogleDriveStorage = require('multer-google-drive');
const path = require('path');

const allowedMimeTypes = ["application/pdf"];

const KEYFILEPATH = path.join(__dirname, '..', '..', 'decodecollege-googleauth.json');
const SCOPES = ['https://www.googleapis.com/auth/drive'];
const auth = new google.auth.GoogleAuth({
	keyFile: KEYFILEPATH,
	scopes: SCOPES,
});
const drive = google.drive({ version: 'v3', auth: auth });

//Configuration for Multer
// const multerStorage = multer.diskStorage({
// 	destination: (req, file, cb) => {
// 		cb(null, "uploads/files");
// 	},
// 	filename: (req, file, cb) => {
// 		const ext = file.mimetype.split("/")[1];
// 		cb(null, `${req.user.id}-${file.originalname}-${Date.now()}.${ext}`);
// 	},
// });

const multerStorage = GoogleDriveStorage({
	drive: drive,
	parents: '1jP5kx6-06sAnp0jdDKiijKSJ0o4V3qv9',
	fileName: (req, file, cb) => {
		const ext = file.mimetype.split("/")[1];
		cb(null, `${req.user.id}-${file.originalname}-${Date.now()}.${ext}`);
	}
})

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