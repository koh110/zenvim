import { commands, env, TextEditor, Position, Selection } from 'vscode'
import { setRegisterMode } from '../state'
import { RegisterMode } from '../types'
import { jumpCursor } from './cursor'
import { lineSelection, hasSelection, lineLength } from './editor'

export async function yankLine(editor: TextEditor) {
  const position = editor.selection.active

  lineSelection(editor)

  // copy
  const text = editor.document.getText(editor.selection)
  env.clipboard.writeText(text + '\n')

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

export async function yank(editor: TextEditor, options?: RegisterOptions) {
  const registerMode =
    options && options.registerMode ? options.registerMode : null

  // copy
  let text = editor.document.getText(editor.selection)
  if (registerMode === RegisterMode.Line) {
    text = text + '\n'
  }
  env.clipboard.writeText(text)

  if (registerMode) {
    setRegisterMode(registerMode)
  } else {
    setRegisterMode(RegisterMode.Char)
  }
}

export async function cut(editor: TextEditor, options?: RegisterOptions) {
  // for 'x'
  const position = editor.selection.active
  if (
    !hasSelection(editor) &&
    position.character < lineLength(editor, position.line)
  ) {
    const newSelection = new Selection(
      new Position(position.line, position.character),
      new Position(position.line, position.character + 1)
    )
    editor.selection = newSelection
  }

  const registerMode =
    options && options.registerMode ? options.registerMode : null

  await editor.edit(editBuilder => {
    // copy
    let text = editor.document.getText(editor.selection)
    if (registerMode === RegisterMode.Line) {
      text += '\n'
    }
    env.clipboard.writeText(text)

    // delete
    editBuilder.replace(editor.selection, '')
  })

  if (registerMode) {
    setRegisterMode(registerMode)
  } else {
    setRegisterMode(RegisterMode.Char)
  }
}

export async function paste(
  editor: TextEditor,
  options?: { beforeCursor: boolean }
) {
  const beforeCursor = options && options.beforeCursor ? true : false

  const text = await env.clipboard.readText()
  let line = editor.selection.active.line
  let character = beforeCursor
    ? editor.selection.active.character
    : editor.selection.active.character + 1
  const withNewLine = text[text.length - 1] === '\n'

  if (withNewLine) {
    line += 1
    character = 0
  }

  await editor.edit(editBuilder => {
    editBuilder.insert(new Position(line, character), text)
  })

  if (withNewLine) {
    jumpCursor(editor, line, character)
    return
  }

  jumpCursor(editor, line, character + text.length - 1)
}
