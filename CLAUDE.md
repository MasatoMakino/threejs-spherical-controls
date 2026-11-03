# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Runtime environment

The library runs in browsers, bundled with Three.js. Node.js execution is out of scope. When you add a dependency for development or testing, add it as a development dependency (`pnpm add -D`).

## DevContainer

Run `pnpm` and `node` only inside the DevContainer, through `devcontainer exec --workspace-folder .`. Do not run them on the host. The container has no Git, so run Git on the host.

The pre-commit hook formats staged files with Biome in the container and stages them again. For a partially staged file, the hook stages the whole file, including unstaged changes.
