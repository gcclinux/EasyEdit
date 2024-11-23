## EasyEdit

EasyEdit is an easy markdown editor that allows you to write Markdown (MD) and preview it in real-time. You can save, load .md files and export to HTML,TXT & PDF. All notable changes to this project will be documented in this file.

## Latest Example implementing custom tables...

<img src="screenshots/sample005.png" alt="Example" width="500" height="300">

## Install the project
```
$ node --version
$ npm --version
$ git --version

$ git clone https://github.com/gcclinux/EasyEdit.git
$ cd EasyEdit
$ npm install
```


## Run the project
```
$ npm start
```

## Build as an standalone App (Windows & Linux)
```
$ npm run electron:build
```

## Mermeid example

```mermaid
flowchart TD
    A[Christmas] -->|Get money| B(Go shopping)
    B --> C{Let me think}
    C -->|One| D[Laptop]
    C -->|Two| E[iPhone]
    C -->|Three| F[fa:fa-car Car]
```

## Tables as code
```

| header1 | header2 | header3 |
| :--- | :--- | :--- |
| row1 | col2 | col3 |
| row2 | col2 | col3 |

```

## Table displayed

| header1 | header2 | header3 |
| :--- | :--- | :--- |
| row1 | col2 | col3 |
| row2 | col2 | col3 |

Example of a footnote[^1] within text.
  [^1]: Description of footnote text