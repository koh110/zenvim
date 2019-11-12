import { TextEditor, Selection, Position } from 'vscode'

export function hasSelection(editor: TextEditor) {
  const { start, end } = editor.selection

  return start.line !== end.line || start.character !== end.character
}

export function lineSelection(editor: TextEditor) {
  const position = editor.selection.active
  const newSelection = new Selection(
    new Position(position.line, 0),
    new Position(
      position.line,
      editor.document.lineAt(position.line).text.length
    )
  )
  editor.selection = newSelection
}

export function lineLength(editor: TextEditor, line: number): number {
  return editor.document.lineAt(line).text.length
}
