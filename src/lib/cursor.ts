import {
  commands,
  TextEditor,
  Selection,
  Position,
  Range,
  TextEditorRevealType
} from 'vscode'
import { findNextWord, findPrevWord } from './word'

export function moveCursor(options: {
  to: 'left' | 'right' | 'up' | 'down'
  select?: boolean
  by?: 'line' | 'wrappedLine' | 'character' | 'halfLine'
}) {
  commands.executeCommand('cursorMove', options)
}

type SelectOption = {
  select?: boolean
  anchor: Position
  selectLine?: boolean
}

export function jumpCursor(
  editor: TextEditor,
  line: number,
  charactor: number,
  options?: SelectOption
) {
  if (line < 0 || editor.document.lineCount < line) {
    return
  }

  let anchor = null
  let active = null

  if (options && options.select) {
    anchor = options.anchor
    active = new Position(line, charactor)
  } else if (options && options.selectLine) {
    const anchorChar =
      options.anchor.line < line
        ? 0
        : editor.document.lineAt(options.anchor.line).text.length
    const activeChar =
      options.anchor.line < line ? editor.document.lineAt(line).text.length : 0
    anchor = new Position(options.anchor.line, anchorChar)
    active = new Position(line, activeChar)
  } else {
    anchor = new Position(line, charactor)
    active = new Position(line, charactor)
  }

  editor.selection = new Selection(anchor, active)

  editor.revealRange(
    new Range(line, charactor, line, charactor),
    TextEditorRevealType.Default
  )
}

export function jumpToTop(editor: TextEditor, options?: SelectOption) {
  if (options && (options.select || options.selectLine)) {
    jumpCursor(editor, 0, 0, options)
  } else {
    commands.executeCommand('cursorTop')
  }
}

export function jumpToBottom(editor: TextEditor, options?: SelectOption) {
  const lastLine = editor.document.lineCount - 1
  if (options && (options.select || options.selectLine)) {
    jumpCursor(editor, lastLine, 0, options)
    return
  }
  jumpCursor(editor, lastLine, 0)
}

export function jumpToCurrentStartOfLine(
  editor: TextEditor,
  options?: SelectOption
) {
  const line = editor.selection.active.line
  const char = 0
  if (options && (options.select || options.selectLine)) {
    jumpCursor(editor, line, char, options)
    return
  }
  jumpCursor(editor, line, char)
}

export function jumpToCurrentEndOfLine(
  editor: TextEditor,
  options?: SelectOption
) {
  if (options && (options.select || options.selectLine)) {
    const line = editor.selection.active.line
    jumpCursor(editor, line, editor.document.lineAt(line).text.length, options)
    moveCursor({ to: 'right', select: true })
    return
  }
  commands.executeCommand('cursorEnd')
}

export function jumpToNextWord(editor: TextEditor, options?: SelectOption) {
  const nextWord = findNextWord(editor.document, editor.selection.active)
  if (nextWord) {
    if (options && options.select) {
      jumpCursor(editor, nextWord.line, nextWord.character, options)
      return
    }
    jumpCursor(editor, nextWord.line, nextWord.character)
    return
  }
}

export function jumpToPrevWord(editor: TextEditor, options?: SelectOption) {
  const prevWord = findPrevWord(editor.document, editor.selection.active)
  if (prevWord) {
    if (options && options.select) {
      jumpCursor(editor, prevWord.line, prevWord.character, options)
      return
    }
    jumpCursor(editor, prevWord.line, prevWord.character)
  }
}
