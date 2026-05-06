# Contributing to EndGit Web

First off, thank you for considering contributing to EndGit Web! It's people like you that make EndGit such a great tool for the Endstone community.

## Development Setup

1. Fork the repo and create your branch from `main`.
2. Install dependencies using `pnpm install` (this project uses pnpm, not npm or yarn).
3. Set up your environment variables by copying `.env.example` to `.env`.
4. Run the development server with `pnpm dev`.
5. The application will be available at `http://localhost:3000`.

## Code Style & Linting

1. Your code should follow the existing style. We use ESLint and Next.js default config.
2. Ensure you run `pnpm run lint` before submitting a pull request to catch any stylistic errors.
3. Use meaningful commit messages.

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, if applicable.
3. You may merge the Pull Request in once you have the sign-off of at least one other developer, or if you do not have permission to do that, you may request the reviewer to merge it for you.

## Reporting Bugs

Bugs are tracked as GitHub issues. When creating an issue, please provide as much information as possible, including your environment and steps to reproduce. Check if the issue already exists before opening a new one.

## Feature Requests

Feature requests are welcome. Please open an issue to discuss your idea before submitting a pull request to ensure it aligns with the project's goals and architecture.
