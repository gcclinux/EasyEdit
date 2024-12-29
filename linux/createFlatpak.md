- ### Install pre-requisite flatpakrepo & flatpak-builder
```
$ flatpak remote-add --if-not-exists --user flathub https://dl.flathub.org/repo/flathub.flatpakrepo
```
```
$ flatpak install org.flatpak.Builder
```
   
- #### Download the io.github.gcclinux.EasyEdit.yml
[https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/linux/io.github.gcclinux.EasyEdit.yml](https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/linux/io.github.gcclinux.EasyEdit.yml)      
   
```
$ curl -O https://raw.githubusercontent.com/gcclinux/EasyEdit/refs/heads/main/linux/io.github.gcclinux.EasyEdit.yml
```  

- ### Build the Flatpak: Use the flatpak-builder command to build the package.
```
$ flatpak-builder --force-clean --user --install-deps-from=flathub --repo=repo builddir io.github.gcclinux.EasyEdit.yml
```
- ### Export the Flatpak Package: After the build is complete, export the package to a file
```
$ flatpak build-export repo builddir
```
- ### Create the Flatpak File: Use the flatpak build-bundle command to create the .flatpak file.
```
$ flatpak build-bundle repo EasyEdit-1.3.6.flatpak io.github.gcclinux.EasyEdit
```
- ### Install new created file
```
$ flatpak install --user EasyEdit-$(arch)-1.3.6.flatpak
```