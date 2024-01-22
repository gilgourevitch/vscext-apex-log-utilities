// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const childProcess = require('child_process');
var debugLevel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	const console = vscode.window.createOutputChannel("apex_log_utilities_console");
	console.appendLine('Congratulations, your extension "apex-log-utilities" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let openLogStreamCmd = vscode.commands.registerCommand('apex-log-utilities.openLogStream', function () {

		if(!debugLevel){
			debugLevel = init(console);
		}

		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Logs Streaming');
		terminal.show();
		terminal.sendText(`sf apex tail log --color --debug-level=${debugLevel.DeveloperName}`);
	});

	let openDebugStreamCmd = vscode.commands.registerCommand('apex-log-utilities.openDebugStream', function () {

		if(!debugLevel){
			debugLevel = init(console);
		}

		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Debug Streaming');
		terminal.show();
		terminal.sendText(`sf apex tail log --color --debug-level=${debugLevel.DeveloperName} | grep USER_DEBUG`);
	});

	let openLogStreamInTabCmd = vscode.commands.registerCommand('apex-log-utilities.openLogStreamInTab', function () {

		if(!debugLevel){
			debugLevel = init(console);
		}

		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Logs Streaming');
		// terminal.show();
		terminal.show();
		terminal.sendText("sf apex tail log --color --debug-level=${debugLevel.DeveloperName} | code -");

	});

	let openDebugStreamInTabCmd = vscode.commands.registerCommand('apex-log-utilities.openDebugStreamInTab', function () {

		if(!debugLevel){
			debugLevel = init(console);
		}

		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Logs Streaming');
		// terminal.show();
		terminal.show();
		terminal.sendText(`sf apex tail log --color --debug-level=${debugLevel.DeveloperName} | grep USER_DEBUG | code -`);
		
	});

	context.subscriptions.push(openLogStreamCmd);
	context.subscriptions.push(openDebugStreamCmd);
	context.subscriptions.push(openLogStreamInTabCmd);
	context.subscriptions.push(openDebugStreamInTabCmd);
}

function init(console){
	console.appendLine('initializing DebugLevels');

	let apexDebugLevel = 'DEBUG';
	let namePrefix = 'ApexDebugLogUtilities';

	let debugLevel = getDebugLevel(childProcess, namePrefix);
	console.appendLine('get debug level : '+JSON.stringify(debugLevel));

	if(debugLevel){
		console.appendLine('debug level exists !');
		updateDebugLevel(childProcess, debugLevel, apexDebugLevel);
	}else{
		console.appendLine('no debug level !');
		debugLevel = createDebugLevel(childProcess, apexDebugLevel, namePrefix, console);	
		console.appendLine('created debug level : '+JSON.stringify(debugLevel));
	}

	return debugLevel;
}

function getDebugLevel(childProcess, namePrefix){
	let cmd = `sf data query --query "SELECT Id, DeveloperName FROM DebugLevel WHERE DeveloperName like '${namePrefix}%' ORDER BY CreatedDate DESC LIMIT 1" --use-tooling-api --json`;
	let debugLevelResult = JSON.parse(childProcess.execSync(cmd));

	if((debugLevelResult.status == 0)){
		return debugLevelResult.result.records[0];
	}

	throw new Error('Error during DebugLevel retrieval. Command : '+cmd + 'Response : '+JSON.stringify(debugLevelResult));
}

function createDebugLevel(childProcess, apexDebugLevel, namePrefix){
	let now = Date.now();
	let cmd = `sf data create record --sobject DebugLevel --values "DeveloperName=${namePrefix}${now} MasterLabel=${namePrefix}${now} ApexCode=${apexDebugLevel}" --use-tooling-api --json`;
	let debugLevelResult = JSON.parse(childProcess.execSync(cmd));
	
	if((debugLevelResult.status == 0) && debugLevelResult.result.success){
		return {
			Id: debugLevelResult.result.id,
			DeveloperName: namePrefix + now
		};
	}
	throw new Error('Error during DebugLevel creation. Command : '+cmd + 'Response : '+JSON.stringify(debugLevelResult));
}

function updateDebugLevel(childProcess, debugLevel, apexDebugLevel){
	let cmd = `sf data update record --sobject DebugLevel --record-id ${debugLevel.Id} --values "ApexCode=${apexDebugLevel}" --use-tooling-api --json`;
	let debugLevelResult = JSON.parse(childProcess.execSync(cmd));
	if((debugLevelResult.status == 0) && debugLevelResult.result.success){
		return {
			Id: debugLevelResult.result.id
		};
	}
	throw new Error('Error during DebugLevel update. Command : '+cmd + 'Response : '+JSON.stringify(debugLevelResult));
}

function getTerminal(terminalName){
	let terminal;
	vscode.window.terminals.forEach(term => {
		if(term.name == terminalName){
			terminal = term;
		}
	});

	if(!terminal){
		terminal = vscode.window.createTerminal(terminalName);
	}
	return terminal;

}

// This method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
