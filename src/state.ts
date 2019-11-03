import * as vscode from 'vscode'
import { Mode, RegisterMode } from './types'
import { hasCommand, run } from './mapping/index'

type State = {
  mode: Mode
  composedText: string
  statusBarItem: vscode.StatusBarItem | null
  anchorPosition: vscode.Position
  registerMode: RegisterMode
}

export const state: State = {
  mode: Mode.NORMAL,
  composedText: '',
  statusBarItem: null,
  anchorPosition: new vscode.Position(0, 0),
  registerMode: RegisterMode.Char
}

export function type(editor: vscode.TextEditor, text: string) {
  let composedText = state.composedText + text.trim()

  if (hasCommand(state.mode, composedText)) {
    const res = run(state.mode, editor, composedText)
    if (res.run) {
      composedText = ''
    }
  } else {
    composedText = ''
  }

  state.composedText = composedText
}

export function setRegisterMode(registerMode: RegisterMode) {
  state.registerMode = registerMode
}

function setCursorStyle(mode: Mode) {
  if (!vscode.window.activeTextEditor) {
    return
  }
  let cursorStyle = vscode.TextEditorCursorStyle.Block
  if (mode === Mode.INSERT) {
    cursorStyle = vscode.TextEditorCursorStyle.Line
  }
  vscode.window.activeTextEditor.options = {
    cursorStyle: cursorStyle
  }
}

export async function setMode(mode: Mode) {
  state.mode = mode

  await vscode.commands.executeCommand(
    'setContext',
    Mode.INSERT,
    mode === Mode.INSERT
  )

  setCursorStyle(mode)

  if (mode === Mode.INSERT) {
    setStatusBarItemText('-- INSERT --')
  } else if (mode === Mode.VISUAL) {
    setStatusBarItemText('-- VISUAL --')
  } else {
    setStatusBarItemText('-- NORMAL --')
    await vscode.commands.executeCommand('cancelSelection')
  }
}

function setStatusBarItemText(text: string) {
  if (state.statusBarItem) {
    state.statusBarItem.text = text
  }
}

export function setStatusBarItem(statusBar: vscode.StatusBarItem) {
  state.statusBarItem = statusBar
  statusBar.show()
}

export function setAnchorPosition(position: vscode.Position) {
  state.anchorPosition = new vscode.Position(position.line, position.character)
}
