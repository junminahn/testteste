.PHONY: changelog-unrelease changelog changelog-latest release

SEMTAG=semtag

CHANGELOG_FILE = CHANGELOG.md

scope ?= "minor"

changelog-unrelease:
	git-chglog --no-case -o $(CHANGELOG_FILE)

changelog:
	git-chglog --no-case -o $(CHANGELOG_FILE) --next-tag `$(SEMTAG) final -s $(scope) -o -f`

changelog-latest:
	git-chglog --no-case -o $(CHANGELOG_FILE) $(git describe --tags $(git rev-list --tags --max-count=1))

release:
	$(SEMTAG) final -s $(scope)
