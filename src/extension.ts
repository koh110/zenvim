import * as vscode from 'vscode'
import {
  state,
  setMode,
  setRegisterMode,
  setStatusBarItem,
  type
} from './state'
import { Mode, RegisterMode } from './types'
import { yank } from './lib/clipbord'
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

    if (state.mode === Mode.INSERT) {
      vscode.commands.executeCommand('default:type', {
        text: e.text
      })
      return
    }

    try {
      type(vscode.window.activeTextEditor, e.text)
    } catch (error) {
      console.error(error)
    }
  })

  register('cut', () => {
    setRegisterMode(RegisterMode.Char)
    vscode.commands.executeCommand('default:cut')
  })

  register('zenvim.escapeKey', () => setMode(Mode.NORMAL))

  register('zenvim.copy', () => yank())

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
