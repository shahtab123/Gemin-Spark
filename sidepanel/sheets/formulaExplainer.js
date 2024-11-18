async function initFormulaExplainer() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Formula Explainer</h2>
      
      <div class="input-group">
        <label for="formula">Enter Google Sheets Formula</label>
        <textarea 
          id="formula"
          class="compose-input" 
          placeholder="Paste your formula here "
          rows="2"></textarea>
      </div>

      <div class="options-row">
        <div class="input-group">
          <label for="detail">Explanation Level</label>
          <select id="detail" class="compose-select">
            <option value="basic">Basic - Quick Overview</option>
            <option value="detailed">Detailed - Step by Step</option>
          </select>
        </div>
      </div>

      <button class="menu-button compose-button">
        <span class="material-icons">psychology</span>
        Explain Formula
      </button>

      <div class="input-group">
        <div class="output-header">
          <label>Explanation</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Formula explanation will appear here...</div>
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

    .input-group {
      width: 100%;
      margin-bottom: 0.75rem;
    }

    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #334155;
      font-size: 0.875rem;
    }

    .compose-input {
      width: 100%;
      height: 60px;
      min-height: 60px;
      max-height: 80px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      resize: none;
      font-size: 0.875rem;
      line-height: 1.5;
      font-family: 'Courier New', monospace;
    }

    .compose-select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
      color: #334155;
    }

    .compose-button {
      background: #4a5568;
      margin: 0.75rem auto;
      justify-content: center;
      width: auto;
      padding: 0.5rem 1.5rem;
      font-size: 0.875rem;
      color: white;
    }

    .output-box {
      width: 100%;
      height: 200px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: #f8fafc;
      font-size: 0.875rem;
      line-height: 1.6;
      white-space: pre-wrap;
      overflow-y: auto;
      overflow-x: hidden;
      resize: none;
      font-family: 'Courier New', monospace;
    }

    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .copy-button {
      padding: 0.25rem;
      background: none;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      color: #64748b;
    }

    .copy-button:hover {
      background: #f1f5f9;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./sheets.js').then(module => {
      module.showSheetsFeatures();
    });
  });

  // Add copy button functionality
  document.querySelector('#copyButton').addEventListener('click', async () => {
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');
    const icon = copyButton.querySelector('.material-icons');
    
    try {
      await navigator.clipboard.writeText(outputBox.textContent);
      icon.textContent = 'check';
      copyButton.classList.add('success');
      
      setTimeout(() => {
        icon.textContent = 'content_copy';
        copyButton.classList.remove('success');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });

  // Add the explain button functionality
  document.querySelector('.compose-button').addEventListener('click', async () => {
    const formula = document.querySelector('#formula').value;
    const detail = document.querySelector('#detail').value;
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');

    if (!formula.trim()) {
      outputBox.textContent = 'Please enter a formula to explain.';
      return;
    }

    if (!formula.trim().startsWith('=')) {
      outputBox.textContent = 'Please enter a valid formula starting with "=".';
      return;
    }

    try {
      console.log('🚀 Starting formula explanation...');
      outputBox.textContent = 'Analyzing formula...';

      const capabilities = await window.ai.languageModel.capabilities();
      if (capabilities.available === "no") {
        throw new Error('Language Model is not available on this device');
      }

      const session = await window.ai.languageModel.create();
      
      const stream = await session.promptStreaming(
        `Explain this Google Sheets formula:
         "${formula}"
         
         ${detail === 'basic' ? 
           `Provide a concise explanation in this format:

            # Purpose
            [One-line description of what the formula does]

            # Main Functions
            - [Function 1]: [brief purpose]
            - [Function 2]: [brief purpose]

            # Process
            [Brief explanation of how it works]` 
           :
           `Provide a clear explanation in this format:

            # Overview
            [Brief description of the formula's purpose]

            # Functions Used
            - [Function 1]: [what it does]
            - [Function 2]: [what it does]

            # How It Works
            1. [First step]
            2. [Next step]
            3. [Final step]

            # Tips
            - [Key consideration]
            - [Important note]`
         }
         
         Keep explanations clear and concise.`
      );

      outputBox.textContent = '';
      let previousLength = 0;
      
      for await (const chunk of stream) {
        const newContent = chunk.slice(previousLength);
        const formattedText = (outputBox.textContent + newContent)
          .replace(/\n{3,}/g, '\n\n')
          .replace(/\n\s*\n/g, '\n\n')
          .replace(/\n#/g, '\n\n#')
          .replace(/:\n\n/g, ':\n')
          .replace(/\n-/g, '\n-')
          .replace(/\n\d\./g, '\n\n$&')
          .trim();

        outputBox.textContent = formattedText;
        previousLength = chunk.length;
      }

      copyButton.style.display = 'block';

      session.destroy();

    } catch (error) {
      console.error('❌ Formula explanation failed:', error);
      outputBox.textContent = 'Error explaining formula. Please try again.';
    }
  });
}

export { initFormulaExplainer }; 