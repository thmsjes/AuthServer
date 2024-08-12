'use strict';

const csvtojson = require('csvtojson');
const mongoose = require('mongoose');

const DataTranslatorSelector = require('./dataTranslation/translatorSelector');
const dealerDataSchema = require('../models/dealerData');
const Connection = require('../database/connection');

class HandleUploadData {
	async handleData(file, headers) {
		const { filename, dealer, userid } = headers;
		const csvFile = Object.keys(file)[0];
		const buffer = file[csvFile].data;
		const data = [];
		const date = new Date().toLocaleDateString();

		const headerInfo = {
			fileName: `${filename} ${date}`,
			dealer,
			userId: userid,
		};
		await csvtojson()
			.fromString(buffer.toString())
			.then((jsonObjects) => {
				jsonObjects.map((object) => {
					//object.fileName = headerInfo.fileName;
					data.push(object);
				});
			});

		const translatedData = await DataTranslatorSelector.CDKdata(
			data,
			headerInfo,
		);
		return { headerInfo, translatedData };
	}
	async saveDealerData(datas, headerInfo = {}, translatedData) {
		console.log(datas);

		try {
			const { dealer, userId, fileName } = headerInfo;
			const data = Array.isArray(translatedData)
				? translatedData
				: [translatedData];
			const Data = mongoose.model('Data', dealerDataSchema);
			const newData = new Data({
				dealer,
				userId,
				fileName,
				data,
			});
			await datas.insertOne(newData);
			return 'success';
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = new HandleUploadData();
