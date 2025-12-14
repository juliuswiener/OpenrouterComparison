# Gemini Code Assistant Context

## Project Overview

This project is a web-based dashboard for browsing and comparing AI models available on OpenRouter. It provides a user interface to search, filter, and sort models based on various criteria like pricing, performance metrics, and supported features.

The project consists of a Python Flask backend that serves as a proxy to the OpenRouter API to bypass CORS limitations. The frontend is built with vanilla HTML, JavaScript, and Tailwind CSS, without any build step.

An optional feature allows scraping and displaying data from the Artificial Analysis leaderboard.

**Key Technologies:**

*   **Backend:** Python, Flask, Flask-CORS, Requests, BeautifulSoup4, lxml
*   **Frontend:** HTML, JavaScript, Tailwind CSS
*   **Data Source:** OpenRouter API, Artificial Analysis (optional)

## Building and Running

1.  **Install Dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

2.  **Run the Server:**

    ```bash
    python3 server.py
    ```

3.  **Access the Dashboard:**

    Open a web browser and navigate to `http://localhost:5000`.

## Development Conventions

*   **Backend:** The backend is a simple Flask application. New API endpoints can be added to `server.py`.
*   **Frontend:** The frontend is a single `index.html` file. All JavaScript and CSS are included directly in the HTML file. There is no package manager or build process for the frontend.
*   **Leaderboard Integration:** The `aa_leaderboard.py` script is responsible for scraping the Artificial Analysis leaderboard. It is called by the `/api/aa/leaderboard` endpoint in `server.py`.
*   **Error Handling:** The server includes basic error handling for API requests.
