# GhatGPT - A ChatGPT-like Web Application

Welcome to GhatGPT! This is a web-based chat application built with React that mimics the core functionality of OpenAI's ChatGPT. It features a clean, modern interface with both dark and light modes, allowing users to have interactive conversations with an AI backend.

## Features

*   **Interactive Chat Interface**: Send messages and receive real-time responses from the AI.
*   **Dark & Light Mode**: Easily toggle between a dark theme (default) and a light theme for your viewing comfort.
*   **New Chat**: Start a fresh conversation at any time with the "New Chat" button.
*   **Quick Queries**: Use predefined buttons to quickly ask common questions like "What is Programming?".
*   **Save Conversation**: Download the AI's responses from your current session as a `.txt` file.
*   **Upgrade to Pro**: A fully styled modal window demonstrates a subscription flow, complete with mock payment options for Mobile Money, Visa, and PayPal.
*   **Loading & Error States**: The UI provides clear feedback when the AI is processing a request or if there's an issue connecting to the backend.

## Getting Started

To get this project running on your local machine, follow these simple steps.

### Prerequisites

*   [Node.js](https://nodejs.org/) (which includes npm) installed on your computer.
*   A running instance of the backend server this application connects to.

### Installation & Setup

1.  **Clone the repository** (or download the source code).

2.  **Navigate to the project directory**:
    ```bash
    cd vite_project
    ```

3.  **Install dependencies**:
    This command will install all the necessary packages for the React application.
    ```bash
    npm install
    ```

4.  **Run the Backend Server**:
    Before starting the frontend, make sure your backend server (which handles requests to `/api/chat`) is running on `http://localhost:5000`.

5.  **Run the Frontend Application**:
    This command starts the Vite development server.
    ```bash
    npm run dev
    ```

6.  **Open the App**:
    Open your web browser and go to the URL provided by Vite (usually `http://localhost:5173` or a similar address).

## How to Use the App

*   **Sending a Message**: Type your message in the input box at the bottom and press Enter or click the send button.
*   **Starting a New Chat**: Click the `+ New Chat` button in the sidebar to clear the current conversation.
*   **Saving a Chat**: Click the `Saved` button in the sidebar to download a text file of the AI's responses.
*   **Upgrading**: Click `Upgrade To Pro` to see the subscription payment modal.
*   **Changing Themes**: Click `Light Mode` or `Dark Mode` at the bottom of the sidebar to switch the UI theme.