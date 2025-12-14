#!/usr/bin/env python3
"""
Simple Flask proxy server to bypass CORS restrictions for OpenRouter API
"""

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import re
import requests
import os
from datetime import datetime

# Optional: import AA leaderboard scraper
try:
    from aa_leaderboard import get_leaderboard_data
except Exception as e:
    get_leaderboard_data = None

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

def fetch_openrouter_models():
    """Helper to fetch models from OpenRouter API"""
    try:
        response = requests.get('https://openrouter.ai/api/v1/models')
        return response.json()
    except Exception as e:
        print(f"Error fetching OpenRouter models: {e}")
        return None

def normalize_model_name(name):
    """Normalize model name for matching (similar to aa_leaderboard.py)"""
    if not name:
        return ""
    norm = re.sub(r"\(.*?\)", "", name)
    norm = norm.replace("\u00a0", " ")
    norm = re.sub(r"[^a-zA-Z0-9]+", "-", norm.lower()).strip("-")
    return norm

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/models')
def get_models():
    """Proxy for OpenRouter models API"""
    data = fetch_openrouter_models()
    if data:
        return jsonify(data)
    return jsonify({'error': 'Failed to fetch models'}), 500

@app.route('/api/models/enriched')
def get_enriched_models():
    """Returns OpenRouter models enriched with AA leaderboard data"""
    # 1. Fetch OpenRouter models
    or_data = fetch_openrouter_models()
    if not or_data or 'data' not in or_data:
        return jsonify({'error': 'Failed to fetch OpenRouter models'}), 500
    
    models = or_data['data']
    
    # 2. Fetch AA Leaderboard data
    aa_data = {}
    if get_leaderboard_data:
        try:
            aa_result = get_leaderboard_data()
            rows = aa_result.get('rows', [])
            # Index AA rows by normalized name
            for row in rows:
                norm_name = row.get('_normalized_name')
                if norm_name:
                    aa_data[norm_name] = row
        except Exception as e:
            print(f"Warning: Failed to fetch AA data: {e}")

    # 3. Merge data
    enriched_models = []
    for model in models:
        # Create a copy of the model data
        enriched = model.copy()
        enriched['benchmarks'] = None
        
        # Add per-1M token pricing for convenience
        if 'pricing' in enriched:
            try:
                pricing = enriched['pricing']
                enriched['pricing_1m'] = {
                    'prompt': float(pricing.get('prompt', 0)) * 1_000_000,
                    'completion': float(pricing.get('completion', 0)) * 1_000_000,
                    'image': float(pricing.get('image', 0)) * 1_000_000,
                    'request': float(pricing.get('request', 0)) * 1_000_000,
                }
            except (ValueError, TypeError):
                enriched['pricing_1m'] = None

        if aa_data:
            # Try to find a match
            # Strategy 1: OpenRouter Name
            or_name = model.get('name', '')
            norm_or_name = normalize_model_name(or_name)
            
            # Strategy 2: OpenRouter ID (last part)
            or_id = model.get('id', '')
            or_id_slug = or_id.split('/')[-1] if '/' in or_id else or_id
            norm_or_id = normalize_model_name(or_id_slug)
            
            match = aa_data.get(norm_or_name) or aa_data.get(norm_or_id)
            
            if match:
                enriched['benchmarks'] = match
                
        enriched_models.append(enriched)

    return jsonify({'data': enriched_models})

@app.route('/api/stats')
def get_stats():
    """Proxy for OpenRouter stats API"""
    permaslug = request.args.get('permaslug')
    variant = request.args.get('variant', 'standard')

    if not permaslug:
        return jsonify({'error': 'permaslug parameter required'}), 400

    try:
        url = f'https://openrouter.ai/api/frontend/stats/endpoint?permaslug={permaslug}&variant={variant}'
        response = requests.get(url)
        # Return the response as-is to preserve error structure
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats/latency-e2e-comparison')
def get_latency_comparison():
    """Proxy for OpenRouter latency E2E comparison API"""
    permaslug = request.args.get('permaslug')

    if not permaslug:
        return jsonify({'error': 'permaslug parameter required'}), 400

    try:
        url = f'https://openrouter.ai/api/frontend/stats/latency-e2e-comparison?permaslug={permaslug}'
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/stats/throughput-comparison')
def get_throughput_comparison():
    """Proxy for OpenRouter throughput comparison API"""
    permaslug = request.args.get('permaslug')

    if not permaslug:
        return jsonify({'error': 'permaslug parameter required'}), 400

    try:
        url = f'https://openrouter.ai/api/frontend/stats/throughput-comparison?permaslug={permaslug}'
        response = requests.get(url)
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Routes for Artificial Analysis leaderboard (if available)
@app.route('/api/aa/leaderboard')
def aa_leaderboard():
    """Fetch and parse Artificial Analysis Models Leaderboard table.

    Returns JSON with headers, rows, markdown, and aa_index_map.
    """
    if get_leaderboard_data is None:
        return jsonify({
            'error': 'AA leaderboard module not available. Ensure dependencies are installed.'
        }), 500

    try:
        data = get_leaderboard_data()
        return jsonify({
            'aa_index_map': data.get('aa_index_map', {}),
            'headers': data.get('headers', []),
            'rows': data.get('rows', [])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 Starting OpenRouter Dashboard Server...")
    print("📊 Dashboard available at: http://localhost:5000")
    print("Press Ctrl+C to stop")
    app.run(host='0.0.0.0', port=5000, debug=True)
