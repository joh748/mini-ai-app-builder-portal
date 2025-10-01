# AI assisted UI Builder

A dynamic React component that generates, orders, and manages UI elements (e.g., forms, menus) with drag-and-drop support.

This project uses **[@dnd-kit](https://docs.dndkit.com/)** for drag-and-drop functionality, and supports custom component ordering defined by a configuration list.

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-19.1.1-61DAFB?logo=react&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4.17-38B2AC?logo=tailwind-css&logoColor=white)
![DnD Kit](https://img.shields.io/badge/DnD%20Kit-10.0.0-000000?logo=react&logoColor=white)


### Backend
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-5.1.0-000000?logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)
![Google GenAI](https://img.shields.io/badge/Google%20GenAI-1.21.0-4285F4?logo=google&logoColor=white)


### Tooling
![Nodemon](https://img.shields.io/badge/Nodemon-3.1.10-76D04B?logo=nodemon&logoColor=white)



---

## ✨ Features

* **Dynamic UI generation**: Components are rendered based on configuration (`uiElements`).
* **Custom ordering**: UI elements are sorted according to a predefined `ORDER` list. Unknown components are appended at the end.
* **Drag & drop**: Reorder components interactively using mouse.
* **Entity expansion**: Automatically expands `EntitiesForm` for all provided entities.
* **Extensible**: Easily add new components to the `COMPONENT_MAP`.

---

## 📸 Screenshots & Demo

### Default Layout (Auto-Sorted)

![extracted requirements screenshot](./docs/screenshots/requirements.png)

### Example GIF Demo
![Example Usage GIF demo](./docs/screenshots/basic_layout.gif)

---

## 📦 Installation

Clone the repo and install dependencies for both **client** and **server**.

```bash
git clone <your-repo-url>
cd <your-project-root>
```

### 🔹 Client Setup (React Frontend)

```bash
cd src/client
npm install
npm start
```

* Runs the client at [http://localhost:3000](http://localhost:3000).
* React app with drag-and-drop UI builder.

### 🔹 Server Setup (Express Backend)

```bash
cd src/server
npm install
dotenvx run -- npm run dev
```

* Runs the backend at [http://localhost:5000](http://localhost:5000).
* Uses **dotenvx** to load environment variables.

---

## 🛠 Development Workflow

* Run **client and server in parallel** (in two terminals).
* Client proxies requests to the server (configure in `src/client/package.json` if needed).
* Update `.env` files for API keys, database URLs, etc.

---

## 🚀 Usage

```jsx
import GeneratedUI from "./components/GeneratedUI";

const uiElements = [
  { type: "RolesMenu" },
  { type: "EntitiesForm" },
  { type: "CustomWidget", props: { title: "Extra Widget" } },
];

const entities = [
  { name: "User", fields: [{ name: "email", type: "string" }] },
  { name: "Project", fields: [{ name: "title", type: "string" }] },
];

const roles = ["Admin", "Editor", "Viewer"];

export default function App() {
  return (
    <GeneratedUI
      appName="MyApp"
      uiElements={uiElements}
      entities={entities}
      roles={roles}
      editable={true}
      onUpdateRoles={(updatedRoles) => console.log(updatedRoles)}
      onUpdateEntityFields={(entity, fields) =>
        console.log("Updated", entity, fields)
      }
    />
  );
}
```

---

## 📐 Ordering

The rendering order of components is defined by the `ORDER` list:

```js
const ORDER = [
  "RolesMenu",
  "EntitiesForm",
];
```

* Elements in `ORDER` appear first, in sequence.
* Unknown elements are appended after ordered ones, keeping their relative order.

---

## 🎮 Drag & Drop

* **Mouse**: Click and drag to reorder.

---

## 📜 License

MIT License. Free to use and modify.


---

## 🚧 Current Limitations & Future Plans

### Current Limitations

* **Manual edits not persisted**: When requirements are edited manually, they only update the frontend and are not saved to MongoDB.
* **Partial UI generation**: The generated UI is limited to a few components (e.g., `RolesMenu`, `EntitiesForm`).
* **Drag & drop / color picker are frontend-only**: Reordering elements or changing colors does not update the backend yet.
* **Gemini integration is basic**: Currently, only prompts and simple chat-based updates are supported.

### Future Plans

* **Low–Medium Fidelity UI Design Generation**

  * Based on user prompts, automatically generate a low-to-medium fidelity UI mockup.
  * Explore an **open-source UI library** for consistent components.
  * Create a translation function to map Gemini API `uiElements` → actual UI library components.

* **Community-driven UI Marketplace**

  * Build a marketplace where creaters can **upload custom UI elements**.
  * When Gemini API suggests a component, recommend relevant UI elements from the community.
  * Allow remixing and sharing of UI elements across projects.

* **Persistence & Collaboration**

  * Save manual requirement edits to MongoDB for consistency.
  * Enable team collaboration: multiple users can refine requirements and UI together in real-time.

* **Advanced UI Customization**

  * Theme editor with color palettes and typography settings.
  * Support for different fidelity levels: **wireframe → prototype → polished UI**.


---

## 📂 Project Structure

```
src/
├── client/               # React frontend
│   ├── App.jsx           # Root React component
│   ├── components/       # Reusable UI components
│   ├── pages/            # Page-level views
│   ├── styles/           # CSS modules & global styles
│
└── server/               # Express backend
    ├── server.js         # Entry point for backend
    ├── controllers/      # Route handler logic
    ├── models/           # Database schemas
    ├── routes/           # API route definitions
```


---

## 🔄 High-Level Flow

```mermaid
sequenceDiagram
    participant U as User
    participant C as Client (React)
    participant S as Server (Express)
    participant DB as MongoDB
    participant AI as Gemini API

    U->>C: Prompt app description
    C->>S: Send prompt request
    S->>AI: Call Gemini API with prompt
    AI-->>S: Return requirements
    S->>DB: Save requirements
    S-->>C: Return requirements + UI elements
    C-->>U: Display captured requirements and UI

    U->>C: Edit requirements (manual)
    C-->>U: Update frontend only (not persisted)

    U->>C: Chat edit with Gemini
    C->>S: Send chat request
    S->>AI: Call Gemini with chat context
    AI-->>S: Return updated requirements
    S->>DB: Save updated requirements
    S-->>C: Return new requirements + UI
    C-->>U: Show updated requirements

    U->>C: Interact with UI (drag, color picker)
    C-->>U: Update visual elements (frontend only)
```

---