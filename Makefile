.PHONY: changelog-unrelease

CHANGELOG_FILE=CHANGELOG.md

scope ?= "minor"

changelog-unrelease:
	git-chglog --no-case -o $(CHANGELOG_FILE)
