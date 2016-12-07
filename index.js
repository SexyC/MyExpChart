'use strict';

var fs = require('fs');
const spawn = require('child_process').spawn;

var program = require('commander');

const drawChartTmpFileName = 'drawChartTmp';

const templateFile = {
	'hist' : 'hist.m.tmpl',
};

function getTemplate(type) {

	if (!(type in templateFile)) {
		console.error("unsupported type: ", type);
		process.exit(1);
	}
	var tmpl = '`' + fs.readFileSync(templateFile[type]).toString() + '`';

	return tmpl;

}

function generateMatlabDrawCode(type, x, y, chartFileName) {
	return eval(getTemplate(type));
}

function generateXY() {
	return {
		x : '[1 2 3]',
		y : '[2 3 3]',
	};
}

function initCommander() {
	function parseFunc(val) { return val; }
	program.version('0.1.0')
	.option('-i, --input <file>', 'Input file', parseFunc)
	.option('-o, --output <file>', 'Output File, without postfix', parseFunc)
	.option('-t, --type <type>', 'chart type, current support ' + Object.keys(templateFile).toString(), parseFunc)
	.option('-m, --method <method>', 'data process method', parseFunc)
	.parse(process.argv);

	if (!(program.input && program.output
			&& program.type && program.method)) {

		program.help((txt) => {
			return txt;
		});
	}

	console.log(program.input, program.output, program.type, program.method);
}

function main() {

	initCommander();

	var data = require('./methods/' + program.method)(program.input);

	var str = generateMatlabDrawCode(program.type, data.x, data.y, program.output + '.png');
	console.log(str);
	fs.writeFileSync(`${drawChartTmpFileName}.m`, str);

	const matlab = spawn('matlab', ['-nodesktop', '-r', drawChartTmpFileName]);

	matlab.stdout.on('data', (data) => {
		console.log(data.toString());
	});

	matlab.stderr.on('data', (data) => {
		console.log(data.toString());
	});

	matlab.on('close', (code) => {
		console.log('matlab exit code: ', code);
		process.exit(code);
	});

	return 0;

}

main();

