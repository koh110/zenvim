import {
  commands,
  TextEditor,
  Selection,
  Position,
  Range,
  TextEditorRevealType
} from 'vscode'
import { findNextWord, findPrevWord } from './word'
import { lineLength } from './editor'

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

function jumpCursorWithSelectLine(
  editor: TextEditor,
  line: number,
  charactor: number,
  options: SelectOption
) {
  const anchorLineLength = lineLength(editor, options.anchor.line)
  const activeLineLength = lineLength(editor, line)

  const anchorLine = options.anchor.line
  let anchorChar = 0
  const activeLine = line
  let activeChar = activeLineLength

  if (activeLine === anchorLine) {
    activeChar = activeLineLength
  } else if (activeLine <= anchorLine) {
    activeChar = 0
    anchorChar = anchorLineLength
  } else if (anchorLine < activeLine) {
    anchorChar = 0
    activeChar = activeLineLength
  }

  const anchor = new Position(anchorLine, anchorChar)
  const active = new Position(activeLine, activeChar)

  // jump
  editor.selection = new Selection(anchor, active)
  editor.revealRange(
    new Range(line, charactor, line, charactor),
    TextEditorRevealType.Default
  )
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

  if (options && options.selectLine) {
    jumpCursorWithSelectLine(editor, line, charactor, options)
    return
  }

  let anchor = null
  const active = new Position(line, charactor)

  if (options && options.select) {
    anchor = options.anchor
  } else {
    anchor = new Position(line, charactor)
  }

  // jump
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
  const line = editor.selection.active.line
  jumpCursor(editor, line, editor.document.lineAt(line).text.length, options)
  if (options && (options.select || options.selectLine)) {
    moveCursor({ to: 'right', select: true })
    return
  }
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
