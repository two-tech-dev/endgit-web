# EndGit Web

**Next.js Web Dashboard for the EndGit Plugin Marketplace**

The web frontend for [EndGit](https://github.com/two-tech-dev/endgit-core) — providing a modern dashboard for browsing, managing, and distributing Endstone plugins.

## Features

- 🎨 **Dark/Light Mode** — Modern UI with theme toggle
- 📦 **Plugin Marketplace** — Browse, search, and filter plugins
- 🔄 **Live Build Logs** — Real-time streaming build output
- ⭐ **Ratings & Reviews** — Community feedback system
- 📊 **Analytics Dashboard** — Download stats and trends
- 👤 **GitHub OAuth** — One-click sign in
- 📱 **Responsive Design** — Works on desktop and mobile

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

> **Note:** Requires [endgit-core](https://github.com/two-tech-dev/endgit-core) API running on `http://localhost:4000`.

The web app will be available at `http://localhost:3000`.

## Related Repositories

| Repository | Description |
|------------|-------------|
| [endgit-core](https://github.com/two-tech-dev/endgit-core) | Backend API server |
| [endgit-worker](https://github.com/two-tech-dev/endgit-worker) | Build worker |
| [endgit-cli](https://github.com/two-tech-dev/endgit-cli) | CLI tool |

## License

This project is licensed under the [GNU Affero General Public License v3.0](LICENSE).
