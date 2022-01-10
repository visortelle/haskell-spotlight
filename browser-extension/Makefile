.DEFAULT_GOAL := help

.PHONY: dev
dev: ## Start development.
	npm start

.PHONY: build
build: ## Build the project.
	cd ../hackage-ui && npm run build
	npm ci
	npm run build
	# xcrun safari-web-extension-converter --project-location ./build/safari ./build

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' && echo "\nNOTE: You can find Makefile goals implementation stored in \"./build\" directory"
