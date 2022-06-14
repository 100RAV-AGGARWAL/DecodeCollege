// const path = require('path');
// const fs = require('fs');
// const aws = require('aws-sdk');
// const multerS3 = require('multer-s3');
// const multer = require('multer');
// const { to, ReE, ReS } = require('../../services/util.service');
// const config = require("config");
// const s3Config = config.get("s3");

// aws.config.update({
// 	secretAccessKey: s3Config.images.secretKey,
// 	accessKeyId: s3Config.images.accessKey,
// 	region: s3Config.images.region
// });

// s3 = new aws.S3();
// const bucketName = s3Config.images.bucket;

// const storage = multerS3({
// 	s3: s3,
// 	bucket: bucketName,
// 	acl: 'public-read',
// 	key: function (req, file, cb) {
// 		console.log(file);
// 		let ext = file.originalname.split(".");
// 		ext = ext[ext.length - 1];
// 		cb(null, req.modifiedFileName + ext);
// 	}
// })


// const uploadImage = function (fileOptions) {
// 	let fileSize = 1024 * 1024;
// 	if (fileOptions.maxSizeAllowed) {
// 		fileSize = fileOptions.maxSizeAllowed
// 	}
// 	return multer({
// 		storage: storage, limits: { fileSize: fileSize }, fileFilter: (req, file, cb) => {
// 			if (!fileOptions.fileTypeAllowed.includes(file.mimetype)) {
// 				return cb(new Error('File type is not allowed'))
// 			}

// 			cb(null, true)
// 		}
// 	}).single('image');
// }
// //export the created function
// exports.uploadImage = uploadImage;

// exports.deleteImage = async function (key) {
// 	let params = { Bucket: bucketName, Key: key };
// 	let err, data;
// 	[err, data] = await to(new Promise((resolve, reject) => {
// 		s3.deleteObject(params, function (err, data) {
// 			if (err) reject(err);  // error
// 			else resolve(data);                 // deleted
// 		});
// 	}));
// 	if (err) {
// 		throw err
// 	} return data;
// }