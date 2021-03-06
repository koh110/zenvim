import * as vscode from 'vscode'
import {
  state,
  setMode,
  setRegisterMode,
  setStatusBarItem,
  type,
  replacePrevChar,
  compositionStart,
  compositionEnd
} from './state'
import { cursorDown, cursorUp, cursorLeft, cursorRight } from './reigster'
import { Mode, RegisterMode } from './types'
import { moveCursor } from './lib/cursor'
import { parseKey } from './mapping/common'

export function activate(context: vscode.ExtensionContext) {
  const actual = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  )
  setStatusBarItem(actual)

  vscode.window.onDidChangeActiveTextEditor(textEditor => {
    if (!textEditor) {
      return
    }
    setMode(Mode.NORMAL)
  })

  function register(key: string, handler: (...args: any[]) => void) {
    context.subscriptions.push(vscode.commands.registerCommand(key, handler))
  }

  register('type', e => {
    if (!vscode.window.activeTextEditor) {
      return
    }

    try {
      type(vscode.window.activeTextEditor, e.text)
    } catch (error) {
      console.error(error)
    }
  })

  register('replacePreviousChar', args => {
    if (!vscode.window.activeTextEditor) {
      return
    }
    replacePrevChar(args.text, args.replaceCharCnt)
  })

  register('compositionStart', () => {
    if (!vscode.window.activeTextEditor) {
      return
    }
    compositionStart()
  })

  register('compositionEnd', () => {
    if (!vscode.window.activeTextEditor) {
      return
    }
    compositionEnd(vscode.window.activeTextEditor)
  })

  register('cursorDown', cursorDown)
  register('cursorUp', cursorUp)
  register('cursorRight', cursorRight)
  register('cursorLeft', cursorLeft)

  register('cut', () => {
    setRegisterMode(RegisterMode.Char)
    vscode.commands.executeCommand('default:cut')
  })

  register('zenvim.escapeKey', () => {
    setMode(Mode.NORMAL)
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    if (editor.selection.active.character !== 0) {
      moveCursor({ to: 'left' })
    }
  })

  register('zenvim.backspace', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    if (state.mode === Mode.NORMAL) {
      moveCursor({ to: 'left' })
      return
    }
    vscode.commands.executeCommand('deleteLeft')
  })

  register('zenvim.enter', () => {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }
    moveCursor({ to: 'down' })
  })

  function registerCtrlKey(commandName: string, key: string) {
    register(commandName, () => {
      try {
        const editor = vscode.window.activeTextEditor
        if (!editor) {
          return
        }
        type(editor, parseKey(key, { ctrl: true }))
      } catch (e) {
        console.error(e)
      }
    })
  }
  registerCtrlKey('zenvim.ctrl+e', 'e')
  registerCtrlKey('zenvim.ctrl+y', 'y')
  registerCtrlKey('zenvim.ctrl+f', 'f')
  registerCtrlKey('zenvim.ctrl+b', 'b')
  registerCtrlKey('zenvim.ctrl+r', 'r')
}

// this method is called when your extension is deactivated
export function deactivate() {}
