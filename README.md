# 🥁 Drum Machine

A responsive, interactive, and customizable web-based **Drum Machine** built with React. Users can create, play, save, load, and randomize beat patterns using a visual step sequencer.

## 🎛️ Features

- 🎵 Realistic drum sounds (hi-hat, snare, kick, crash, clap, tom)
- 🧱 2D grid-based beat sequencer with intuitive UI
- 🔊 Adjustable **BPM (Beats Per Minute)** and **Beat Count**
- 💾 Save and load beat configurations (as `.json`)
- 🧹 Clear beat grid with confirmation modal
- 🎲 Generate random beats with a single click
- ⌨️ Keyboard shortcuts for power users
- 🧠 Visual indicators:
  - **Selected (light green):** cells marked by user
  - **Current (yellow):** active beat column
  - **Playing (dark green):** selected + current
  - **Disabled (gray):** muted instruments
  - **Unselected:** empty grid cells

---

## 🚀 Quick Start

### 1. Clone the Repo

```bash
git clone https://github.com/lokeshagg13/Drum-Machine.git
cd Drum-Machine
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the App

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 🧩 File Structure

```
Drum Machine/
├── public/
│   ├── sounds/                 
│   ├── tailwind.css
│   └── index.html
├── src/
│   ├── components/             # All UI components
│   │   ├── modals/             
│   │   ├── instruments/        
│   │   ├── ui/                 
│   ├── store/                  
│   ├── images/                 
│   ├── App.jsx
│   └── index.jsx
└── README.md
```

---

## 🎚️ Keyboard Shortcuts

| Action         | Shortcut                   |
| -------------- | -------------------------- |
| Play / Pause   | `Spacebar`                 |
| Increase BPM   | `Ctrl/Cmd` + `Shift` + `+` |
| Decrease BPM   | `Ctrl/Cmd` + `Shift` + `-` |
| Increase Beats | `Ctrl/Cmd` + `Alt` + `+`   |
| Decrease Beats | `Ctrl/Cmd` + `Alt` + `-`   |

---

## 📁 Save Format

Saved beats are exported as JSON with structure:

```json
{
  "name": "my_first_beat",
  "bpm": 180,
  "numberOfBeats": 16,
  "numberOfInstruments": 6,
  "instruments": [...],
  "currentGrid": [...]
}
```

---

## 📦 Built With

* [React](https://reactjs.org/)
* [React-Bootstrap](https://react-bootstrap.github.io/) – Tooltip & overlay
* [Tailwind CSS](https://tailwindcss.com/) – Utility-first styling
* \[Custom Hooks & Context API] – State management

---

## 🧪 Future Enhancements

* 🔁 Loop region selection
* 📱 Mobile beat grid optimization
* 🎧 Additional drum kits / sample packs
* ⏺️ Live recording of beat loops

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---

## 🌟 Acknowledgments

- 🙏 Inspired by this [youtube video](https://www.youtube.com/watch?v=F3J3PZj0zi0&t=1s)

Thank You