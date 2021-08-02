"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
let textEditorDecoration;
class BracketParser {
    constructor(activeEditor, commentParser, bracket, rgba) {
        this.activeEditor = activeEditor;
        this.commentParser = commentParser;
        this.bracket = bracket;
        this.rgba = rgba;
    }
    update() {
        var _a;
        let pos = this.activeEditor.selection.active;
        var offsetPos = this.activeEditor.document.offsetAt(pos);
        var range;
        let returnType = this.lookBackwardForBracket(offsetPos - 1);
        if (returnType.scope > 0) {
            range = this.getRange(returnType.pos, this.lookForwardForEndBracket(returnType.pos + 1).pos);
        }
        else {
            let returnType2 = this.lookForwardForBracket(returnType.pos + 1);
            if (returnType2.scope > 0) {
                range = this.getRange(this.lookBackwardForStartBracket(returnType2.pos - 1).pos, (_a = this.lookForwardForEndBracket(returnType.pos + 1)) === null || _a === void 0 ? void 0 : _a.pos);
            }
            else {
                range = this.getRange(this.lookBackwardForStartBracket(returnType2.pos - 1).pos, returnType2.pos);
            }
        }
        if (range) {
            this.render(range);
        }
    }
    lookBackwardForBracket(pos) {
        let text = this.activeEditor.document.getText();
        while (pos < text.length && pos >= 0) {
            pos = this.commentParser.getNextStartOffset(pos);
            if (text[pos] === this.bracket.start) {
                return { pos, scope: 1 };
            }
            if (text[pos] === this.bracket.end) {
                return { pos, scope: -1 };
            }
            pos--;
        }
        this.finally();
    }
    lookForwardForBracket(pos) {
        let text = this.activeEditor.document.getText();
        while (pos < text.length && pos >= 0) {
            pos = this.commentParser.getNextEndOffset(pos);
            if (text[pos] === this.bracket.start) {
                return { pos, scope: 1 };
            }
            if (text[pos] === this.bracket.end) {
                return { pos, scope: -1 };
            }
            pos++;
        }
        this.finally();
    }
    lookForwardForEndBracket(pos) {
        let text = this.activeEditor.document.getText();
        var scope = 0;
        while (pos < text.length && pos >= 0) {
            pos = this.commentParser.getNextEndOffset(pos);
            if (text[pos] === this.bracket.start) {
                scope++;
            }
            if (text[pos] === this.bracket.end) {
                if (scope-- === 0) {
                    return { pos, scope: 0 };
                }
            }
            pos++;
        }
        this.finally();
    }
    lookBackwardForStartBracket(pos) {
        let text = this.activeEditor.document.getText();
        var scope = 0;
        while (pos < text.length && pos >= 0) {
            pos = this.commentParser.getNextStartOffset(pos);
            if (text[pos] === this.bracket.start) {
                if (scope++ === 0) {
                    return { pos, scope: 0 };
                }
            }
            if (text[pos] === this.bracket.end) {
                scope--;
            }
            pos--;
        }
        this.finally();
    }
    render(range) {
        if (textEditorDecoration) {
            textEditorDecoration.dispose();
        }
        textEditorDecoration = vscode.window.createTextEditorDecorationType({
            backgroundColor: this.getRGBA(this.rgba.red, this.rgba.green, this.rgba.blue, this.rgba.alpha),
            isWholeLine: true,
        });
        this.activeEditor.setDecorations(textEditorDecoration, [range]);
    }
    finally() {
        if (textEditorDecoration) {
            textEditorDecoration.dispose();
        }
        throw console.error();
    }
    getRange(start, end) {
        let pos1 = this.activeEditor.document.positionAt(start);
        let pos2 = this.activeEditor.document.positionAt(end);
        return new vscode.Range(pos1, pos2);
    }
    getRGBA(red, green, blue, alpha) {
        return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
    }
}
exports.BracketParser = BracketParser;
//# sourceMappingURL=bracketParser.js.map