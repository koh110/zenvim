import { TextEditor } from 'vscode'

export type RunFunction = (editor: TextEditor) => void
export type WhenFunction = (editor: TextEditor) => boolean

export type Mapping = {
  commands: string
  mapping: {
    [key: string]: {
      run: RunFunction
      when: WhenFunction
    }
  }
}

export function bind(
  mapping: Mapping,
  key: string,
  run: RunFunction,
  when?: WhenFunction
): Mapping {
  mapping.mapping[key] = { run: run, when: () => true }
  mapping.commands = Object.keys(mapping.mapping).join('__')
  if (when) {
    mapping.mapping[key].when = when
  }
  return mapping
}
