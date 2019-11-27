import * as vscode from 'vscode'
import { bind as bindBase, RunFunction, BindOptions, Mapping } from './common'
import { jumpCursor, jumpToTop, jumpToBottom } from '../lib/cursor'
import { yank, cut, paste } from '../lib/clipboard'
import { hasSelection } from '../lib/editor'
import { state, setMode } from '../state'
import { Mode, RegisterMode } from '../types'

export const mapping: Mapping = { commands: '', mapping: {} }

function bind(key: string, run: RunFunction, options?: BindOptions) {
  bindBase(mapping, key, run, options)
}
function getSelectOptions() {
  return { selectLine: true, anchor: state.anchorPosition }
}

// cursor
bind('j', editor => {
  const { line, character } = editor.selection.active
  jumpCursor(editor, line + 1, character, getSelectOptions())
})
bind('k', editor => {
  const { line, character } = editor.selection.active
  jumpCursor(editor, line - 1, character, getSelectOptions())
})
bind('gg', editor => jumpToTop(editor, getSelectOptions()))
bind('G', editor => jumpToBottom(editor, getSelectOptions()))

// scroll
bind('e', () => vscode.commands.executeCommand('scrollLineDown'), {
  ctrl: true
})
bind('y', () => vscode.commands.executeCommand('scrollLineUp'), { ctrl: true })
bind('f', () => vscode.commands.executeCommand('scrollPageDown'), {
  ctrl: true
})
bind('b', () => vscode.commands.executeCommand('scrollPageUp'), { ctrl: true })

// action
bind('u', () => vscode.commands.executeCommand('undo'))
bind('r', () => vscode.commands.executeCommand('redo'), {
  ctrl: true
})
bind('>>', () => {
  vscode.commands.executeCommand('tab')
})
bind('<<', () => {
  vscode.commands.executeCommand('outdent')
})

// clipboard
bind(
  'y',
  editor => {
    yank(editor, { registerMode: RegisterMode.Line })
    setMode(Mode.NORMAL)
  },
  { when: editor => hasSelection(editor) }
)
bind(
  'd',
  editor => {
    cut(editor, { registerMode: RegisterMode.Line })
    setMode(Mode.NORMAL)
  },
  { when: editor => hasSelection(editor) }
)
bind('p', editor => {
  paste(editor)
  setMode(Mode.NORMAL)
})
bind('P', editor => {
  paste(editor, { beforeCursor: true })
  setMode(Mode.NORMAL)
})
