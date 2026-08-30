document.addEventListener('DOMContentLoaded', () => {
  const mainView = document.getElementById('mainView');
  const addView = document.getElementById('addView');
  const scriptsContainer = document.getElementById('scriptsContainer');
  const editorTitle = document.getElementById('editorTitle');
  const newScriptName = document.getElementById('newScriptName');
  const newScriptDomain = document.getElementById('newScriptDomain');
  const newScriptCode = document.getElementById('newScriptCode');
  let editingIndex = -1;

  function loadScripts() {
    chrome.storage.local.get({ userScripts: [] }, (result) => {
      scriptsContainer.innerHTML = '';
      const scripts = result.userScripts;
      if (scripts.length === 0) {
        scriptsContainer.innerHTML = '<div style="text-align:center; color:#777; padding:10px;">Brak skryptów. Dodaj coś!</div>';
        return;
      }
      scripts.forEach((script, index) => {
        const item = document.createElement('div');
        item.className = 'script-item';
        
        const info = document.createElement('div');
        info.className = 'script-info';
        
        const name = document.createElement('div');
        name.className = 'script-name';
        name.textContent = script.name;
        
        const domain = document.createElement('div');
        domain.className = 'script-domain';
        domain.textContent = script.domain === '*' ? '🌐 Wszędzie' : `📍 ${script.domain}`;
        
        info.appendChild(name); info.appendChild(domain);
        
        const actions = document.createElement('div');
        actions.className = 'actions';
        
        const btnEdit = document.createElement('button');
        btnEdit.className = 'icon-btn'; btnEdit.textContent = '✏️';
        btnEdit.addEventListener('click', () => openEditor(index, script));
        
        const btnDelete = document.createElement('button');
        btnDelete.className = 'icon-btn delete'; btnDelete.textContent = '🗑️';
        btnDelete.addEventListener('click', () => deleteScript(index));
        
        actions.appendChild(btnEdit); actions.appendChild(btnDelete);
        
        const toggle = document.createElement('input');
        toggle.type = 'checkbox'; toggle.className = 'toggle-switch'; toggle.checked = script.active;
        
        toggle.addEventListener('change', () => toggleScript(index, toggle.checked, script));
        
        item.appendChild(info); item.appendChild(actions); item.appendChild(toggle);
        scriptsContainer.appendChild(item);
      });
    });
  }

  function toggleScript(index, isActive, script) {
    chrome.storage.local.get({ userScripts: [] }, (result) => {
      const scripts = result.userScripts;
      scripts[index].active = isActive;
      chrome.storage.local.set({ userScripts: scripts }, () => {
        if (isActive) {
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            // Przesyłamy nazwę, aby powiadomienie na ekranie wiedziało co odpala!
            if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: "RUN_SCRIPT", code: script.code, name: script.name });
          });
        }
      });
    });
  }

  function deleteScript(index) {
    if(confirm("Czy na pewno usunąć ten skrypt?")) {
      chrome.storage.local.get({ userScripts: [] }, (result) => {
        result.userScripts.splice(index, 1);
        chrome.storage.local.set({ userScripts: result.userScripts }, loadScripts);
      });
    }
  }

  function openEditor(index = -1, script = null) {
    editingIndex = index;
    mainView.classList.add('hidden'); addView.classList.remove('hidden');
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      let currentDomain = '*';
      if (tabs[0] && tabs[0].url.startsWith('http')) currentDomain = new URL(tabs[0].url).hostname.replace('www.', '');

      if (index === -1) {
        editorTitle.textContent = "Nowy Skrypt";
        newScriptName.value = ''; newScriptDomain.value = currentDomain; newScriptCode.value = '';
      } else {
        editorTitle.textContent = "Edycja Skryptu";
        newScriptName.value = script.name; newScriptDomain.value = script.domain || '*'; newScriptCode.value = script.code;
      }
    });
  }

  document.getElementById('btnAddNew').addEventListener('click', () => openEditor(-1));
  document.getElementById('btnCancelNew').addEventListener('click', () => { addView.classList.add('hidden'); mainView.classList.remove('hidden'); });

  function cleanBookmarkletCode(rawCode) {
    let clean = rawCode.trim();
    if (clean.toLowerCase().startsWith('javascript:')) clean = clean.substring(11).trim();
    try { if (clean.includes('%')) clean = decodeURIComponent(clean); } catch(e) {}
    return clean;
  }

  document.getElementById('btnSaveNew').addEventListener('click', () => {
    const name = newScriptName.value.trim(); const domain = newScriptDomain.value.trim() || '*'; const code = cleanBookmarkletCode(newScriptCode.value);
    if (!name || !code) return alert('Podaj nazwę i wklej kod!');

    chrome.storage.local.get({ userScripts: [] }, (result) => {
      const scripts = result.userScripts;
      if (editingIndex === -1) scripts.push({ name, domain, code, active: true });
      else { scripts[editingIndex] = { name, domain, code, active: true }; }
      
      chrome.storage.local.set({ userScripts: scripts }, () => {
        addView.classList.add('hidden'); mainView.classList.remove('hidden'); loadScripts();
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: "RUN_SCRIPT", code: code, name: name });
        });
      });
    });
  });

  document.getElementById('btnScanner').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: "START_SNIPER" }); window.close(); });
  });

  document.getElementById('btnCodeScanner').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => { if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action: "START_FULL_SCAN" }); window.close(); });
  });

  loadScripts();
});