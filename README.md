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

### Option 1: With Python Proxy Server (Recommended)

This method allows you to fetch **full performance stats** including latency and throughput:

```bash
# Install dependencies
pip install -r requirements.txt

# Start the server
python3 server.py
```

Then visit `http://localhost:5000`

The app will:
1. Load the list of available models from OpenRouter API
2. **Automatically fetch detailed performance metrics** (latency, throughput)
3. Cache the data locally in localStorage for instant loads on subsequent visits
4. Click "Refresh All Stats" to update the cached data

### Option 2: Direct File Access (Limited)

You can open `index.html` directly in your browser, but:
- ⚠️ Performance stats (latency/throughput) will NOT be available due to CORS restrictions
- Only basic model information will be displayed (pricing, context length, features)

## Why a Proxy Server?

The OpenRouter stats API has CORS restrictions that prevent browser requests from file:// or external domains. The Python proxy server bypasses this by making requests from the backend.

## Tech Stack

- React 18
- Tailwind CSS
- Python Flask (proxy server)
- Inline SVG icons
- Vanilla HTML/JavaScript (no build step required)
