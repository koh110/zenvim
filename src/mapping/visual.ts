import * as vscode from 'vscode'
import { bind as bindBase, RunFunction, WhenFunction, Mapping } from './common'
import {
  moveCursor,
  jumpToTop,
  jumpToBottom,
  jumpToCurrentStartOfLine,
  jumpToCurrentEndOfLine,
  jumpToNextWord,
  jumpToPrevWord
} from '../lib/cursor'
import { yankLine, yankLineAndDelete, yank, cut, paste } from '../lib/clipbord'
import { hasSelection } from '../lib/editor'
import { state, setMode } from '../state'
import { Mode } from '../types'

export const mapping: Mapping = { commands: '', mapping: {} }

function bind(key: string, run: RunFunction, when?: WhenFunction) {
  if (when) {
    bindBase(mapping, key, run, when)
    return
  }
  bindBase(mapping, key, run)
}

function getSelectOptions() {
  return { select: true, anchor: state.anchorPosition }
}

// mode
bind('A', editor => {
  jumpToCurrentEndOfLine(editor)
  setMode(Mode.INSERT)
})

// cursor
bind('h', () => moveCursor({ to: 'left', select: true }))
bind('l', () => moveCursor({ to: 'right', select: true }))
bind('j', () => moveCursor({ to: 'down', select: true }))
bind('k', () => moveCursor({ to: 'up', select: true }))
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
    yank()
    setMode(Mode.NORMAL)
  },
  editor => hasSelection(editor)
)
bind(
  'd',
  editor => {
    cut(editor)
    setMode(Mode.NORMAL)
  },
  editor => hasSelection(editor)
)
bind('p', editor => {
  paste(editor)
  setMode(Mode.NORMAL)
})
