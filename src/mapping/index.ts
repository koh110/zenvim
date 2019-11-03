import { TextEditor } from 'vscode'
import { Mode } from '../types'
import { Mapping } from './common'
import { mapping as normalMapping } from './normal'
import { mapping as vusualMapping } from './visual'
import { mapping as visualLineMapping } from './visualLine'

const keyMapping: { [key: string]: Mapping } = {
  [Mode.NORMAL]: normalMapping,
  [Mode.VISUAL]: vusualMapping,
  [Mode.VISUAL_LINE]: visualLineMapping
}

export function getKeyMapping() {
  return keyMapping
}

export function hasCommand(mode: Mode, text: string) {
  const commands = keyMapping[mode].commands
  // escape
  const regexp = /[$+]/g
  if (regexp.test(text)) {
    text = text.replace(/[$+]/g, '\\$&')
  }
  if (!text) {
    return false
  }
  return new RegExp(`${text}*`).test(commands)
}

export function run(
  mode: Mode,
  editor: TextEditor,
  text: string
): { run: boolean } {
  const mappingMode = keyMapping[mode]
  if (!mappingMode) {
    return { run: false }
  }
  const res = mappingMode.mapping[text]
  if (res && res.run && res.when(editor)) {
    res.run(editor)
    return { run: true }
  }

  return { run: false }
}
