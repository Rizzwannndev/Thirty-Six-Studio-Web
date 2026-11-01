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
  App.jsx          page composition
  content.js       site copy (services, concept projects, process, contact)
  data.js          canvas layouts · canvasImages.js  pepper frame URLs
  context/         SiteProvider: Locomotive Scroll, flood + menu state
  lib/             GSAP setup, frame cache, camera-pepper state
  components/      SequenceCanvas, CameraPepper, FloodLayer, Header, Menu, Cursor
  sections/        Hero, Manifesto, Services, Work, Process, Playground, Contact, Footer
```

See `UPGRADE_DOCUMENTATION.md` for how everything works.

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

Click the giant "Thirtysixstudios" name to flood the page red and bring the pepper canvases to life. One pepper then follows you down the page. In the Playground you can turn it by hand.

## 📝 Contributing

1. Fork the repository
2. Create a new feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

Please follow the existing code style and run the linter before submitting.

## 📄 License

This project is open source.


