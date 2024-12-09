## EasyEdit

![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)

EasyEdit is an easy markdown editor that allows you to write Markdown (MD) and preview it in real-time. You can save, load .md files and export to HTML,TXT & PDF. All notable changes to this project will be documented in this file.

*EasyEdit is a free and open-source project. You can use it for free and modify it as you like.*

## Latest Example implementing custom tables...

<a><img src="screenshots/sample006.png" alt="Example" width="500" height="400"> <img src="screenshots/sample011.png" alt="Example" width="500" height="400"></a>

## Install the project
```
$ node --version
$ npm --version
$ git --version

$ git clone https://github.com/gcclinux/EasyEdit.git
$ cd EasyEdit
$ npm install
```

## Run the Standalone Project
```
$ npm start
```

## Run Project for localhost OR hosting https
```
$ npm run local
OR
$ npm run prd
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

## Gantt graph as code
```mermaid
gantt
    title Create EasyEdit
    dateFormat YYYY-MM-DD
    section Tasks
    Initial App :task1, 2024-11-11, 14d
    Add features :task2, 2024-11-18, 14d
    Run test :task3, 2024-11-25, 3d
    Deliver Product :task4, 2024-11-31 , 3d
```

## Table displayed

| header1 | header2 | header3 |
| :--- | :--- | :--- |
| row1 | col2 | col3 |
| row2 | col2 | col3 |

Example of a footnote[^1] within text.
  [^1]: Description of footnote text