import * as vscode from 'vscode'
import { Mode } from './types'
import { hasCommand, run } from './mapping'

type State = {
  mode: Mode
  composedText: string
  statusBarItem: vscode.StatusBarItem | null
}

export const state: State = {
  mode: Mode.NORMAL,
  composedText: '',
  statusBarItem: null
}

export function type(editor: vscode.TextEditor, text: string) {
  let composedText = state.composedText + text.trim()

  if (hasCommand(composedText)) {
    const res = run(editor, composedText)
    if (res.run) {
      composedText = ''
    }
  } else {
    composedText = ''
  }

  state.composedText = composedText
}

function setCursorStyle(mode: Mode) {
  if (!vscode.window.activeTextEditor) {
    return
  }
  let cursorStyle = vscode.TextEditorCursorStyle.Line
  if (mode === Mode.NORMAL) {
    cursorStyle = vscode.TextEditorCursorStyle.Block
  }
  vscode.window.activeTextEditor.options = {
    cursorStyle: cursorStyle
  }
}

export function setMode(mode: Mode) {
  state.mode = mode

  vscode.commands.executeCommand(
    'setContext',
    Mode.INSERT,
    mode === Mode.INSERT
  )

  setCursorStyle(mode)

  if (mode === Mode.INSERT) {
    setStatusBarItemText('-- INSERT --')
  } else {
    setStatusBarItemText('-- NORMAL --')
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
