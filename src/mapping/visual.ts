import * as vscode from 'vscode'
import { bind as bindBase, RunFunction, BindOptions, Mapping } from './common'
import {
  moveCursor,
  jumpToTop,
  jumpToBottom,
  jumpToCurrentStartOfLine,
  jumpToCurrentEndOfLine,
  jumpToNextWord,
  jumpToPrevWord
} from '../lib/cursor'
import { yank, cut, paste } from '../lib/clipbord'
import { hasSelection } from '../lib/editor'
import { state, setMode } from '../state'
import { Mode } from '../types'

export const mapping: Mapping = { commands: '', mapping: {} }

function bind(key: string, run: RunFunction, options?: BindOptions) {
  bindBase(mapping, key, run, options)
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
bind('w', editor => {
  jumpToNextWord(editor, getSelectOptions())
  moveCursor({ to: 'right', select: true })
})
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
  { when: editor => hasSelection(editor) }
)
bind(
  'd',
  editor => {
    cut(editor)
    setMode(Mode.NORMAL)
  },
  { when: editor => hasSelection(editor) }
)
bind('x', editor => {
  cut(editor)
  setMode(Mode.NORMAL)
})
bind('p', editor => {
  paste(editor)
  setMode(Mode.NORMAL)
})
