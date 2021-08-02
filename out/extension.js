"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const commentParser_1 = require("./commentParser");
const bracketParser_1 = require("./bracketParser");
function activate(context) {
    let commentParser;
    let bracketParser;
    let update = function () {
        let activeEditor = vscode.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        let contributions = vscode.workspace.getConfiguration("blockscope-highlighter");
        let bracket = contributions.bracket;
        let rgba = contributions.rgba;
        let syntax = contributions.syntax;
        let languageId = activeEditor.document.languageId;
        let commentSyntax = syntax.find((s) => {
            return s.languageId.find((s) => s === languageId);
        });
        commentParser = new commentParser_1.CommentParser(activeEditor, commentSyntax);
        bracketParser = new bracketParser_1.BracketParser(activeEditor, commentParser, bracket, rgba);
        commentParser.update();
    };
    update();
    vscode.window.onDidChangeTextEditorSelection((event) => {
        triggerUpdate2();
    }, null, context.subscriptions);
    vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor) {
            triggerUpdate();
        }
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeTextDocument((event) => {
        update();
    }, null, context.subscriptions);
    vscode.workspace.onDidChangeConfiguration((event) => {
        update();
    }, null, context.subscriptions);
    var timeout;
    function triggerUpdate() {
        if (timeout) {
            clearTimeout(timeout);
        }
        timeout = setTimeout(update, 1000);
    }
    var timeout2;
    function triggerUpdate2() {
        if (timeout2) {
            clearTimeout(timeout2);
        }
        timeout = setTimeout(() => bracketParser.update(), 50);
    }
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map