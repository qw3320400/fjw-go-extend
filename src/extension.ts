'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import cp = require('child_process');
import { resolve, format } from 'url';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "fjw-go-extend" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', () => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        vscode.window.showInformationMessage('Hello World!');
    });

    let myTestCMD = vscode.commands.registerCommand('extension.myTestCMD', () => {
        vscode.window.showInformationMessage("!!!TEST!!!");
    })

    let expandErrorReturn = vscode.commands.registerCommand('extension.expandErrorReturn', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("can't get active editor")
            return
        }

        if (editor.document.languageId != "go") {
            vscode.window.showErrorMessage("not go file")
            return
        }

        let reg = new RegExp(`\@ERR[\(][ ]*(.*)[ ]*[\)]`)
        let str = editor.document.getText()
        let matchArray = str.match(reg)
        let edits: vscode.TextEdit[] = [];

        for (; matchArray;) {
            let offset = str.indexOf(matchArray[0])
            let positionStart = editor.document.positionAt(offset)
            let positionEnd = editor.document.positionAt(offset+matchArray[0].length)

            let replaceStr = `if err != nil {\n\treturn `+matchArray[1]+`\n}`
            edits.push(
                vscode.TextEdit.replace(new vscode.Range(positionStart, positionEnd), replaceStr)
            )

            str = str.replace(matchArray[0], "-".repeat(matchArray[0].length))
            matchArray = str.match(reg)
        }
        
        let workspaceEdit = new vscode.WorkspaceEdit()
        workspaceEdit.set(editor.document.uri, edits)
        vscode.workspace.applyEdit(workspaceEdit)
    
        editor.document.save()
    })

    let foldErrorReturn = vscode.commands.registerCommand('extension.foldErrorReturn', () => {
        let editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showErrorMessage("can't get active editor")
            return
        }

        if (editor.document.languageId != "go") {
            vscode.window.showErrorMessage("not go file")
            return
        }

        let reg = new RegExp(`if[ ]+err[ ]*!=[ ]*nil[ ]*{[ \n\t]*return([ ]+(.*)|[ ]*)[ \n\t]*}`)
        let str = editor.document.getText()
        let matchArray = str.match(reg)
        let edits: vscode.TextEdit[] = [];

        for (; matchArray;) {
            let offset = str.indexOf(matchArray[0])
            let positionStart = editor.document.positionAt(offset)
            let positionEnd = editor.document.positionAt(offset+matchArray[0].length)

            let replaceStr = `@ERR(`+matchArray[1]+`)`
            edits.push(
                vscode.TextEdit.replace(new vscode.Range(positionStart, positionEnd), replaceStr)
            )

            str = str.replace(matchArray[0], "-".repeat(matchArray[0].length))
            matchArray = str.match(reg)
        }

        let workspaceEdit = new vscode.WorkspaceEdit()
        workspaceEdit.set(editor.document.uri, edits)
        vscode.workspace.applyEdit(workspaceEdit)
    })

    let disableGoreturns = vscode.commands.registerCommand('extension.disableGoreturns', () => {
        cp.execSync(`mv /Users/fangjianwei/Desktop/code/klook-libs/bin/goreturns /Users/fangjianwei/Desktop/code/klook-libs/bin/goreturns_bak`)
    })

    let enableGoreturns = vscode.commands.registerCommand('extension.enableGoreturns', () => {
        cp.execSync(`mv /Users/fangjianwei/Desktop/code/klook-libs/bin/goreturns_bak /Users/fangjianwei/Desktop/code/klook-libs/bin/goreturns`)
    })

    context.subscriptions.push(disposable);
    context.subscriptions.push(myTestCMD);
    context.subscriptions.push(expandErrorReturn);
    context.subscriptions.push(foldErrorReturn);
    context.subscriptions.push(disableGoreturns);
    context.subscriptions.push(enableGoreturns);
}

// this method is called when your extension is deactivated
export function deactivate() {
}
