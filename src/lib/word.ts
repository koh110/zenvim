import { Position, TextDocument } from 'vscode'

function isWhiteSpaceOrSymbolsForChar(char: string) {
  return /[\t\s:,.;(){}<>~#@$%&=+\-*/\\"'`|?\][]/.test(char)
}

function isWhiteSpace(str: string) {
  return /^[\t\s]+$/.test(str)
}

function findNextWordIndex(str: string): number | null {
  const regexp = /(\t|\s)+(.*)|([:;,.(){}\][<>~#@$%&!=+\-*"'`|?])/
  const res = str.match(regexp)
  if (!res || res.index === undefined) {
    return null
  }

  // match white space
  if (res[2]) {
    return str.length - res[2].length
  }

  let index = res.index
  if (index === 0) {
    if (isWhiteSpaceOrSymbolsForChar(str[1])) {
      // research word
      const recursive = findNextWordIndex(str.substring(1))
      return recursive === null ? null : recursive + 1
    }
    index++
  }

  // match symbol
  return index < str.length ? index : null
}

export function findNextWord(
  document: TextDocument,
  position: Position
): { line: number; character: number } | null {
  const lineContent = document.lineAt(position.line).text
  const nextLine = position.line + 1
  const hasNextLine = nextLine < document.lineCount

  let searchStr = lineContent.substring(position.character)

  // not end of line
  if (searchStr.length > 1) {
    const nextIndex = findNextWordIndex(searchStr)
    if (nextIndex !== null) {
      return { line: position.line, character: position.character + nextIndex }
    }
  }

  if (!hasNextLine) {
    return null
  }

  searchStr = document.lineAt(nextLine).text
  if (searchStr.length === 0 || !isWhiteSpaceOrSymbolsForChar(searchStr[0])) {
    return { line: nextLine, character: 0 }
  }

  const nextLineIndex = findNextWordIndex(searchStr)
  if (nextLineIndex !== null) {
    return { line: nextLine, character: nextLineIndex }
  }

  return null
}

function findPrevWordIndex(str: string): number | null {
  if (isWhiteSpace(str)) {
    return null
  }

  const indexes = []
  let substr = str
  let index = null

  do {
    if (isWhiteSpace(substr)) {
      break
    }

    index = findNextWordIndex(substr)

    if (index !== null) {
      indexes.push({ index, str: substr })
      substr = substr.substring(index)
    }
  } while (index !== null && index >= 0)

  if (substr.length > 0 && !isWhiteSpace(substr)) {
    indexes.push({ index: 1, str: substr })
  }

  if (indexes.length <= 0) {
    return null
  }

  let poped = undefined
  let prevIndex = 0
  do {
    poped = indexes.pop()
    if (poped) {
      prevIndex += poped.str.length
    }
  } while (poped !== undefined && prevIndex === 0)

  return str.length - prevIndex
}

export function findPrevWord(
  document: TextDocument,
  position: Position
): { line: number; character: number } | null {
  const lineContent = document.lineAt(position.line).text
  const prevLine = position.line - 1
  const hasPrevLine = 0 <= prevLine

  let searchStr = lineContent.substring(0, position.character)

  const prevIndex = findPrevWordIndex(searchStr)
  if (prevIndex !== null) {
    return { line: position.line, character: prevIndex }
  }

  if (!hasPrevLine) {
    return null
  }

  searchStr = document.lineAt(prevLine).text
  if (searchStr.length === 0) {
    return { line: prevLine, character: 0 }
  }

  const prevLineIndex = findPrevWordIndex(searchStr)
  if (prevLineIndex !== null) {
    return { line: prevLine, character: prevLineIndex }
  }

  return null
}
