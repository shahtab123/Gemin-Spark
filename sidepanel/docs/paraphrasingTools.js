async function initParaphrasingTools() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Paraphrasing Tools</h2>
      
      <div class="input-group">
        <label for="inputText">Text to paraphrase</label>
        <textarea 
          id="inputText"
          class="compose-input input-text" 
          placeholder="Enter or paste your text here..."
          rows="6"></textarea>
      </div>

      <div class="controls-group">
        <div class="control-item">
          <label for="mode">Writing Style</label>
          <select id="mode" class="control-select">
            <option value="standard">Standard</option>
            <option value="formal">Formal</option>
            <option value="simple">Simple</option>
            <option value="creative">Creative</option>
            <option value="expand">Expand</option>
            <option value="shorten">Shorten</option>
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="academic">Academic</option>
            <option value="fluent">Fluent</option>
          </select>
        </div>

        <div class="control-item">
          <label for="synonymLevel">Synonym Changes</label>
          <div class="synonym-selector">
            <button class="synonym-button" data-level="minimal">
              Few Changes
            </button>
            <button class="synonym-button" data-level="moderate">
              Some Changes
            </button>
            <button class="synonym-button" data-level="significant">
              Many Changes
            </button>
            <button class="synonym-button" data-level="maximum">
              Maximum Changes
            </button>
          </div>
        </div>
      </div>

      <button class="paraphrase-button">
        <span class="material-icons">autorenew</span>
        Paraphrase
      </button>

      <div class="output-group">
        <div class="output-header">
          <label>Result</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Paraphrased text will appear here...</div>
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

    .input-group, .output-group {
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
    }

    .controls-group {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .control-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    label {
      font-size: 0.75rem;
      font-weight: 500;
      color: #334155;
    }

    .input-text {
      min-height: 80px !important;
      max-height: 200px;
      padding: 0.625rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 0.15s ease;
    }

    .input-text:focus {
      outline: none;
      border-color: #94a3b8;
      box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
    }

    .control-select {
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background: white;
      font-size: 0.875rem;
      color: #334155;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .control-select:focus {
      outline: none;
      border-color: #94a3b8;
      box-shadow: 0 0 0 3px rgba(148, 163, 184, 0.1);
    }

    .synonym-selector {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.375rem;
      width: 100%;
      padding: 0.25rem 0;
    }

    .synonym-button {
      padding: 0.375rem 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      color: #334155;
      font-size: 0.75rem;
      cursor: pointer;
      transition: all 0.15s ease;
      height: 1.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .synonym-button:hover {
      background: #f8fafc;
    }

    .synonym-button.active {
      background: #991b1b;
      color: white;
      border-color: #991b1b;
    }

    .paraphrase-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.375rem 1rem;
      height: 2rem;
      background: #4a5568;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      margin: 0.75rem auto;
      min-width: 120px;
    }

    .paraphrase-button:hover {
      background: #2d3748;
    }

    .paraphrase-button:active {
      transform: scale(0.98);
    }

    .paraphrase-button .material-icons {
      font-size: 0.875rem;
    }

    .output-box {
      min-height: 120px;
      max-height: 300px;
      padding: 0.625rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: #f8fafc;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #334155;
      resize: vertical;
      overflow-y: auto;
      white-space: pre-wrap;
      font-family: inherit;
    }

    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.25rem;
    }

    .copy-button {
      padding: 0.25rem;
      border-radius: 0.25rem;
      color: #64748b;
    }

    .copy-button .material-icons {
      font-size: 1rem;
    }

    .copy-button.success {
      color: #10b981;
    }

    .paraphrase-info {
      margin-top: 0.375rem;
      font-size: 0.75rem;
      color: #64748b;
      padding: 0.375rem;
      border-radius: 0.375rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .output-box::-webkit-scrollbar {
      width: 8px;
    }

    .output-box::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    .output-box::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    .output-box::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./docs.js').then(module => {
      module.showDocsFeatures();
    });
  });

  // Add synonym level selection functionality
  document.querySelectorAll('.synonym-button').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.synonym-button').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });

  // Set default synonym level
  document.querySelector('[data-level="moderate"]').classList.add('active');

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

  // Add paraphrase button functionality
  document.querySelector('.paraphrase-button').addEventListener('click', async () => {
    const inputText = document.querySelector('#inputText').value;
    const writingStyle = document.querySelector('#mode').value;
    const synonymLevel = document.querySelector('.synonym-button.active').dataset.level;
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');

    if (!inputText.trim()) {
      outputBox.textContent = 'Please enter some text to paraphrase.';
      return;
    }

    try {
      console.log('🚀 Starting paraphrasing...');
      outputBox.textContent = 'Generating...';

      const capabilities = await window.ai.languageModel.capabilities();
      console.log('📊 AI Capabilities:', capabilities);

      if (capabilities.available === "no") {
        throw new Error('Language Model is not available on this device');
      }

      // Define style-specific guidelines
      const styleGuides = {
        standard: "Maintain a balanced, neutral tone while preserving the original meaning",
        formal: "Use sophisticated vocabulary and formal language structures",
        simple: "Simplify language while keeping the core message clear",
        creative: "Add creative flair and engaging language variations",
        expand: "Elaborate and add more detail to the content",
        shorten: "Condense the content while keeping key points",
        professional: "Use industry-appropriate terminology and professional tone",
        casual: "Make the language more conversational and relaxed",
        academic: "Employ scholarly language and academic conventions",
        fluent: "Ensure natural flow and native-like language use"
      };

      // Define synonym change levels
      const synonymLevels = {
        minimal: "Make minimal word replacements (around 20-30% of content)",
        moderate: "Replace a moderate number of words (around 40-50% of content)",
        significant: "Make substantial word changes (around 60-70% of content)",
        maximum: "Transform most of the text while preserving meaning (around 80-90% of content)"
      };

      console.log('💫 Creating AI session...');
      const session = await window.ai.languageModel.create({
        model: 'models/gemini-nano',
        systemPrompt: `You are an expert paraphrasing assistant.
                      Your task is to rewrite text according to specific style and synonym change requirements.
                      Maintain the original meaning while adapting the language appropriately.
                      Ensure high-quality, coherent output that follows the requested style.`
      });

      console.log('💭 Sending prompt to AI...');
      
      const stream = await session.promptStreaming(
        `Paraphrase the following text according to these specifications:

         Original Text:
         "${inputText}"
         
         Writing Style: ${writingStyle}
         Style Guidelines: ${styleGuides[writingStyle]}
         
         Synonym Change Level: ${synonymLevel}
         Change Requirements: ${synonymLevels[synonymLevel]}
         
         Important Requirements:
         1. Maintain the original meaning and key points
         2. Follow the specified writing style consistently
         3. Apply the requested level of word changes
         4. Ensure natural flow and readability
         5. Preserve any technical terms or proper nouns
         6. Keep paragraph structure where appropriate
         
         Format the output as a well-structured, coherent text.`
      );

      // Handle streaming response
      outputBox.textContent = '';
      let previousLength = 0;
      
      for await (const chunk of stream) {
        const newContent = chunk.slice(previousLength);
        outputBox.textContent += newContent;
        previousLength = chunk.length;
      }

      // Show copy button
      copyButton.style.display = 'block';

      // Remove any existing paraphrase info
      const existingInfo = document.querySelector('.paraphrase-info');
      if (existingInfo) {
        existingInfo.remove();
      }

      // Add new paraphrasing info
      const timestamp = new Date().toLocaleString();
      outputBox.insertAdjacentHTML('afterend', 
        `<div class="paraphrase-info">
           Style: ${writingStyle} | Synonym Level: ${synonymLevel}
           <br>
           Completed at: ${timestamp}
         </div>`
      );

      session.destroy();

    } catch (error) {
      console.error('❌ Paraphrasing failed:', error);
      outputBox.textContent = `Error: ${error.message}. Please ensure you have Chrome 122+ and experimental features enabled in chrome://flags`;
    }
  });

  // Add style for paraphrase info
  const infoStyle = document.createElement('style');
  infoStyle.textContent = `
    .paraphrase-info {
      margin-top: 0.5rem;
      font-size: 0.8rem;
      color: #64748b;
      padding: 0.5rem;
      border-radius: 0.375rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
  `;
  document.head.appendChild(infoStyle);
}

export { initParaphrasingTools }; 