## *EasyEdit*

![EasyEdit](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png)

EasyEdit is an easy markdown editor that allows you to write Markdown (MD) and preview it in real-time. You can save, load .md files and export to HTML,TXT & PDF. The idea is to provide a single MD / Mermaid Aplication that can help creating MD documents by build the MD code as easy as a click of a button.

** *EasyEdit is a free and open-source project. You can use it for free and modify it as you like.* **

## *Install the project*
```
$ node --version
$ npm --version
$ git --version

$ git clone https://github.com/gcclinux/EasyEdit.git
$ cd EasyEdit
$ npm install
```

## *Run the Standalone Project*
```
$ npm run app
```

## *Run the server manually*
```
$ npm run server
```

## *Build as an standalone App (Windows & Linux)*
```
$ npm run electron:build
```

## *Run Docker Example*
```
# Github x86_64
# Pull
$ docker pull ghcr.io/gcclinux/easyedit:main
# Run x86_64
$ docker run -d --name EASYEDIT-GHCR -p 3024:3024 ghcr.io/gcclinux/easyedit:main

# Docker Hub aarch64
# Pull aarch64
$ docker pull gcclinux/easyedit:1.3.8-aarch64
# Run aarch64
$ docker run -d --name EASYEDIT -p 3024:3024 gcclinux/easyedit:1.3.8-aarch64

# Docker Hub x86_64
# Pull x86_64
$ docker pull gcclinux/easyedit:1.3.8
# Run x86_64
$ docker run -d --name EASYEDIT -p 3024:3024 gcclinux/easyedit:1.3.8
```

## *Latest Example implementing custom tables...*

<a><img src="screenshots/sample006.png" alt="Example" width="500" height="400"> <img src="screenshots/sample012.png" alt="Example" width="500" height="400"></a>

## *Example Gantt graph as code*
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

## *Example Table displayed*

| header1 | header2 | header3 |
| :--- | :--- | :--- |
| row1 | col2 | col3 |
| row2 | col2 | col3 |

## *Markdown Image URL Example*

[![GitHub Project](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png "EasyEdit Icon")](https://github.com/gcclinux/EasyEdit)

## NOTE:
### If AppImage fails with setuid_sandbox_host as it happens in some systems:
```
FATAL:setuid_sandbox_host.cc(163)] The SUID sandbox helper binary was found, but is not configured correctly. Rather than run without sandboxing I'm aborting now. You need to make sure that /tmp/.mount_EasyEduPn1dQ/chrome-sandbox is owned by root and has mode 4755.
```
### Solution Exec:
```
./EasyEdit-1.3.7-x86_64.AppImage --no-sandbox
```
