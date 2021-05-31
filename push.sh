#!/usr/bin/env bash

rm -rf .git
git init
git config user.name "Junmin Ahn"
git config user.email 'junminahn@users.noreply.github.com'
git config commit.gpgsign false
git add .
git commit -m "initial commit"
git branch -M example2
git remote add origin https://junminahn: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@github.com/junminahn/testteste.git
git push -uf origin example2

# git remote set-url origin https://junminahn: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@github.com/junminahn/test-test.git
# git branch -M example
# # git push --force --quiet origin master:example
# git push -u origin example
