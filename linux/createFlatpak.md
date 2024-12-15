- ### Install pre-requisite flatpakrepo
```
$ flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```

- ### Download the latest release
[![GitHub Project](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/public/easyedit128.png "EasyEdit")](https://github.com/gcclinux/EasyEdit/releases)

- #### Example today
[https://github.com/gcclinux/EasyEdit/releases/download/1.3.5/EasyEdit-1.3.5-x64-linux.zip](https://github.com/gcclinux/EasyEdit/releases/download/1.3.5/EasyEdit-1.3.5-x64-linux.zip)

   
- #### Download the org.flatpak.EasyEdit.yml
[https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/linux/org.flatpak.EasyEdit.yml](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/linux/org.flatpak.EasyEdit.yml)      
   
```
$ curl -O https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/linux/org.flatpak.EasyEdit.yml
```  

- ### First test the build yml file
```
$ flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest io.github.gcclinux.EasyEdit.yml
```
- ### Next build as normal package
```
$ flatpak-builder --force-clean --user --install --install-deps-from=flathub --repo=repo builddir io.github.gcclinux.EasyEdit.yml
```
- ### Initialise the repository if not already done
```
$ flatpak-builder --repo=repo build-dir io.github.gcclinux.EasyEdit.yml
```

- ### Create single file bundle from repo
```
$ flatpak build-bundle repo EasyEdit-$(arch)-1.3.5.flatpak io.github.gcclinux.EasyEdit.yml
```

- ### Install new created file
```
$ flatpak install --user EasyEdit-$(arch)-1.3.5.flatpak
```