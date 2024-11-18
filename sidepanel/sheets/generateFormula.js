async function initGenerateFormula() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Generate Formula</h2>
      
      <div class="input-group">
        <label>Formula Type</label>
        <div class="formula-types">
          <button class="type-button active" data-type="calculation">
            <span class="material-icons">calculate</span>
            Calculation
          </button>
          <button class="type-button" data-type="lookup">
            <span class="material-icons">search</span>
            Lookup
          </button>
          <button class="type-button" data-type="conditional">
            <span class="material-icons">rule</span>
            Conditional
          </button>
          <button class="type-button" data-type="array">
            <span class="material-icons">grid_on</span>
            Array
          </button>
        </div>
      </div>

      <div class="input-group">
        <label for="prompt">Describe what you want to do</label>
        <textarea 
          id="prompt"
          class="compose-input" 
          placeholder="E.g., Calculate the sum of sales if the region is 'North' and date is after March 2024"
          rows="3"></textarea>
      </div>

      <div class="options-row">
        <div class="input-group half">
          <label for="complexity">Complexity</label>
          <select id="complexity" class="compose-select">
            <option value="simple">Simple</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div class="input-group half">
          <label for="format">Include</label>
          <select id="format" class="compose-select">
            <option value="explanation">Formula + Explanation</option>
            <option value="example">Formula + Example</option>
          </select>
        </div>
      </div>

      <button class="menu-button compose-button">
        <span class="material-icons">functions</span>
        Generate Formula
      </button>

      <div class="input-group">
        <div class="output-header">
          <label>Generated Formula</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Generated formula will appear here...</div>
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

    .formula-types {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .type-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      color: #334155;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .type-button:hover {
      background: #f8fafc;
    }

    .type-button.active {
      background: #4a5568;
      color: white;
      border-color: #4a5568;
    }

    .type-button .material-icons {
      font-size: 1.25rem;
    }

    .options-row {
      display: flex;
      gap: 1rem;
      width: 100%;
    }

    .half {
      flex: 1;
    }

    .compose-input {
      width: 100%;
      min-height: 80px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      resize: vertical;
      font-size: 0.875rem;
      line-height: 1.5;
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
      height: 150px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: #f8fafc;
      font-size: 0.875rem;
      line-height: 1.5;
      font-family: 'Courier New', monospace;
      white-space: pre-wrap;
      overflow-y: auto;
      overflow-x: hidden;
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
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./sheets.js').then(module => {
      module.showSheetsFeatures();
    });
  });

  // Add formula type selection
  document.querySelectorAll('.type-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.type-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });

  // Fix the copy button functionality
  document.querySelector('#copyButton').addEventListener('click', async () => {
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');
    const icon = copyButton.querySelector('.material-icons');
    
    try {
      // Extract just the formula (first line) from the output
      const text = outputBox.textContent;
      const formula = text.split('\n')[0].replace(/^(excel|google sheets)\s*/i, '').trim();
      
      await navigator.clipboard.writeText(formula);
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

  // Add the generate button functionality
  document.querySelector('.compose-button').addEventListener('click', async () => {
    const prompt = document.querySelector('#prompt').value;
    const complexity = document.querySelector('#complexity').value;
    const format = document.querySelector('#format').value;
    const formulaType = document.querySelector('.type-button.active').dataset.type;
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');

    if (!prompt.trim()) {
      outputBox.textContent = 'Please describe what you want to calculate.';
      return;
    }

    try {
      // Remove any existing generation info
      const existingInfo = document.querySelector('.generation-info');
      if (existingInfo) {
        existingInfo.remove();
      }

      console.log('🚀 Starting formula generation...');
      outputBox.textContent = 'Generating...';

      const capabilities = await window.ai.languageModel.capabilities();
      if (capabilities.available === "no") {
        throw new Error('Language Model is not available on this device');
      }

      const session = await window.ai.languageModel.create();
      
      const stream = await session.promptStreaming(
        `Generate a Google Sheets formula for this task: "${prompt}"

         Formula Type: ${formulaType}
         Complexity Level: ${complexity}

         Requirements:
         1. Use only valid Google Sheets functions and syntax
         2. Follow Google Sheets formula conventions
         3. Ensure the formula is optimized for spreadsheet use
         4. Include cell references (e.g., A1, B2) in examples
         5. Do not include any language markers (like 'excel' or 'google sheets')
         6. Start directly with the formula (with =)
         
         ${format === 'explanation' ? 
           'Provide the formula on the first line, then explain each component and function used.' :
           'Provide the formula on the first line, then show a practical example with sample data and cell references.'
         }

         Note: Format the formula exactly as it would be typed in Google Sheets, starting with =`
      );

      outputBox.textContent = '';
      let previousLength = 0;
      
      for await (const chunk of stream) {
        const newContent = chunk.slice(previousLength);
        outputBox.textContent += newContent;
        previousLength = chunk.length;
      }

      copyButton.style.display = 'block';

      // Add generation info
      outputBox.insertAdjacentHTML('afterend', 
        `<div class="generation-info">
           Type: ${formulaType} | Complexity: ${complexity}
         </div>`
      );

      session.destroy();

    } catch (error) {
      console.error('❌ Formula generation failed:', error);
      outputBox.textContent = 'Error generating formula. Please try again.';
    }
  });

  // Add style for generation info
  const infoStyle = document.createElement('style');
  infoStyle.textContent = `
    .generation-info {
      margin-top: 0.5rem;
      font-size: 0.75rem;
      color: #64748b;
      padding: 0.375rem;
      border-radius: 0.375rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
  `;
  document.head.appendChild(infoStyle);
}

export { initGenerateFormula }; 