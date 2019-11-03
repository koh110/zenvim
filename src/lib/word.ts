import { Position, TextDocument } from 'vscode'

function isWhitespaceCharacter(char: string) {
  return char === ' ' || char === '\t'
}

function isNonWordCharacter(char: string) {
  return /\/\\\(\)"':,\.;<>~!@#\$%\^&\*\|\+=\[\]\{\}`?-/.test(char)
}

function isWordCharacter(char: string): boolean {
  return !isWhitespaceCharacter(char) && !isNonWordCharacter(char)
}

function findStartOfNextWord(lineContent: string, startIndex: number): number {
  for (let i = startIndex; i < lineContent.length; i++) {
    const char = lineContent[i]
    if (isWordCharacter(char)) {
      return i
    }
  }
  return 0
}

function findEndOfNextWord(lineContent: string, startIndex: number): number {
  for (let i = startIndex; i < lineContent.length; i++) {
    const char = lineContent[i]
    if (!isWordCharacter(char)) {
      return i
    }
  }
  return 0
}

export function findNextWord(
  document: TextDocument,
  position: Position
): { start: number; end: number } | null {
  const lineContent = document.lineAt(position.line).text

  for (let i = position.character; i < lineContent.length; i++) {
    const char = lineContent[i]
    if (!isWordCharacter(char)) {
      const start = findStartOfNextWord(lineContent, i)
      const end = findEndOfNextWord(lineContent, start)
      return { start, end }
    }
  }

  return null
}

function findStartOfPrevWord(lineContent: string, startIndex: number): number {
  for (let i = startIndex; 0 <= i; i--) {
    const char = lineContent[i]
    if (!isWordCharacter(char)) {
      return i
    }
  }
  return 0
}

function findEndOfPrevWord(lineContent: string, startIndex: number): number {
  for (let i = startIndex; 0 <= i; i--) {
    const char = lineContent[i]
    if (isWordCharacter(char)) {
      return i
    }
  }
  return 0
}

export function findPrevWord(
  document: TextDocument,
  position: Position
): { start: number; end: number } | null {
  const lineContent = document.lineAt(position.line).text

  for (let i = position.character; 0 <= i; i--) {
    const char = lineContent[i]
    if (!isWordCharacter(char)) {
      const end = findEndOfPrevWord(lineContent, i)
      const start = findStartOfPrevWord(lineContent, end)
      return { start, end }
    }
  }
  return null
}
