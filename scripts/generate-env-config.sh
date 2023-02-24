#!/usr/bin/env bash

# get script parameter
SRC_ROOT=$1

# Generate tmp.xcconfig
"${SRC_ROOT}/../node_modules/react-native-config/ios/ReactNativeConfig/BuildXCConfig.rb" "${SRC_ROOT}/.." "${SRC_ROOT}/tmp.xcconfig"
