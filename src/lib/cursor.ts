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
  if (options && options.select) {
    editor.selection = new Selection(
      options.anchor,
      new Position(line, charactor)
    )
  } else if (options && options.selectLine) {
    const anchorChar =
      options.anchor.line < line
        ? 0
        : editor.document.lineAt(options.anchor.line).text.length
    const activeChar =
      options.anchor.line < line ? editor.document.lineAt(line).text.length : 0
    editor.selection = new Selection(
      new Position(options.anchor.line, anchorChar),
      new Position(line, activeChar)
    )
  } else {
    editor.selection = new Selection(
      new Position(line, charactor),
      new Position(line, charactor)
    )
  }

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
    return
  }
  commands.executeCommand('cursorEnd')
}

export function jumpToNextWord(editor: TextEditor, options?: SelectOption) {
  const nextWord = findNextWord(editor.document, editor.selection.active)
  if (nextWord) {
    const line = editor.selection.active.line
    const char = nextWord.start
    if (options && options.select) {
      jumpCursor(editor, line, char, options)
      return
    }
    jumpCursor(editor, line, char)
    return
  }
  jumpToCurrentEndOfLine(editor)
}

export function jumpToPrevWord(editor: TextEditor, options?: SelectOption) {
  const prevWord = findPrevWord(editor.document, editor.selection.active)
  if (prevWord) {
    const line = editor.selection.active.line
    const char = prevWord.start
    if (options && options.select) {
      jumpCursor(editor, line, char, options)
      return
    }
    jumpCursor(editor, line, char)
  }
}
