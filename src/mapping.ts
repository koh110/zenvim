import * as vscode from 'vscode'
import { Mode } from './types'
import { setMode } from './state'
import { jumpCursor, jumpToCurrentEndOfLine } from './commands'
import { findNextWord, findPrevWord } from './word'

type RunFunction = (editor: vscode.TextEditor) => void
type Mapping = {
  [key: string]: RunFunction
}
const keyMapping: Mapping = {}
let commands = ''

export function hasCommand(text: string) {
  return new RegExp(`${text}*`).test(commands)
}

export function run(editor: vscode.TextEditor, text: string): { run: boolean } {
  const run = keyMapping[text]
  if (run) {
    run(editor)
    return { run: true }
  }
  return { run: false }
}

function bind(key: string, run: RunFunction) {
  keyMapping[key] = run
  commands = Object.keys(keyMapping).join('__')
}

bind('i', () => setMode(Mode.INSERT))
bind('A', editor => {
  jumpToCurrentEndOfLine(editor)
  setMode(Mode.INSERT)
})
bind('o', () => {
  vscode.commands.executeCommand('editor.action.insertLineAfter')
  setMode(Mode.INSERT)
})
bind('O', () => {
  vscode.commands.executeCommand('editor.action.insertLineBefore')
  setMode(Mode.INSERT)
})
bind('h', () => {
  vscode.commands.executeCommand('cursorMove', {
    to: 'left'
  })
})
bind('l', () => {
  vscode.commands.executeCommand('cursorMove', {
    to: 'right'
  })
})
bind('j', () => {
  vscode.commands.executeCommand('cursorMove', {
    to: 'down'
  })
})
bind('k', () => {
  vscode.commands.executeCommand('cursorMove', {
    to: 'up'
  })
})
bind('gg', editor => {
  jumpCursor(editor, 0, 0)
})
bind('G', editor => {
  const lastLine = editor.document.lineCount - 1
  jumpCursor(editor, lastLine, 0)
})
bind('0', editor => {
  jumpCursor(editor, editor.selection.active.line, 0)
})
bind('$', editor => {
  jumpToCurrentEndOfLine(editor)
})
bind('w', editor => {
  const nextWord = findNextWord(editor.document, editor.selection.active)
  if (nextWord) {
    jumpCursor(editor, editor.selection.active.line, nextWord.start)
  } else {
    jumpToCurrentEndOfLine(editor)
  }
})
bind('b', editor => {
  const prevWord = findPrevWord(editor.document, editor.selection.active)
  if (prevWord) {
    jumpCursor(editor, editor.selection.active.line, prevWord.start)
  }
})
bind('yy', editor => {
  // line selection
  const position = editor.selection.active
  const newSelection = new vscode.Selection(
    new vscode.Position(position.line, 0),
    new vscode.Position(
      position.line,
      editor.document.lineAt(position.line).text.length
    )
  )
  editor.selection = newSelection

  // copy
  const text = editor.document.getText(editor.selection)
  vscode.env.clipboard.writeText(text)

  // return selection
  editor.selection = new vscode.Selection(position, position)
})
bind('p', editor => {
  vscode.env.clipboard.readText().then(text => {
    editor.edit(e => {
      e.insert(editor.selection.active, text)
    })
  })
})
