# EndGit Web

[![CI](https://github.com/two-tech-dev/endgit-web/actions/workflows/ci.yml/badge.svg)](https://github.com/two-tech-dev/endgit-web/actions/workflows/ci.yml)
[![Code Quality](https://github.com/two-tech-dev/endgit-web/actions/workflows/code-quality.yml/badge.svg)](https://github.com/two-tech-dev/endgit-web/actions/workflows/code-quality.yml)

**Next.js Web Dashboard for the EndGit Plugin Marketplace**

The web frontend for [EndGit](https://endgit.dev) — providing a modern dashboard for browsing, managing, and distributing Endstone plugins.

## Features

- 🎨 **Dark/Light Mode** — Modern UI with theme toggle  
- 📦 **Plugin Marketplace** — Browse, search, and filter plugins
- ⭐ **Ratings & Reviews** — Community feedback system
- 📊 **Analytics Dashboard** — Download stats

## Quick Start

```bash
# Clone
git clone https://github.com/two-tech-dev/endgit-web.git
cd endgit-web

# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your settings

# Start development server
pnpm dev
```

The web app will be available at `http://localhost:3000`.

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
