'use strict';

class WarrantyTranslator {
	async translateData(CdkData, headerInfo) {
		const { dealer, userId, fileName } = headerInfo;
		const myData = await CdkData.map((data) => {
			let roOpenDate;
			let roClosedDate;
			let roNumber;
			let advisor;
			let laborOperations;
			let description;
			let type;
			let technician;
			let laborHours;
			let laborAmount;
			let partsTotal;
			if (data['OPEN DATE']) roOpenDate = data['OPEN DATE'];
			if (data['CLOSE DATE']) roClosedDate = data['CLOSE DATE'];
			if (data['RO$']) roNumber = data['RO$'];
			if (data['SVC ADVISOR']) advisor = data['SVC ADVISOR'];
			if (data['OP CODE']) laborOperations = data['OP CODE'];
			if (data['OP DESC']) description = data['OP DESC'];
			if (data['CWI']) type = data['CWI'];
			if (data['TECH#']) technician = data['TECH#'];
			if (data['TECH TIME']) laborHours = data['TECH TIME'];
			if (data['LBR SLS']) laborAmount = data['LBR SLS'];
			if (data['PTS SLS']) partsTotal = data['PTS SLS'];
			return {
				roOpenDate: this.handleOpenDate(roOpenDate),
				roCloseDate: this.handleClosedDate(roClosedDate),
				roNumber: this.handleRoNumber(roNumber),
				advisor: this.handleAdvisor(advisor),
				laborOperations: this.handleLaborOperations(laborOperations),
				description,
				type: this.handleType(type),
				technician: this.handleTechnician(technician),
				laborHours: this.handleLaborHours(laborHours),
				laborAmount: this.handleLaborAmount(laborAmount),
				partsTotal: this.handlePartsTotal(partsTotal),
			};
		});
		//console.log(myData);

		return myData;
	}
	handleOpenDate(roOpenDate) {
		if (!roOpenDate) return;
		const dateTime = roClosedDate.split('/');
		return new Date(`20${dateTime[2]}-${dateTime[0]}-${dateTime[1]}`);
	}
	handleClosedDate(roClosedDate) {
		if (!roClosedDate) return;
		const dateTime = roClosedDate.split('/');
		return new Date(`20${dateTime[2]}-${dateTime[0]}-${dateTime[1]}`);
	}
	handleRoNumber(roNumber) {
		if (typeof roNumber === 'string') return roNumber;
		else return `${roNumber}`;
	}
	handleAdvisor(advisor) {
		if (!advisor) return;
		if (typeof advisor === 'string') return advisor;
		else return `${advisor}`;
	}
	handleLaborOperations(laborOperations) {
		if (!laborOperations) return;
		if (typeof laborOperations === 'string') return laborOperations;
		else return `${laborOperations}`;
	}
	handleType(type) {
		if (!type) return;
		if (type === 'C') return 'cp';
		if (type === 'W') return 'warr';
		if (type === 'I') return 'int';
	}
	handleTechnician(technician) {
		if (!technician) return;
		if (typeof technician === 'string') return technician;
		else return `${technician}`;
	}
	handleLaborHours(laborHours) {
		if (!laborHours) return;
		if (typeof laborHours === 'string')
			return parseFloat(laborHours).toFixed(2);
		if (typeof laborHours === 'number') return laborHours.toFixed(2);
	}
	handleLaborAmount(laborAmount) {
		if (!laborAmount) return;
		if (typeof laborAmount === 'string' && laborAmount.startsWith('$')) {
			return parseFloat(laborAmount.split('$')[1]).toFixed(2);
		} else if (
			typeof laborAmount === 'string' &&
			!laborAmount.startsWith('$')
		) {
			return parseFloat(laborAmount).toFixed(2);
		}
	}
	handlePartsTotal(partsTotal) {
		if (!partsTotal) return;
		if (typeof partsTotal === 'string' && partsTotal.startsWith('.$')) {
			return parseFloat(partsTotal.split('.$')[1]).toFixed(2);
		} else if (typeof partsTotal === 'string' && partsTotal.startsWith('$')) {
			return parseFloat(partsTotal.split('$')[1]).toFixed(2);
		} else if (typeof partsTotal === 'string' && !partsTotal.startsWith('$')) {
			return parseFloat(partsTotal).toFixed(2);
		} else return;
	}
}
module.exports = new WarrantyTranslator();
