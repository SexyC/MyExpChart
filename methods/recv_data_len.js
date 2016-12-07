'use strict';
var fs = require('fs');
var lineByLine = require('n-readlines');
module.exports = function (fileName) {

	var line
	var liner = new lineByLine(fileName);
	var data = [];

	while(line = liner.next()) {
		var items = line.toString().trim().split(',');

		if (items.length > 0 && items[0].toLowerCase() !== 'file') {
			data.push(items[items.length - 1]);
		}
	}

	var yStr = '[';
	data.forEach((val) => {
		yStr += val + ' ';
	});
	yStr += ']';

	return {
		x : '20',
		y : yStr
	};
};



