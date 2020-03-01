import * as vscode from 'vscode'
import { Mode, RegisterMode } from './types'
import { hasCommand, run } from './mapping/index'

type State = {
  mode: Mode
  composedText: string
  statusBarItem: vscode.StatusBarItem | null
  anchorPosition: vscode.Position
  registerMode: RegisterMode
  isInComposition: boolean
}

export const state: State = {
  mode: Mode.NORMAL,
  composedText: '',
  statusBarItem: null,
  anchorPosition: new vscode.Position(0, 0),
  registerMode: RegisterMode.Char,
  isInComposition: false
}

export function type(editor: vscode.TextEditor, text: string) {
  let composedText = state.composedText + text.trim()

  if (!state.isInComposition && hasCommand(state.mode, composedText)) {
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
  } else if (mode === Mode.VISUAL) {
    cursorStyle = vscode.TextEditorCursorStyle.LineThin
  }
  vscode.window.activeTextEditor.options = {
    cursorStyle: cursorStyle
  }
}

export async function setMode(mode: Mode) {
  state.mode = mode

  vscode.commands.executeCommand(
    'setContext',
    Mode.INSERT,
    mode === Mode.INSERT
  )
  vscode.commands.executeCommand(
    'setContext',
    Mode.NORMAL,
    mode === Mode.NORMAL
  )

  setCursorStyle(mode)

  if (mode === Mode.INSERT) {
    setStatusBarItemText('-- INSERT --')
  } else if (mode === Mode.VISUAL) {
    setStatusBarItemText('-- VISUAL --')
  } else if (mode === Mode.VISUAL_LINE) {
    setStatusBarItemText('-- VISUAL LINE --')
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

export function replacePrevChar(text: string, replaceCharCnt: number) {
  if (state.mode !== Mode.NORMAL) {
    return false
  }
  vscode.commands.executeCommand('default:replacePreviousChar', {
    text: text,
    replaceCharCnt: replaceCharCnt
  })
}

export function compositionStart() {
  state.isInComposition = true
}

export function compositionEnd(editor: vscode.TextEditor) {
  state.isInComposition = false

  type(editor, state.composedText)
}
