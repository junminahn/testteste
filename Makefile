.PHONY: changelog-unrelease changelog changelog-latest release

SEMTAG=semtag

CHANGELOG_FILE = CHANGELOG.md

scope ?= "minor"

changelog_unrelease:
	git-chglog --no-case -o $(CHANGELOG_FILE)

changelog:
	git-chglog --no-case -o $(CHANGELOG_FILE) --next-tag `$(SEMTAG) final -s $(scope) -o -f`

changelog_latest:
	git-chglog --no-case -o $(CHANGELOG_FILE) `$(SEMTAG) getlast`

release:
	$(SEMTAG) final -s $(scope)

bump_latest:
	npm version `$(SEMTAG) final -s $(scope) -o -f` --force

