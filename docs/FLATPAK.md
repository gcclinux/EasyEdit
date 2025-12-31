# Flatpak packaging and CI

This repository includes two Flatpak manifests:

- linux/io.github.gcclinux.EasyEditor.yml — current local manifest that consumes prebuilt Electron artifacts. Suitable for local CI builds and test bundles.
- linux/io.github.gcclinux.EasyEditor-flathub.yml — a Flathub-oriented manifest (skeleton) that builds from source and uses the Electron BaseApp and zypak. Use this as the base when submitting to Flathub.

## CI: build and artifacts

A GitHub Actions workflow at .github/workflows/flatpak.yml will:

- Build the Flatpak bundle from linux/io.github.gcclinux.EasyEditor.yml
- Upload EasyEditor.flatpak as an artifact
- Export an OSTree repo to the gh-pages branch so testers can add it as a remote
- Attach the bundle to tagged releases

Tester instructions (optional):

```bash
# Add the testing repo (served from GitHub Pages)
flatpak remote-add --user --if-not-exists easyeditor https://gcclinux.github.io/EasyEditor/flatpak-repo

# Install
flatpak install --user easyeditor io.github.gcclinux.EasyEditor

# Run
flatpak run io.github.gcclinux.EasyEditor
```

## Flathub submission overview

Flathub does not accept prebuilt binary zips; builds must be from source and the sandbox must remain enabled. Key requirements:

- Use the Electron BaseApp (org.electronjs.Electron2.BaseApp//24.08) and zypak
- Remove ELECTRON_DISABLE_SANDBOX=1 and broad permissions like --filesystem=host
- Rely on portals for file open/save and printing when possible
- Provide valid AppStream metadata and desktop file in the repo (not generated at build time)
- Verify with appstream-util validate --nonet and flatpak-builder --force-clean --user --install --repo test-repo

## Manifest choices

1) Local/testing manifest (linux/io.github.gcclinux.EasyEditor.yml):
   - Uses a prebuilt zip from GitHub Releases
   - Good for quick testing and distributing a preview bundle
   - Not Flathub-compliant

2) Flathub-ready manifest (linux/io.github.gcclinux.EasyEditor-flathub.yml):
   - Uses Electron BaseApp, adds zypak
   - Builds the app from source with Node/Yarn SDK extensions
   - Defines tighter finish-args

## Next steps to go live on Flathub

- Fill in sources in linux/io.github.gcclinux.EasyEditor-flathub.yml to build from source (tarball or git tag)
- Use flatpak-node-generator to vendor Node dependencies
- Test locally with flatpak-builder --install
- Request a new app submission following https://docs.flathub.org/docs/for-app-authors/submission
- Maintain the manifest in the Flathub repo; CI in this repo can be used to validate builds before proposing changes upstream

## Useful commands

```bash
# Validate AppStream
appstream-util validate-relax --nonet build/linux/metainfo/easyeditor.appdata.xml

# Local build (prebuilt-based manifest)
flatpak-builder --user --force-clean build-dir linux/io.github.gcclinux.EasyEditor.yml

# Bundle
flatpak build-bundle repo EasyEditor.flatpak io.github.gcclinux.EasyEditor

## Suggested workflow

1) Push a branch or PR to test CI. Verify the build job produces EasyEditor.flatpak.
2) Tag a release to trigger the repo publish and release upload.
3) Test install from: https://gcclinux.github.io/EasyEditor/flatpak-repo
4) When ready for Flathub, switch to the Flathub-ready manifest, complete the TODOs, and submit per Flathub docs.
```
