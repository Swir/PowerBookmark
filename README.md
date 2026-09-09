<div align="center">

# 🔖 PowerBookmark

### Advanced Chrome Bookmarklet & Page-Tool Manager

**Manifest V3 • JavaScript • Custom Scripts • Element Tools • Backup & Restore**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B-F7DF1E?logo=javascript&logoColor=black)
![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest](https://img.shields.io/badge/Manifest-V3-success)
![UI](https://img.shields.io/badge/UI-Dark%20Cyber-111111)
![Author](https://img.shields.io/badge/Author-Swir-8A2BE2)

</div>

---

## Po polsku — menedżer skryptów JavaScript do Chrome

**PowerBookmark** to rozszerzenie Chrome/Chromium do porządkowania własnych skryptów JavaScript i narzędzi działających na stronach. Pozwala przypisywać skrypty do domen, włączać je i wyłączać oraz eksportować konfigurację do JSON. Interfejs rozszerzenia jest po polsku.

**Uruchomienie:** pobierz repozytorium, otwórz `chrome://extensions`, włącz tryb programisty i wybierz **Załaduj rozpakowane**. Wskaż folder zawierający `manifest.json`.

Szukasz narzędzia do konkretnego czatu? Zobacz [XBookmark dla CZATerii](https://github.com/Swir/XBookmark#readme). [Więcej programów SWIR →](https://github.com/Swir#readme)

---

## 🚀 About

**PowerBookmark** is a Chrome/Chromium extension for managing reusable JavaScript snippets, bookmarklet-style workflows and page interaction tools from one compact popup.

Instead of keeping useful snippets in random text files or browser bookmarks, PowerBookmark lets you organize them by name and domain, enable or disable them, edit them and keep a JSON backup.

It is aimed at users searching for a **bookmarklet manager**, **JavaScript snippet manager**, **Chrome productivity extension**, **Manifest V3 developer tool**, **custom page script manager** or a lightweight browser toolbox.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧩 Script manager | Store reusable JavaScript snippets |
| 🌐 Domain targeting | Assign scripts to specific domains or all sites |
| 🎚️ Enable / disable | Toggle individual scripts without deleting them |
| ✏️ Edit tools | Rename and modify saved scripts |
| 🎯 Element tools | Includes page-element inspection / targeting workflow |
| 🔍 Code analysis tools | Utilities for working with page code and UI |
| 💾 JSON backup | Export your saved configuration |
| 🗃️ Local storage | Settings are stored by the browser extension |
| 🛡️ Manifest V3 | Built for the current Chrome extension model |
| 🌙 Dark UI | Compact cyber-style popup interface |

---

## 📦 Installation

1. Clone or download this repository.
2. Open Chrome or Chromium.
3. Go to **Extensions**.
4. Enable **Developer mode**.
5. Click **Load unpacked**.
6. Select the `PowerBookmark` folder.

Repository clone:

```bash
git clone https://github.com/Swir/PowerBookmark.git
```

---

## 🧩 Project Structure

```text
PowerBookmark/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── icon.png
└── README.md
```

---

## 🔐 Browser Permissions

PowerBookmark uses extension permissions such as `storage`, `activeTab` and `scripting` because its tools need to save configuration and interact with the current page.

Only run custom JavaScript you understand and trust. Scripts execute in the context of pages you visit and can affect page content and behavior.

---

## 🌍 Language

The current popup interface is Polish. An English application variant is planned as a separate build so the original Polish version remains available without changing its behavior.

---

## 🔍 Discoverability

`bookmarklet manager` • `javascript snippet manager` • `chrome script manager` • `manifest v3 extension` • `browser productivity extension` • `custom javascript extension` • `page script manager` • `chrome developer tool` • `bookmark manager chrome` • `content script tools`

---

## 🤝 Contributing

Bug reports and improvements are welcome. When proposing a feature, include the browser version and a short description of the expected behavior.

---

## 👨‍💻 Author

Developed by **Swir** — [@Swir](https://github.com/Swir)

<div align="center">

### 🔖 Turn useful JavaScript snippets into reusable browser tools

⭐ **Star the repository if PowerBookmark helps your workflow!**

</div>
