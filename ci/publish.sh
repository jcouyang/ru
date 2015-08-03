#!/bin/bash
set -x -e
VERSION=$(./ci/version)
if [ $(npm view ru-lang version) != $VERSION ]
then
    echo "publish new version $VERSION"
    ./login-npm.sh
    npm publish
fi
