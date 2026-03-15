# 💬 Mention Editor

A React component that implements **@mentions** autocomplete inside a textarea, similar to the behavior in social media or chat applications.

When a user types **@**, a dropdown list of users appears.

Users can navigate the list with the keyboard or mouse and insert a mention into the text.

## ✨ Features

- Autocomplete triggered by @

- Keyboard navigation (↑ ↓ Enter)

- Mouse selection

- Dropdown positioned near the caret

- Closes when clicking outside



## 🛠 Technologies

- React

- TypeScript

- SCSS

## ⚙️ Installation

Clone the repository:
```
git clone <repo-url>
cd <project>
```
Install dependencies:
```
npm install
```
Run the project:
```
npm run dev
```

## 🪞 How it works

 
To position the dropdown correctly, the caret coordinates are calculated using a **mirror element technique**, which replicates the textarea content in a hidden div and measures the caret position in the DOM.