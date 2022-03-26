.PHONY: changelog-unrelease changelog changelog-latest release

SEMTAG=semtag

CHANGELOG_FILE = CHANGELOG.md

scope ?= "minor"

changelog_unrelease:
	git-chglog --no-case -o $(CHANGELOG_FILE)

changelog_next:
	git-chglog --no-case -o $(CHANGELOG_FILE) --next-tag `$(SEMTAG) final -s $(scope) -o -f`

changelog_latest:
	git-chglog --no-case -o $(CHANGELOG_FILE) `$(SEMTAG) getlast`

release:
	$(SEMTAG) final -s $(scope)

bump_next_version:
	npm version `$(SEMTAG) final -s $(scope) -o -f` --no-git-tag-version --allow-same-version

