import * as vscode from 'vscode'
import { Mode } from '../types'
import { setMode, setAnchorPosition } from '../state'
import { bind as bindBase, RunFunction, BindOptions, Mapping } from './common'
import {
  moveCursor,
  jumpToCurrentStartOfLine,
  jumpToCurrentEndOfLine,
  jumpToNextWord,
  jumpToPrevWord,
  jumpToTop,
  jumpToBottom
} from '../lib/cursor'
import { yankLine, yankLineAndDelete, paste, cut } from '../lib/clipbord'
import { hasSelection, lineSelection } from '../lib/editor'

export const mapping: Mapping = { commands: '', mapping: {} }

function bind(key: string, run: RunFunction, options?: BindOptions) {
  bindBase(mapping, key, run, options)
}

// mode
bind('v', editor => {
  setMode(Mode.VISUAL)
  setAnchorPosition(editor.selection.active)
  moveCursor({ to: 'right', select: true })
})
bind('V', editor => {
  setMode(Mode.VISUAL_LINE)
  lineSelection(editor)
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

// scroll
bind('e', () => vscode.commands.executeCommand('scrollLineDown'), {
  ctrl: true
})
bind('y', () => vscode.commands.executeCommand('scrollLineUp'), { ctrl: true })
bind('f', () => vscode.commands.executeCommand('scrollPageDown'), {
  ctrl: true
})
bind('b', () => vscode.commands.executeCommand('scrollPageUp'), { ctrl: true })

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
bind('r', () => vscode.commands.executeCommand('redo'), {
  ctrl: true
})

// clipboard
bind('yy', editor => yankLine(editor), {
  when: editor => !hasSelection(editor)
})
bind('dd', editor => yankLineAndDelete(editor), {
  when: editor => !hasSelection(editor)
})
bind('x', editor => cut(editor))
bind('p', editor => paste(editor))
bind('P', editor => paste(editor, { beforeCursor: true }))
