import * as vscode from 'vscode'
import { Mode } from '../types'
import { setMode, setAnchorPosition } from '../state'
import {
  moveCursor,
  jumpToCurrentStartOfLine,
  jumpToCurrentEndOfLine,
  jumpToNextWord,
  jumpToPrevWord,
  jumpToTop,
  jumpToBottom
} from '../lib/cursor'
import { yankLine, yankLineAndDelete, paste, yank, cut } from '../lib/clipbord'
import { hasSelection } from '../lib/editor'
import { bind as bindBase, RunFunction, WhenFunction, Mapping } from './common'

export const mapping: Mapping = { commands: '', mapping: {} }

function bind(key: string, run: RunFunction, when?: WhenFunction) {
  if (when) {
    bindBase(mapping, key, run, when)
    return
  }
  bindBase(mapping, key, run)
}

// mode
bind('v', editor => {
  setMode(Mode.VISUAL)
  setAnchorPosition(editor.selection.active)
})
bind('i', () => setMode(Mode.INSERT))
bind('A', editor => {
  jumpToCurrentEndOfLine(editor)
  setMode(Mode.INSERT)
})
bind('o', async () => {
  await vscode.commands.executeCommand('editor.action.insertLineAfter')
  setMode(Mode.INSERT)
})
bind('O', async () => {
  await vscode.commands.executeCommand('editor.action.insertLineBefore')
  setMode(Mode.INSERT)
})

// cursor
bind('h', () => moveCursor({ to: 'left' }))
bind('l', () => moveCursor({ to: 'right' }))
bind('j', () => moveCursor({ to: 'down' }))
bind('k', () => moveCursor({ to: 'up' }))
bind('gg', editor => jumpToTop(editor))
bind('G', editor => jumpToBottom(editor))
bind('0', editor => jumpToCurrentStartOfLine(editor))
bind('$', editor => jumpToCurrentEndOfLine(editor))
bind('w', editor => jumpToNextWord(editor))
bind('b', editor => jumpToPrevWord(editor))

// action
bind('u', () => vscode.commands.executeCommand('undo'))

// clipboard
bind('yy', editor => yankLine(editor), editor => !hasSelection(editor))
bind('dd', editor => yankLineAndDelete(editor), editor => !hasSelection(editor))
bind('p', editor => paste(editor))
