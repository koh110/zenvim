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

  context.subscriptions.push(
    vscode.commands.registerCommand('type', e => {
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
      } catch (e) {
        console.error(e)
      }
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('zenvim.escapeKey', () => {
      setMode(Mode.NORMAL)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('cut', () => {
      setRegisterMode(RegisterMode.Char)
      vscode.commands.executeCommand('default:cut')
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('zenvim.copy', () => {
      yank()
    })
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
