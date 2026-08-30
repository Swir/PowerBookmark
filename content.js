// ==========================================
// SYSTEM POWIADOMIEŃ EKRANOWYCH (TOASTS)
// ==========================================
function showToast(message, color) {
  const toast = document.createElement('div');
  toast.innerHTML = message;
  toast.style.cssText = `
    position: fixed; bottom: 20px; right: 20px; background: rgba(18, 18, 18, 0.95);
    color: #fff; padding: 12px 20px; border-left: 5px solid ${color}; border-radius: 4px;
    font-family: 'Segoe UI', Tahoma, sans-serif; font-size: 14px; font-weight: bold;
    z-index: 2147483647; box-shadow: 0 4px 20px rgba(0,0,0,0.6); pointer-events: none;
    transition: opacity 0.4s; letter-spacing: 0.5px;
  `;
  document.body.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 400); }, 3500);
}

// ==========================================
// SILNIK WSTRZYKUJĄCY Z RAPORTOWANIEM BŁĘDÓW
// ==========================================
function runCode(code, name = "Skrypt") {
  showToast(`⚙️ Ładowanie: ${name}...`, "#00ADB5");
  
  try { 
    // Generowanie unikalnego ID, by nasłuchiwacze się nie myliły
    const uid = Math.random().toString(36).substring(2);
    const ninjaScript = document.createElement('script');
    
    // Wstrzyknięcie z automatycznym raportowaniem sukcesu lub błędu na ekran
    ninjaScript.textContent = `
      try {
        ${code}
        document.dispatchEvent(new CustomEvent('PB_OK_${uid}'));
      } catch(e) {
        document.dispatchEvent(new CustomEvent('PB_ERR_${uid}', {detail: e.message}));
      }
    `;
    
    let executed = false;
    
    document.addEventListener(`PB_OK_${uid}`, () => {
      executed = true;
      showToast(`✅ Uruchomiono: <span style="color:#00ADB5">${name}</span>`, "#28a745");
    }, { once: true });
    
    document.addEventListener(`PB_ERR_${uid}`, (e) => {
      executed = true;
      showToast(`🔴 Błąd skryptu [${name}]: ${e.detail}`, "#ff4444");
    }, { once: true });

    (document.head || document.documentElement).appendChild(ninjaScript);
    ninjaScript.remove(); 
    
    // Zabezpieczenie przed niewidzialnymi blokadami stron (Strict CSP)
    setTimeout(() => {
      if (!executed) {
        showToast(`⚠️ Strona zablokowała wykonanie: <span style="color:#ffcc00">${name}</span> (CSP Block)`, "#ffcc00");
      }
    }, 300);

  } catch (e) { 
    showToast(`🔴 Krytyczny błąd systemu: ${e.message}`, "#ff4444");
  }
}

// 1. ŁADOWANIE SKRYPTÓW TYLKO DLA OBECNEJ STRONY
chrome.storage.local.get({ userScripts: [] }, (result) => {
  const currentHost = window.location.hostname.replace('www.', '');
  result.userScripts.forEach(script => {
    if (script.active && script.code) {
      if (script.domain === '*' || script.domain === '' || currentHost.includes(script.domain) || script.domain.includes(currentHost)) {
        runCode(script.code, script.name);
      }
    }
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "RUN_SCRIPT") runCode(request.code, request.name);
  else if (request.action === "START_SNIPER") startSniper();
  else if (request.action === "START_FULL_SCAN") runFullPageScanner();
});

// ==========================================
// SNAJPER ELEMENTÓW
// ==========================================
let sniperActive = false;
let hoveredElement = null;

function startSniper() {
  sniperActive = true;
  document.body.style.cursor = "crosshair";
  if (!document.getElementById("pb-styles")) {
    const style = document.createElement("style"); style.id = "pb-styles";
    style.innerHTML = `.pb-target { outline: 3px dashed #00ADB5 !important; background: rgba(0, 173, 181, 0.3) !important; cursor: crosshair !important; } .pb-scanned { outline: 3px solid #ff4444 !important; box-shadow: 0 0 12px #ff4444 !important; }`;
    document.head.appendChild(style);
  }
}

document.addEventListener("mouseover", (e) => { if (!sniperActive) return; e.stopPropagation(); if (hoveredElement) hoveredElement.classList.remove("pb-target"); hoveredElement = e.target; hoveredElement.classList.add("pb-target"); }, true);
document.addEventListener("mouseout", (e) => { if (!sniperActive) return; if (hoveredElement) hoveredElement.classList.remove("pb-target"); }, true);
document.addEventListener("click", (e) => {
  if (!sniperActive) return;
  e.preventDefault(); e.stopPropagation();
  sniperActive = false; document.body.style.cursor = "default";
  if (hoveredElement) hoveredElement.classList.remove("pb-target");
  showSniperMenu(e.target, e.clientX, e.clientY);
}, true);

function showSniperMenu(el, x, y) {
  const oldMenu = document.getElementById('pb-sniper-menu'); if (oldMenu) oldMenu.remove();
  const menu = document.createElement('div'); menu.id = 'pb-sniper-menu';
  const posX = (x + 240 > window.innerWidth) ? window.innerWidth - 260 : x + 15;
  const posY = (y + 360 > window.innerHeight) ? window.innerHeight - 380 : y + 15;

  menu.style.cssText = `position: fixed; top: ${posY}px; left: ${posX}px; width: 240px; background: rgba(18, 18, 18, 0.98); border: 2px solid #00ADB5; border-radius: 8px; padding: 12px; z-index: 9999999; display: flex; flex-direction: column; gap: 8px; box-shadow: 0 10px 30px rgba(0, 173, 181, 0.6); font-family: 'Segoe UI', sans-serif;`;
  menu.innerHTML = `<strong style="color:#00ADB5; font-size: 13px; text-transform: uppercase; border-bottom: 1px solid #333; padding-bottom: 6px; text-align: center;">🎯 TAG: &lt;${el.tagName.toLowerCase()}&gt;</strong>`;

  const addBtn = (text, icon, color, onClick) => {
    const btn = document.createElement('button');
    btn.innerHTML = `${icon} ${text}`;
    btn.style.cssText = `background: #222; color: #fff; border: 1px solid #444; padding: 8px; font-size: 13px; cursor: pointer; border-radius: 4px; text-align: left; transition: 0.2s; font-weight: 500;`;
    btn.onmouseover = () => { btn.style.background = color; btn.style.color = '#121212'; btn.style.fontWeight = 'bold'; };
    btn.onmouseout = () => { btn.style.background = '#222'; btn.style.color = '#fff'; btn.style.fontWeight = '500'; };
    btn.onclick = (ev) => { ev.stopPropagation(); onClick(); };
    menu.appendChild(btn);
  };

  addBtn("Edytuj Źródło (HTML)", "💻", "#00ffcc", () => { openCodeEditor("Edytor HTML", el.outerHTML, (newCode) => { el.outerHTML = newCode; }); menu.remove(); });
  addBtn("Edytuj Wygląd (CHNS)", "🎨", "#ff00ff", () => { openCodeEditor("Edytor CSS", el.style.cssText, (newCode) => { el.style.cssText = newCode; }); menu.remove(); });
  
  // NOWOŚĆ: Fizyczne usunięcie blokad zdarzeń przez klonowanie węzła
  addBtn("Wyczyść Zabezpieczenia", "🧹", "#ffcc00", () => { 
    const clone = el.cloneNode(true);
    el.replaceWith(clone);
    showToast("🧹 Wyczyszczono ukryte blokady (React/Vue) z elementu!", "#ffcc00");
    menu.remove(); 
  });

  addBtn("Ukryj Element", "👁️", "#00ADB5", () => { el.style.display = 'none'; menu.remove(); });
  addBtn("Zniszcz Całkowicie", "💣", "#ff4444", () => { el.remove(); menu.remove(); });
  addBtn("Zapisz Ukrycie", "💾", "#28a745", () => {
    const sel = generateCssSelector(el);
    saveScript(`Ukryto: <${el.tagName.toLowerCase()}>`, `const el = document.querySelector('${sel}');\nif(el) { el.style.display = 'none'; }`);
    showToast('💾 Zapisano ukrycie na stałe!', '#28a745');
    menu.remove();
  });
  addBtn("Zamknij", "❌", "#888", () => menu.remove());
  document.body.appendChild(menu);
}

function openCodeEditor(title, initialCode, onSaveCallback) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0,0,0,0.85); z-index: 100000000; display: flex; justify-content: center; align-items: center;`;
  const box = document.createElement('div');
  box.style.cssText = `width: 600px; max-width: 90vw; background: #1a1a1a; padding: 20px; border-radius: 10px; border: 2px solid #00ADB5; display: flex; flex-direction: column; gap: 15px;`;
  box.innerHTML = `<h3 style="margin:0; color:#00ADB5; font-family:'Segoe UI', sans-serif;">${title}</h3>`;
  const textarea = document.createElement('textarea');
  textarea.style.cssText = `width: 100%; height: 350px; background: #121212; color: #00ffcc; font-family: 'Courier New', monospace; padding: 15px; border: 1px solid #333; box-sizing: border-box; resize: vertical;`;
  textarea.value = initialCode || '';
  const btnRow = document.createElement('div'); btnRow.style.cssText = "display: flex; justify-content: flex-end; gap: 10px;";
  const btnCancel = document.createElement('button'); btnCancel.innerText = 'Odrzuć';
  btnCancel.style.cssText = 'padding: 10px 20px; background: #333; color: #fff; border: none; cursor: pointer; border-radius: 5px;';
  btnCancel.onclick = () => overlay.remove();
  const btnSave = document.createElement('button'); btnSave.innerText = '💾 Zastosuj Zmiany';
  btnSave.style.cssText = 'padding: 10px 20px; background: #00ADB5; color: #000; border: none; cursor: pointer; font-weight: bold; border-radius: 5px;';
  btnSave.onclick = () => { onSaveCallback(textarea.value); overlay.remove(); };
  btnRow.appendChild(btnCancel); btnRow.appendChild(btnSave); box.appendChild(textarea); box.appendChild(btnRow); overlay.appendChild(box); document.body.appendChild(overlay);
}

// ==========================================
// SCANNER KODU
// ==========================================
function runFullPageScanner() {
  if (!document.getElementById("pb-styles")) startSniper(); 
  const findings = [];
  const addFinding = (el, type, desc, fixJs, domAction) => {
    const sel = generateCssSelector(el);
    const saveCode = `const el = document.querySelector('${sel}');\nif(el) { ${fixJs} }`;
    findings.push({ el, type, desc, saveCode, fix: domAction });
    el.classList.add('pb-scanned');
  };

  document.querySelectorAll('[disabled]:not([data-pb-fixed])').forEach(el => addFinding(el, 'Zablokowane', 'Wyłączony element.', "el.removeAttribute('disabled');", () => { el.removeAttribute('disabled'); el.setAttribute('data-pb-fixed', 'true'); }));
  document.querySelectorAll('[maxlength]:not([data-pb-fixed])').forEach(el => addFinding(el, 'Limit Znaków', `Blokada do ${el.getAttribute('maxlength')} znaków.`, "el.removeAttribute('maxlength');", () => { el.removeAttribute('maxlength'); el.setAttribute('data-pb-fixed', 'true'); }));
  document.querySelectorAll('input[type="password"]:not([data-pb-fixed])').forEach(el => addFinding(el, 'Ukryte Hasło', 'Odkrywa tekst.', "el.setAttribute('type', 'text');", () => { el.setAttribute('type', 'text'); el.setAttribute('data-pb-fixed', 'true'); }));
  document.querySelectorAll('[readonly]:not([data-pb-fixed])').forEach(el => addFinding(el, 'Tylko odczyt', 'Pola nie można edytować.', "el.removeAttribute('readonly');", () => { el.removeAttribute('readonly'); el.setAttribute('data-pb-fixed', 'true'); }));

  if (findings.length > 0) showScannerPanel(findings);
  else showToast("🛡️ PowerBookmark: Brak standardowych blokad HTML na tej stronie.", "#ffcc00");
}

function showScannerPanel(findings) {
  const oldPanel = document.getElementById('pb-scanner-panel'); if (oldPanel) oldPanel.remove();
  const panel = document.createElement('div');
  panel.style.cssText = `position: fixed; top: 20px; right: 20px; width: 360px; max-height: 85vh; overflow-y: auto; background: rgba(15, 15, 15, 0.98); border: 2px solid #ff4444; border-radius: 10px; z-index: 999999; padding: 15px; color: #fff; font-family: 'Segoe UI', sans-serif; box-shadow: 0 10px 40px rgba(255, 68, 68, 0.3);`;
  let html = `<div style="display:flex; justify-content:space-between; align-items:center; border-bottom: 1px solid #333; padding-bottom: 10px; margin-bottom: 15px;">
    <div><strong style="color:#ff4444; font-size:16px;">🔍 Znaleziono: ${findings.length} Blokad</strong></div>
    <button id="pb-fix-all-btn" style="background:#ff4444; color:#fff; border:none; padding:6px 12px; border-radius:4px; font-weight:bold; cursor:pointer;">Odblokuj Wszystko</button>
  </div>`;
  const listContainer = document.createElement('div'); listContainer.innerHTML = html; panel.appendChild(listContainer);
  findings.forEach((item) => {
    const div = document.createElement('div'); div.style.cssText = "background: #222; margin-bottom: 12px; padding: 12px; border-radius: 6px; border-left: 4px solid #ff4444;";
    div.innerHTML = `<strong style="color:#ff4444; font-size:14px;">${item.type}</strong><br><span style="font-size: 12px; color:#aaa;">${item.desc}</span><br>`;
    const btn = document.createElement('button'); btn.innerText = "🔓 Odblokuj";
    btn.style.cssText = "margin-top: 10px; padding: 6px 12px; background: #333; color: #fff; border: 1px solid #555; border-radius: 4px; cursor: pointer; font-weight:bold; width:100%; transition:0.2s;";
    btn.onclick = () => {
      item.fix();
      saveScript(`Skaner: ${item.type}`, item.saveCode);
      item.el.classList.remove('pb-scanned'); item.el.style.boxShadow = "0 0 15px #28a745"; 
      btn.innerText = "✅ Odblokowano"; btn.style.background = "#28a745"; btn.disabled = true;
    };
    div.appendChild(btn); panel.appendChild(div);
  });
  const closeBtn = document.createElement('button'); closeBtn.innerText = "Zamknij Skaner";
  closeBtn.style.cssText = "width: 100%; padding: 10px; background: #222; color: #888; border: 1px solid #333; cursor: pointer; border-radius: 5px; font-weight:bold; margin-top: 5px;";
  closeBtn.onclick = () => { panel.remove(); document.querySelectorAll('.pb-scanned').forEach(el => el.classList.remove('pb-scanned')); };
  panel.appendChild(closeBtn); document.body.appendChild(panel);

  document.getElementById('pb-fix-all-btn').onclick = (e) => {
    let combinedCode = "";
    findings.forEach(item => { item.fix(); combinedCode += item.saveCode + "\n"; item.el.classList.remove('pb-scanned'); item.el.style.boxShadow = "0 0 15px #28a745"; });
    saveScript(`Skaner: Odblokowano wszystko`, combinedCode);
    e.target.innerText = "✅ Zapisane!"; e.target.style.background = "#28a745";
    panel.querySelectorAll('button:not(#pb-fix-all-btn):not(:last-child)').forEach(b => { b.innerText = "✅"; b.style.background = "#28a745"; b.disabled = true; });
  };
}

function generateCssSelector(el) {
  if (el.id) return `#${el.id}`;
  let path = [];
  while (el.nodeType === Node.ELEMENT_NODE) {
    let sel = el.nodeName.toLowerCase();
    if (el.id) { path.unshift(`${sel}#${el.id}`); break; }
    path.unshift(sel); el = el.parentNode;
  }
  return path.join(" > ");
}

function saveScript(name, code) {
  const currentHost = window.location.hostname.replace('www.', '');
  chrome.storage.local.get({ userScripts: [] }, (result) => {
    const scripts = result.userScripts;
    scripts.push({ name: name, domain: currentHost, code: code, active: true });
    chrome.storage.local.set({ userScripts: scripts });
  });
}