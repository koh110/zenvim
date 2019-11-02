import {
  TextEditor,
  Selection,
  Position,
  Range,
  TextEditorRevealType
} from 'vscode'

export function jumpCursor(
  editor: TextEditor,
  line: number,
  charactor: number
) {
  editor.selection = new Selection(
    new Position(line, charactor),
    new Position(line, charactor)
  )
  editor.revealRange(
    new Range(line, charactor, line, charactor),
    TextEditorRevealType.Default
  )
}

export function jumpToCurrentEndOfLine(editor: TextEditor) {
  const line = editor.selection.active.line
  jumpCursor(editor, line, editor.document.lineAt(line).text.length)
}
