.PHONY: changelog-latest

CHANGELOG_FILE=CHANGELOG.md

changelog-latest:
	git-chglog $(git describe --tags $(git rev-list --tags --max-count=1)) --no-case -o $(CHANGELOG_FILE)
