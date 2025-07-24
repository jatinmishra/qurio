# <img width="28" height="28" alt="logo" src="https://github.com/user-attachments/assets/31fc4b4a-f139-43a4-99aa-885e12df5ea0" /> Qurio

An interactive, topic-based quiz platform built with **React**, **TypeScript**, and **Vite**. It’s designed to help developers improve their knowledge across a variety of engineering topics.

---

## 📦 Features

- 📚 JSON-based topic structure (easy to extend)
- 🧠 Instant feedback with detailed explanations
- 🔁 Question levels for progressive learning

---

## ⚙️ Requirements

Before running the project, ensure you have the following installed:

- **Node.js** — v18 or higher recommended  
- **npm** — v9 or higher recommended  

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/jatinmishra/qurio.git
cd qurio
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npm run dev
```

Open your browser and visit: [http://localhost:8080/qurio](http://localhost:8080/qurio) (or the URL displayed on the terminal)
<img width="697" height="483" alt="image" src="https://github.com/user-attachments/assets/9f8ea6bd-0e3c-43c4-8b48-5dfe5cb7668b" />


---

## 🗂 Project Structure

Here's a breakdown of key folders inside the `src/` directory:

```bash
src/
├── topics/                # JSON files for quiz topics and questions
├── components/            # Reusable UI components
├── pages/                 # Pages like Home, Topic, Quiz
├── contexts/              # React contexts for global state
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions (shuffle, validate, etc.)
```

---

## 🧩 How to Add a New Topic or Question Set

You can easily add your own quiz topic by following the steps below.

### 1. Create a JSON File

Add a new file inside `src/topics/` — for example: `typescript.json`.

Use the structure below:

```json
{
  "id": "typescript",
  "title": "TypeScript",
  "description": "Strongly typed JavaScript at any scale.",
  "icon": "🟦",
  "tags": ["typescript", "javascript", "frontend"],
  "author": {
    "username": "username",
    "github": "https://github.com/username"
  },
  "levels": {
    "1": {
      "questions": [
        {
          "id": "ts1",
          "question": "What does the 'unknown' type mean in TypeScript?",
          "options": [
            "A variable of any type",
            "A variable whose type is not known yet",
            "A string type alias",
            "A dynamic object"
          ],
          "correctAnswer": 1,
          "explanation": "The 'unknown' type is a safer version of 'any' — it forces type checking before use."
        }
      ]
    }
  }
}
```

### 2. Guidelines

* `"id"` should be unique and lowercase
* `"title"` is the display name of the topic
* `"levels"` can be `"1"`, `"2"`, `"3"`, etc., each containing a `questions` array
* Each question object must contain:

  * `"id"`: Unique within the topic
  * `"question"`: The actual question text
  * `"options"`: Array of choices (minimum 2)
  * `"correctAnswer"`: Index of the correct option
  * `"explanation"`: Why the correct answer is right

---

## 🧪 Question Validation Checklist

Before committing your topic file:

✅ Ensure each question:

* Has **at least two** answer options
* Has a **valid `correctAnswer` index** within the options array
* Includes a **clear, helpful explanation**
* Contains **no typos** or syntax errors
* Uses **valid JSON** (validate with [jsonlint.com](https://jsonlint.com) if unsure)

---

## 🔄 No Code Changes Needed

You **do not need to register your topic manually**.

The app auto-imports all `.json` files in the `src/topics/` directory.

If the new file is valid and well-formed, it will automatically appear in the app after you restart the dev server:

```bash
npm run dev
```

---

## 🛠 Tech Stack

This app is powered by:

* **React 18**
* **TypeScript**
* **TailwindCSS**
* **Vite**
* JSON-driven content model (no backend)

---

## 📄 License

This project is open source and available under the **MIT License**.

Feel free to use, modify, and distribute it.

---

## 🙌 Contributions Welcome

We love contributions!

If you'd like to:

* Add a new topic
* Improve question quality
* Fix bugs or improve UI

Please submit a pull request or open an issue. Be sure to follow the validation checklist before contributing new JSON files.

Thanks for helping make learning fun and accessible!
