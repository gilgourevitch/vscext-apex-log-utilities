// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "apex-log-utilities" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let openLogStreamCmd = vscode.commands.registerCommand('apex-log-utilities.openLogStream', function () {
		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Logs Streaming');
		terminal.show();
		terminal.sendText("sf apex tail log --color");
	});

	let openDebugStreamCmd = vscode.commands.registerCommand('apex-log-utilities.openDebugStream', function () {
		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Debug Streaming');
		terminal.show();
		terminal.sendText("sf apex tail log --color | grep USER_DEBUG");
	});

	let openLogStreamInTabCmd = vscode.commands.registerCommand('apex-log-utilities.openLogStreamInTab', function () {
		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Logs Streaming');
		// terminal.show();
		terminal.show();
		terminal.sendText("sf apex tail log --color | code -");

	});

	let openDebugStreamInTabCmd = vscode.commands.registerCommand('apex-log-utilities.openDebugStreamInTab', function () {
		// The code you place here will be executed every time your command is executed
		let terminal = getTerminal('Apex Logs Streaming');
		// terminal.show();
		terminal.show();
		terminal.sendText("sf apex tail log --color | grep USER_DEBUG | code -");
		
	});

	context.subscriptions.push(openLogStreamCmd);
	context.subscriptions.push(openDebugStreamCmd);
	context.subscriptions.push(openLogStreamCmdInTab);
	context.subscriptions.push(openDebugStreamCmdInTab);
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
