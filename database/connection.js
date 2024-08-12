const mongoose = require('mongoose');

class Connection {
	async connect() {
		const connections = await mongoose
			.createConnection(`${process.env.dbUserString}`, { dbName: 'DealerData' })
			.asPromise();
		connections.model('User', require('../models/users'));
		connections.model('Data', require('../models/dealerData'));
		console.log('Connected to data bases........');

		return {
			users: connections.collections.users,
			datas: connections.collections.datas,
		};
	}
}
module.exports = new Connection();
