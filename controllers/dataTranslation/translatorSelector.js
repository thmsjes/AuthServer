'use strict';
const WarrantyTranslator = require('./cdkTranslator');

class DataTranslatorSelector {
	async CDKdata(data, headerInfo) {
		return await WarrantyTranslator.translateData(data, headerInfo);
	}
}
module.exports = new DataTranslatorSelector();
