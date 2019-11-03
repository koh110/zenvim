import * as vscode from 'vscode'
import { bind as bindBase, RunFunction, BindOptions, Mapping } from './common'
import {
  jumpCursor,
  jumpToCurrentStartOfLine,
  jumpToCurrentEndOfLine,
  jumpToNextWord,
  jumpToPrevWord,
  jumpToTop,
  jumpToBottom
} from '../lib/cursor'
import { yank, cut, paste } from '../lib/clipbord'
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
bind('h', editor => {
  const { line, character } = editor.selection.active
  jumpCursor(editor, line, character - 1, getSelectOptions())
})
bind('l', editor => {
  const { line, character } = editor.selection.active
  jumpCursor(editor, line, character + 1, getSelectOptions())
})
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
bind('0', editor => jumpToCurrentStartOfLine(editor, getSelectOptions()))
bind('$', editor => jumpToCurrentEndOfLine(editor, getSelectOptions()))
bind('w', editor => jumpToNextWord(editor, getSelectOptions()))
bind('b', editor => jumpToPrevWord(editor, getSelectOptions()))

// action
bind('u', () => vscode.commands.executeCommand('undo'))

// clipboard
bind(
  'y',
  () => {
    yank({ registerMode: RegisterMode.Line })
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
