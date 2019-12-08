import * as vscode from 'vscode'
import { state } from './state'
import { Mode } from './types'
import { moveCursor } from './lib/cursor'

function cursorUpOrDown(to: 'up' | 'down') {
  if (!vscode.window.activeTextEditor || state.mode === Mode.INSERT) {
    moveCursor({ to })
    return
  }
  if (state.mode === Mode.VISUAL || state.mode === Mode.VISUAL_LINE) {
    moveCursor({ to, select: true })
    return
  }
  moveCursor({ to })
}

function cursorRightOrLeft(to: 'right' | 'left') {
  if (!vscode.window.activeTextEditor || state.mode === Mode.INSERT) {
    moveCursor({ to })
    return
  }
  if (state.mode === Mode.VISUAL) {
    moveCursor({ to, select: true })
    return
  }
  moveCursor({ to })
}

export const cursorDown = () => cursorUpOrDown('down')
export const cursorUp = () => cursorUpOrDown('up')
export const cursorRight = () => cursorRightOrLeft('right')
export const cursorLeft = () => cursorRightOrLeft('left')
