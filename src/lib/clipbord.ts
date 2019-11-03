import { commands, env, TextEditor, Position, Selection } from 'vscode'
import { state, setRegisterMode } from '../state'
import { RegisterMode } from '../types'
import { jumpCursor } from './cursor'

export async function yankLine(editor: TextEditor) {
  // line selection
  const position = editor.selection.active
  const newSelection = new Selection(
    new Position(position.line, 0),
    new Position(
      position.line,
      editor.document.lineAt(position.line).text.length
    )
  )
  editor.selection = newSelection

  // copy
  const text = editor.document.getText(editor.selection)
  env.clipboard.writeText(text)

  // return selection
  editor.selection = new Selection(position, position)

  setRegisterMode(RegisterMode.Line)
}

export async function yankLineAndDelete(editor: TextEditor) {
  await yankLine(editor)
  await commands.executeCommand('editor.action.deleteLines')
}

type RegisterOptions = {
  registerMode: RegisterMode
}

export async function yank(options?: RegisterOptions) {
  await commands.executeCommand('editor.action.clipboardCopyAction')

  if (options && options.registerMode) {
    setRegisterMode(options.registerMode)
  } else {
    setRegisterMode(RegisterMode.Char)
  }
}

export async function cut(editor: TextEditor, options?: RegisterOptions) {
  await editor.edit(editBuilder => {
    // copy
    const text = editor.document.getText(editor.selection)
    env.clipboard.writeText(text)

    // delete
    editBuilder.replace(editor.selection, '')
  })

  if (options && options.registerMode) {
    setRegisterMode(options.registerMode)
  } else {
    setRegisterMode(RegisterMode.Char)
  }
}

export async function paste(editor: TextEditor) {
  let text = await env.clipboard.readText()
  let line = editor.selection.active.line
  let character = editor.selection.active.character

  if (state.registerMode === RegisterMode.Line) {
    text = text + '\n'
    line += 1
    character = 0
  }

  await editor.edit(editBuilder => {
    editBuilder.insert(new Position(line, character), text)
  })

  if (state.registerMode === RegisterMode.Line) {
    jumpCursor(editor, line, character)
  }
}
