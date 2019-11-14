# ZenVim

ZenVim is simple Vim-like extension. ZenVim provide for `Move cursor` and `Clipboard Action`.

ZenVim does not aim at perfect emulation.

## Mode

ZenVim have 4 mode.

- NORMAL
- INSERT
- VISUAL
- VISUAL_LINE

## Commands

### Mode

| Key | Mode                        | Description                             |
| --- | --------------------------- | --------------------------------------- |
| Esc | INSERT, VISUAL, VISUAL_LINE | Enter NORMAL mode                       |
| i   | NORMAL                      | Enter INSERT mode                       |
| A   | NORMAL, VISUAL              | Go to End of Line and Enter INSERT mode |
| o   | NORMAL                      | Insert Line Below and Enter INSERT mode |
| O   | NORMAL                      | Insert Line Above and Enter INSERT mode |
| v   | NORMAL                      | Enter VISUAL mode                       |
| V   | NORMAL                      | Enter VISUAL LINE mode                  |

### Scroll

| Key      | Mode                        | Description      |
| -------- | --------------------------- | ---------------- |
| Ctrl + e | NORMAL, VISUAL, VISUAL_LINE | Scroll Line Down |
| Ctrl + y | NORMAL, VISUAL, VISUAL_LINE | Scroll Line Up   |
| Ctrl + f | NORMAL, VISUAL, VISUAL_LINE | Scroll Page Down |
| Ctrl + b | NORMAL, VISUAL, VISUAL_LINE | Scroll Page Up   |

### Cursor

| Key | Mode                        | Description             |
| --- | --------------------------- | ----------------------- |
| h   | NORMAL, VISUAL              | Move Cursor to Left     |
| l   | NORMAL, VISUAL              | Move Cursor to Right    |
| j   | NORMAL, VISUAL, VISUAL_LINE | Move Cursor to Down     |
| k   | NORMAL, VISUAL, VISUAL_LINE | Move Cursor to Up       |
| gg  | NORMAL, VISUAL, VISUAL_LINE | Go to Beginning of File |
| G   | NORMAL, VISUAL, VISUAL_LINE | Go to End of File       |
| 0   | NORMAL, VISUAL              | Go to Beginning of Line |
| \$  | NORMAL, VISUAL              | Go to End of Line       |
| w   | NORMAL, VISUAL              | Go to Next Word         |
| b   | NORMAL, VISUAL              | Go to Prev Word         |

### Clipboard

| Key | Mode                        | Description                         |
| --- | --------------------------- | ----------------------------------- |
| y   | VISUAL, VISUAL              | Copy Selected Characters            |
| yy  | NORMAL, VISUAL_LINE         | Copy Line                           |
| d   | NORMAL, VISUAL              | Copy and Delete Selected Characters |
| dd  | NORMAL, VISUAL_LINE         | Copy and Delete Line                |
| x   | NORMAL, VISUAL              | Copy and Delete Character on Cursor |
| p   | NORMAL, VISUAL, VISUAL_LINE | Put Copied Characters               |
| P   | NORMAL, VISUAL, VISUAL_LINE | Put Copied Characters Before Cursor |

### Others

| Key      | Mode                        | Description |
| -------- | --------------------------- | ----------- |
| u        | NORMAL, VISUAL, VISUAL_LINE | Undo        |
| Ctrl + r | NORMAL, VISUAL, VISUAL_LINE | Redo        |

## Release Notes

### 0.1.2

- bugfix

### 0.1.1

- fix `Ctrl + f`, `Ctrl + b`
- fix `Esc`

### 0.1.0

- add `P`
- bugfix

### 0.0.1

Beta Release.
