<div align="center">

# 🔖 PowerBookmark

**Browser power-tool for bookmarks, page UI utilities and bookmarklet workflows**  
**Rozbudowane narzędzie przeglądarkowe do bookmarków, UI stron i bookmarkletów**

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript&logoColor=black)
![Chrome](https://img.shields.io/badge/Chrome-Extension-4285F4?logo=googlechrome&logoColor=white)
![Manifest](https://img.shields.io/badge/Manifest-V3-success)
![Version](https://img.shields.io/badge/version-2.0-ff4fa3)
![Author](https://img.shields.io/badge/Author-Swir-8A2BE2)

</div>

---

## 🇬🇧 English

PowerBookmark is a Manifest V3 browser extension created as a compact toolbox for working with web-page UI, scripts and bookmarklet-style workflows. It uses a popup interface together with a content script and browser storage.

### ✨ Features
- browser extension based on Manifest V3
- popup-based control panel
- page interaction through a content script
- local extension settings through browser storage
- scripting support for the active tab
- designed as a practical bookmarklet and page-tool toolbox

### 📦 Installation
1. Download or clone the repository.
2. Open Chrome/Chromium extension management.
3. Enable **Developer mode**.
4. Choose **Load unpacked**.
5. Select the `PowerBookmark` directory.

---

## 🇵🇱 Polski

PowerBookmark to rozszerzenie przeglądarki w standardzie Manifest V3 stworzone jako kompaktowy kombajn do pracy z interfejsem stron WWW, skryptami i rozwiązaniami typu bookmarklet. Rozszerzenie posiada własny panel popup, content script oraz lokalne ustawienia.

### ✨ Funkcje
- Manifest V3
- własny panel sterowania popup
- interakcja ze stroną przez content script
- zapisywanie ustawień w pamięci rozszerzenia
- wykonywanie skryptów na aktywnej karcie
- zestaw narzędzi ułatwiających tworzenie i używanie bookmarkletów

### 📦 Instalacja
1. Pobierz lub sklonuj repozytorium.
2. Otwórz panel rozszerzeń Chrome/Chromium.
3. Włącz **Tryb dewelopera**.
4. Kliknij **Załaduj rozpakowane**.
5. Wskaż katalog `PowerBookmark`.

---

## 📁 Structure / Struktura

```text
PowerBookmark/
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── icon.png
└── README.md
```

## 🔐 Permissions / Uprawnienia

The extension requests `storage`, `activeTab`, `scripting` and access to web pages because its tools operate directly on page content. Install extensions only from sources you trust.

Rozszerzenie korzysta z `storage`, `activeTab`, `scripting` oraz dostępu do stron WWW, ponieważ jego narzędzia działają bezpośrednio na zawartości stron.

## 👤 Author / Autor

Developed by **Swir**.
