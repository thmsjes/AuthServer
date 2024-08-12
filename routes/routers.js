const router = require('express').Router();
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const Connection = require('../database/connection');
const RegisterAndAuthentication = require('../controllers/registerAndAuthentication.js');
const userSchema = require('../models/users');
const HandleUploadData = require('../controllers/fileUploader');
const Data = require('../models/dealerData');
const { default: mongoose } = require('mongoose');

router.post('/register', async (req, res) => {
	try {
		const { users } = await Connection.connect();
		const user = await RegisterAndAuthentication.registerNewUser(req, users);
		const User = mongoose.model('User', userSchema);
		const newUser = new User(user);
		await users.insertOne(newUser);
		res.send({ message: 'success' });
	} catch (error) {
		console.log(error);
		return res.status(error.httpStatus).send({
			code: error.code,
			message: error.message,
		});
	}
});

router.post('/login', async (req, res) => {
	try {
		const { users } = await Connection.connect();
		const validatedUser = await RegisterAndAuthentication.login(req, users);
		validatedUser.password = undefined;
		const token = jwt.sign({ validatedUser }, process.env.SECRET);
		res.cookie('jwt', token, { httpOnly: true, maxAge: 360000 });
		res.send({ message: 'Success' });
	} catch (error) {
		return res.status(error.httpStatus).send({
			code: error.code,
			message: error.message,
		});
	}
});

router.get('/user', async (req, res) => {
	try {
		const { users } = await Connection.connect();
		await RegisterAndAuthentication.verifyCookie(req?.cookies?.['jwt'], users);
		const user = await RegisterAndAuthentication.checkForExistingUser(
			req.body.email,
			users,
		);
		if (!user)
			throw {
				code: 5,
				httpStatus: 404,
				message: `No user found with an email address of: ${req.body.email}`,
			};
		user.password = undefined;
		res.send({ user });
	} catch (error) {
		return res.status(error.httpStatus).send({
			code: error.code,
			message: error.message,
		});
	}
});

router.post(
	'/data',
	fileUpload({ createParentPath: true }),
	async (req, res) => {
		try {
			const { datas } = await Connection.connect();
			await RegisterAndAuthentication.verifyCookie(req.cookies['jwt']);
			const { headerInfo, translatedData } = await HandleUploadData.handleData(
				req.files,
				req.headers,
			);
			const response = await HandleUploadData.saveDealerData(
				datas,
				headerInfo,
				translatedData,
			);

			if (response === 'success') res.send({ message: 'success' });
		} catch (error) {
			console.log(error);
		}
	},
);

router.get('/file', async (req, res) => {
	const fileName = req.headers.filename;
	const userId = req.headers.userid;
	const { datas } = await Connection.connect();
	const verified = await RegisterAndAuthentication.verifyCookie(
		req.cookies['jwt'],
	);
	if (!verified?.validatedUser) {
		res.status(401);
		return res.send({ message: 'Please login' });
	}
	const data = await datas.findOne(
		fileName ? { fileName } : userId ? { userId } : {},
	);
	if (!data) {
		res.send([]);
	} else res.send(data.data);
});

// checkForExistingUser = async (email) => {
// 	const user = await collections.users.findOne({ email });
// 	return user ? user : undefined;
// };

// verifyCookie = (res, cookie) => {
// 	if (!cookie) {
// 		return;
// 	}
// 	return jwt.verify(cookie, process.env.SECRET);
// };

module.exports = router;
