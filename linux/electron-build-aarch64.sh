#!/usr/bin/env bash
#
# sudo apt install snapcraft
# sudo snap install multipass
# sudo apt install ruby
# sudo gem install fpm
# sudo snap install lxd
# sudo usermod -aG lxd ${USER}
# multipass start
#
export USE_SYSTEM_FPM=true
export PATH="$PATH:$GEM_HOME/bin"
export GEM_HOME="$(ruby -e 'puts Gem.user_dir')"
npm run electron:build