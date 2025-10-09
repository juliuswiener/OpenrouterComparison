#!/usr/bin/env python3
"""
Simple Flask proxy server to bypass CORS restrictions for OpenRouter API
"""

from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import requests
import os

app = Flask(__name__, static_folder='.')
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

@app.route('/api/models')
def get_models():
    """Proxy for OpenRouter models API"""
    try:
        response = requests.get('https://openrouter.ai/api/v1/models')
        return jsonify(response.json())
    except Exception as e:
        return jsonify({'error': str(e)}), 500

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

if __name__ == '__main__':
    print("🚀 Starting OpenRouter Dashboard Server...")
    print("📊 Dashboard available at: http://localhost:5000")
    print("Press Ctrl+C to stop")
    app.run(host='0.0.0.0', port=5000, debug=True)
