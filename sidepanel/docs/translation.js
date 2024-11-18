async function initTranslation() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Translation</h2>
      
      <div class="translation-container">
        <div class="input-group">
          <div class="lang-select">
            <select id="fromLang" class="lang-dropdown">
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <textarea 
            id="inputText"
            class="translate-input" 
            placeholder="Enter text to translate..."></textarea>
        </div>

        <button class="swap-button">
          <span class="material-icons">swap_horiz</span>
        </button>

        <div class="input-group">
          <div class="lang-select">
            <select id="toLang" class="lang-dropdown">
              <option value="es">Spanish</option>
              <option value="en">English</option>
              <option value="ja">Japanese</option>
            </select>
          </div>
          <textarea 
            id="outputText"
            class="translate-input" 
            placeholder="Translation will appear here..."
            readonly></textarea>
        </div>

        <button class="translate-button">
          <span class="material-icons">translate</span>
          Translate
        </button>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .compose-container {
      margin-top: 0;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
      padding: 0 0.5rem;
    }

    .compose-title {
      text-align: center;
      margin-bottom: 1rem;
      font-size: 1.5rem;
      font-weight: 800;
      background: linear-gradient(to right, #000000, #333333);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .translation-container {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      width: 100%;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      width: 100%;
    }

    .lang-select {
      width: 100%;
    }

    .lang-dropdown {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
      color: #334155;
    }

    .translate-input {
      width: 100%;
      min-height: 100px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 0.15s ease;
    }

    .translate-input:focus {
      outline: none;
      border-color: #94a3b8;
      box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
    }

    .translate-input[readonly] {
      background: #f8fafc;
    }

    .swap-button {
      align-self: center;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .swap-button:hover {
      background: #f1f5f9;
    }

    .translate-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #4a5568;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      margin: 0.5rem auto;
    }

    .translate-button:hover {
      background: #2d3748;
    }

    .translate-button:active {
      transform: scale(0.98);
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./docs.js').then(module => {
      module.showDocsFeatures();
    });
  });

  // Add swap languages functionality
  document.querySelector('.swap-button').addEventListener('click', () => {
    const fromLang = document.querySelector('#fromLang');
    const toLang = document.querySelector('#toLang');
    const temp = fromLang.value;
    fromLang.value = toLang.value;
    toLang.value = temp;
  });

  // Add translation functionality
  document.querySelector('.translate-button').addEventListener('click', async () => {
    const inputText = document.querySelector('#inputText').value;
    const fromLang = document.querySelector('#fromLang').value;
    const toLang = document.querySelector('#toLang').value;
    const outputText = document.querySelector('#outputText');

    if (!inputText.trim()) {
      outputText.value = 'Please enter text to translate.';
      return;
    }

    try {
      outputText.value = 'Translating...';

      // Check if translation API exists
      if (!window.translation) {
        throw new Error('Translation API is not supported in this browser');
      }

      // Define language pair
      const languagePair = {
        sourceLanguage: fromLang,
        targetLanguage: toLang
      };

      // Check if translation is available
      const canTranslate = await window.translation.canTranslate(languagePair);
      console.log('📊 Translation availability:', canTranslate);

      if (canTranslate === 'no') {
        throw new Error(`Translation not available for ${fromLang} to ${toLang}`);
      }

      // Create translator
      let translator;
      if (canTranslate === 'readily') {
        translator = await window.translation.createTranslator(languagePair);
      } else {
        // Handle model download if needed
        translator = await window.translation.createTranslator(languagePair);
        translator.addEventListener('downloadprogress', (e) => {
          const percent = Math.round((e.loaded / e.total) * 100);
          outputText.value = `Downloading translation model: ${percent}%`;
        });
        await translator.ready;
      }

      // Translate the text
      const result = await translator.translate(inputText);
      outputText.value = result;

      // Clean up
      translator.destroy();

    } catch (error) {
      console.error('Translation failed:', error);
      outputText.value = `Error: ${error.message}. Please ensure you have Chrome 122+ and experimental features enabled in chrome://flags`;
    }
  });

  // Add language validation
  document.querySelector('#fromLang').addEventListener('change', validateLanguages);
  document.querySelector('#toLang').addEventListener('change', validateLanguages);

  function validateLanguages() {
    const fromLang = document.querySelector('#fromLang').value;
    const toLang = document.querySelector('#toLang').value;
    const translateButton = document.querySelector('.translate-button');

    // Check if language pair is supported
    const isSupported = (
      (fromLang === 'en' && (toLang === 'es' || toLang === 'ja')) ||
      (toLang === 'en' && (fromLang === 'es' || fromLang === 'ja'))
    );

    translateButton.disabled = !isSupported;
    
    if (!isSupported) {
      document.querySelector('#outputText').value = 
        'Currently only supports translation between:\n' +
        '• English ↔ Spanish\n' +
        '• English ↔ Japanese';
    } else {
      document.querySelector('#outputText').value = '';
    }
  }

  // Call validation on init
  setTimeout(validateLanguages, 0);
}

export { initTranslation }; 