import { TextEditor } from 'vscode'

export function hasSelection(editor: TextEditor) {
  const { start, end } = editor.selection

  return start.line !== end.line || start.character !== end.character
}
