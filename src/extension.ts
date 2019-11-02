import * as vscode from 'vscode'
import { state, setMode, setStatusBarItem, type } from './state'
import { Mode } from './types'

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

      type(vscode.window.activeTextEditor, e.text)
    })
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('zenvim.escapeKey', () => {
      setMode(Mode.NORMAL)
    })
  )
}

// this method is called when your extension is deactivated
export function deactivate() {}
