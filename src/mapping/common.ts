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

type ParseOption = {
  ctrl?: boolean
}

export function parseKey(key: string, options: ParseOption) {
  if (options.ctrl) {
    return `<C-${key}>`
  }
  return key
}

export type BindOptions = {
  when?: WhenFunction
  ctrl?: boolean
}

export function bind(
  mapping: Mapping,
  key: string,
  run: RunFunction,
  options?: BindOptions
): Mapping {
  key = parseKey(key, { ctrl: options ? options.ctrl : false })
  mapping.mapping[key] = { run: run, when: () => true }
  mapping.commands = Object.keys(mapping.mapping).join('__')
  if (options && options.when) {
    mapping.mapping[key].when = options.when
  }
  return mapping
}
