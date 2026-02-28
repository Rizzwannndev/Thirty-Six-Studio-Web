# Thirty Six Studios Web

![Site Snapshot](public/snapshot.PNG)

A modern React-based web application for Thirty Six Studios. This project uses Vite as the build tool and bundler, with a clean and responsive canvas-driven interface.

## 🚀 Features

- **Interactive canvas** built with React and HTML5 canvas
- Custom cursor component and image assets
- Lightweight setup with Vite for fast development and build times
- Modular structure: components, assets, and utilities separated

## 🧱 Project Structure

```
src/
  ├── App.jsx            # Root component
  ├── Canvas.jsx         # Canvas rendering logic
  ├── canvasImages.js    # Image asset definitions
  ├── data.js            # Data helpers and content
  ├── index.css          # Global styles
  ├── main.jsx           # Application entry point
  └── Components/
      └── Cursor.jsx     # Custom cursor component

vite.config.js
package.json
eslint.config.js
index.html
```

## 🛠 Installation

1. Clone the repository:
   ```bash
   git clone <repository-url> "Thirty Six Studios Web"
   cd "Thirty Six Studios Web"
   ```

2. Install dependencies with npm or yarn:
   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser to `http://localhost:5173` (or the address shown in the terminal).

## ⚙️ Available Scripts

- `npm run dev` – Start the development server
- `npm run build` – Build the app for production
- `npm run preview` – Preview the production build locally
- `npm run lint` – Run ESLint checks

## 📦 Dependencies

- React
- React DOM
- Vite
- (Any other dependencies from package.json)

## ✅ Usage

The application renders a canvas component that displays interactive graphics defined in `canvasImages.js` and controlled via `data.js`. A custom cursor is provided in `Components/Cursor.jsx`.

## 📝 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

Please follow the existing code style and run the linter before submitting.

## 📄 License

This project is open source.


