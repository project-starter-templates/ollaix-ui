# Ollaix – Your Smart Virtual Assistant 🤖

An intelligent virtual assistant designed to answer your questions and help you with your daily tasks.
**Ollaix** is a modern chatbot-style web interface built with React, TypeScript, Vite, Tailwind CSS, and DaisyUI. Inspired by the ChatGPT user experience, this app enables users to interact with a smart assistant through a clean, responsive, simple, fast and user-friendly.

---

## Demo 🚀

Experience Ollaix live here: [https://ollaix.macktireh.dev](https://ollaix.macktireh.dev)

---

## Features ✨

- 🗣️ **Interactive Chat:** Seamless conversations with a smart AI assistant.
- 💡 **Multiple AI Models:** Choose from various LLM models to tailor your interaction (e.g., Qwen3 4b, Deepseek R1 7b).
- 🔄 **Real-time Streaming:** Enjoy a responsive experience with real-time AI response streaming.
- 🌙 **Theme Switching:** Toggle between light and dark modes for comfortable viewing.
- 📋 **Code Highlighting:** Markdown code blocks are beautifully highlighted for readability.
- ✂️ **Copy Functionality:** Easily copy AI responses or code snippets to your clipboard.
- 🛑 **Stop Generation:** Option to interrupt ongoing AI responses.
- 🌐 **Multilingual Support:** Supports English and French.

---

## Tech Stack 🛠️

Ollaix is built with a modern and robust set of technologies:

- ⚛️ **React 19:** A declarative, component-based JavaScript library for building user interfaces.
- ⚡ **Vite:** A fast build tool that provides a lightning-fast development experience.
- 💨 **Tailwind CSS:** A utility-first CSS framework for rapidly building custom designs.
- 💅 **DaisyUI:** A Tailwind CSS component library that simplifies UI development.
- 📚 **TypeScript:** A typed superset of JavaScript that compiles to plain JavaScript.
- 🌍 **i18next & react-i18next:** Internationalization framework for adding multi-language support.
- 📝 **react-markdown & remark-gfm:** For rendering Markdown content with GitHub Flavored Markdown support.
- 🎨 **react-syntax-highlighter:** For syntax highlighting code blocks.
- Icons by [Lucide React](https://lucide.dev/icons/)

---

## Getting Started 🚀

Follow these steps to get Ollaix up and running on your local machine.

### Prerequisites ✅

Before you begin, ensure you have the following installed:

- **Node.js:** (LTS version recommended)
- **npm** or **Yarn:** (npm comes with Node.js)

### Installation 💻

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Macktireh/ollaix-ui.git
    cd ollaix-ui
    ```

2.  **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Variables:**

    Create a `.env` file in the root of the project by copying `.env.example`:

    ```bash
    cp .env.example .env
    ```

    Open `.env` and set the `VITE_API_BASE_URL` to your backend API endpoint. For local development, it will likely be:

    ```
    VITE_API_BASE_URL=http://localhost:8000
    ```

    > ⚠️ **Note:** This frontend requires a backend API to function. Ensure your backend is running and accessible at the specified `VITE_API_BASE_URL`.

4.  **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

    The application will be available at `http://localhost:3000` (or another port if 3000 is occupied).

---

## License 📄

This project is licensed under the MIT License - see the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

---

## Acknowledgments 🙏

- Special thanks to the open-source community for providing excellent tools and libraries that made this project possible.
