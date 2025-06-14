# 🎨 Tattoo Studio Generator

**Tattoo Studio** is a modern web app that uses AI to generate tattoo designs based on user prompts. Whether you're a tattoo artist, designer, or Second Life content creator, this tool gives you fast, clean, background-free tattoo art you can visualize, layer, and export.

---

## ✨ Features

- ✍️ Prompt-to-image generation using **Stable Diffusion**
- 🪄 Automatic background removal via **Rembg**
- 🧠 Smart preview-ready PNG output (transparent background)
- 📍 Body part placement selector (e.g. upper arm, chest)
- 💡 Future support for **UV mapping**, **mannequin placement**, and **layer management**

---

## 🚀 Setup Instructions

### 🔧 Prerequisites

- Node.js **v18+**
- A [**Replicate API Token**](https://replicate.com/account/api-tokens)
- Git installed

---

### 📁 1. Clone the Repository

```bash
git clone
cd tattoo-studio/tattoo-gen-app
```

---

### 📦 2. Install Dependencies

```bash
npm install
```

---

### ⚙️ 3. Add Your Replicate API Key

Create a `.env` file in the root of the `tattoo-gen-app/` folder:

```
VITE_REPLICATE_API_TOKEN=r8_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

> ⚠️ Do **not** wrap the token in quotes.

---

## 💠 Running the App

### 🧠 Backend Server (Node.js)

```bash
node server/index.js
# → http://localhost:3001
```

### 🌐 Frontend (Vite + Vue)

In a separate terminal:

```bash
npm run dev
# → http://localhost:5173
```

---

## 🧪 Example Prompts

| Prompt                                            | Result                               |
| ------------------------------------------------- | ------------------------------------ |
| `Tribal dragon wrapping around upper arm`         | Curled, aggressive tribal design     |
| `Bunny rabbit wrapped around the upper arm`       | Soft, wrap-around style illustration |
| `Ornate mandala back tattoo with geometric lines` | Detailed symmetrical mandala art     |

---

## 🗂️ Project Structure

```
tattoo-gen-app/
├── server/                 → Node backend for Replicate API
├── src/                   → Vue 3 app (frontend)
│   ├── components/
│   └── views/
├── public/
├── .env                   → Your API key goes here
├── vite.config.js
└── README.md
```

---

## 📍 Tech Stack

- **Vue 3** + **Vite** + **Vuetify** (frontend)
- **Node.js** + **Express** + **dotenv** (backend)
- **Replicate API** (AI model inference)
- **Stable Diffusion** for image generation
- **Rembg** for transparent PNG cleanup

---

## 🔮 Roadmap (Planned Features)

-

---

## 🙌 Credits

- [Replicate](https://replicate.com/) – AI inference & model hosting
- [cjwbw/rembg](https://replicate.com/cjwbw/rembg) – Background remover
- [Stability AI - Stable Diffusion](https://replicate.com/stability-ai/stable-diffusion) – Image generation
- App development: [@YourUsername]

---


