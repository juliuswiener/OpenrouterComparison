# OpenRouter Models Dashboard

A comprehensive dashboard for browsing and comparing AI models available on OpenRouter.

## Features

- 📊 Browse all OpenRouter models with detailed information
- 🔍 Search and filter by model name, modality, reasoning support, and pricing
- 💰 View pricing information (input/output tokens)
- ⚡ Performance metrics (latency, throughput)
- 🎯 Sort by various criteria
- 📥 Export to CSV
- 💾 Automatic caching to localStorage
- 🔄 Refresh performance stats on demand

## Usage

Simply open `index.html` in a web browser. The app will:
1. Load the list of available models from OpenRouter API
2. Display them in an interactive table
3. **Automatically fetch detailed performance metrics** (on first visit)
4. Cache the data locally in localStorage for instant loads on subsequent visits
5. Click "Refresh All Stats" to update the cached data

## Tech Stack

- React 18
- Tailwind CSS
- Lucide icons
- Vanilla HTML/JavaScript (no build step required)

## Development

No build process needed! Just open `index.html` in your browser.

For local development with live reload, you can use:
```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`
