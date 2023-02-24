#!/usr/bin/env bash

# get script parameter
SRC_ROOT=$1

# create config files
RNC_ROOT=./node_modules/react-native-config/ &&
export SYMROOT=$RNC_ROOT/ios/ReactNativeConfig &&
ruby $RNC_ROOT/ios/ReactNativeConfig/BuildDotenvConfig.rb ${SRC_ROOT}/../ ${SYMROOT}
