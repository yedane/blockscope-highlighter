"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
class CommentParser {
    constructor(activeEditor, commentSyntax) {
        this.activeEditor = activeEditor;
        this.commentSyntax = commentSyntax;
        this.commentRanges = new Array();
    }
    update() {
        if (this.activeEditor) {
            let ranges = new Array();
            ranges = this.findSinglelineComment(ranges);
            ranges = this.findMultilineComment(ranges);
            this.commentRanges = ranges;
        }
    }
    getNextStartOffset(offset) {
        let pos = this.activeEditor.document.positionAt(offset);
        for (var i = 0; i < this.commentRanges.length; i++) {
            if (this.commentRanges[i].contains(pos)) {
                return (this.activeEditor.document.offsetAt(this.commentRanges[i].start) - 1);
            }
        }
        return offset;
    }
    getNextEndOffset(offset) {
        let pos = this.activeEditor.document.positionAt(offset);
        for (var i = 0; i < this.commentRanges.length; i++) {
            if (this.commentRanges[i].contains(pos)) {
                return (this.activeEditor.document.offsetAt(this.commentRanges[i].end) + 1);
            }
        }
        return offset;
    }
    findSinglelineComment(ranges) {
        var _a;
        if (!this.commentSyntax) {
            return new Array();
        }
        let text = this.activeEditor.document.getText();
        let pattern = "(";
        pattern += this.escapeRegExp((_a = this.commentSyntax) === null || _a === void 0 ? void 0 : _a.singleline);
        pattern += ")+( |\t)*?(.*)";
        let flags = "gm";
        let regExp = new RegExp(pattern, flags);
        return this.find(regExp, text, ranges);
    }
    findMultilineComment(ranges) {
        var _a, _b;
        if (!this.commentSyntax && !this.isMultilineCommentDefine()) {
            return new Array();
        }
        let text = this.activeEditor.document.getText();
        let pattern = "(";
        pattern += this.escapeRegExp((_a = this.commentSyntax) === null || _a === void 0 ? void 0 : _a.multilineStart);
        pattern += "[\\s]*?)+([\\s\\S]*?)(";
        pattern += this.escapeRegExp((_b = this.commentSyntax) === null || _b === void 0 ? void 0 : _b.multilineEnd);
        pattern += ")";
        let flags = "gm";
        let regExp = new RegExp(pattern, flags);
        return this.find(regExp, text, ranges);
    }
    find(regExp, text, ranges) {
        var match;
        while ((match = regExp.exec(text))) {
            let startPos = this.activeEditor.document.positionAt(match.index);
            let endPos = this.activeEditor.document.positionAt(match.index + match[0].length);
            let range = new vscode.Range(startPos, endPos);
            ranges.push(range);
        }
        return ranges;
    }
    escapeRegExp(input) {
        if (input) {
            return input.replace(/[.*+?^${}()|[\]\\\/"]/g, "\\$&");
        }
    }
    isMultilineCommentDefine() {
        if (this.commentSyntax) {
            return (this.commentSyntax.multilineStart != null &&
                this.commentSyntax.multilineEnd != null);
        }
    }
}
exports.CommentParser = CommentParser;
//# sourceMappingURL=commentParser.js.map