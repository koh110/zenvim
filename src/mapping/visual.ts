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
import { yank, cut, paste } from '../lib/clipboard'
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
bind('>', editor => {
  jumpToCurrentStartOfLine(editor)
  vscode.commands.executeCommand('editor.action.indentLines')
  setMode(Mode.NORMAL)
})
bind('<', () => {
  vscode.commands.executeCommand('editor.action.outdentLines')
  setMode(Mode.NORMAL)
})

// clipboard
bind(
  'y',
  editor => {
    yank(editor)
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
bind('P', editor => {
  paste(editor, { beforeCursor: true })
  setMode(Mode.NORMAL)
})
