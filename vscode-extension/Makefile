.DEFAULT_GOAL := help

.PHONY: dev
dev: ## Start development.
	npm link @hackage-ui/react-lib
	npm run dev

.PHONY: build
build: ## Build the project.
	cd ../react-lib && make build && npm link
	npm link @hackage-ui/react-lib
	npm i
	npm run build

.PHONY: help
help:
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'
