'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

class RegisterAndAuthentication {
	async registerNewUser(req, users) {
		try {
			const userExists = await this.checkForExistingUser(req.body.email, users);
			if (userExists) {
				throw {
					code: 1,
					httpStatus: 404,
					message: 'User email already exists, please log in.',
				};
			}
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(req.body.password, salt);
			const user = {
				firstName: req.body.firstName,
				lastName: req.body.lastName,
				dealershipName: req.body.dealershipName,
				position: req.body.position,
				phoneNumber: req.body.phoneNumber,
				email: req.body.email,
				password: hashedPassword,
			};
			return user;
		} catch (error) {
			throw error;
		}
	}

	async login(req, users) {
		try {
			const existingUser = await this.checkForExistingUser(
				req.body.email,
				users,
			);
			if (!existingUser) {
				throw {
					code: 2,
					httpStatus: 404,
					message:
						'Unable to find you based on that email. Please check email entered.',
				};
			}
			const valiatedUser = await bcrypt.compare(
				req.body.password,
				existingUser.password,
			);
			if (!valiatedUser) {
				throw {
					code: 3,
					httpStatus: 403,
					message:
						'The email and password combination entered does not match. Please correct these inputs to login.',
				};
			}
			return valiatedUser;
		} catch (error) {
			throw error;
		}
	}

	async verifyCookie(cookie) {
		if (!cookie) {
			return;
		}
		const claims = jwt.verify(cookie, process.env.SECRET);
		if (!claims) {
			throw {
				code: 4,
				httpStatus: 401,
				message: 'Unauthenticated, please log in.',
			};
		}
		return claims;
	}

	async checkForExistingUser(email, users) {
		const user = await users.findOne({ email });
		return user ? user : undefined;
	}
}
module.exports = new RegisterAndAuthentication();
