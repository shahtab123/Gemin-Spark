async function initSmartCompose() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Smart Compose</h2>
      
      <div class="input-group">
        <label for="prompt">What would you like to write about?</label>
        <textarea 
          id="prompt"
          class="compose-input" 
          placeholder="E.g., Write a professional email to schedule a meeting with the marketing team"></textarea>
      </div>

      <div class="options-row">
        <div class="input-group half">
          <label for="tone">Select Tone</label>
          <select id="tone" class="compose-select">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
            <option value="persuasive">Persuasive</option>
          </select>
        </div>

        <div class="input-group half">
          <label for="length">Email Length</label>
          <select id="length" class="compose-select">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>

      <button class="menu-button compose-button">
        <span class="material-icons">edit</span>
        <span class="button-text">Compose</span>
      </button>

      <div class="input-group">
        <div class="output-header">
          <label>Generated Email</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Your composed email will appear here...</div>
      </div>
    </div>
  `;

  // Add all styles at once
  const style = document.createElement('style');
  style.textContent = `
    .compose-container {
      margin-top: 0.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
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
      margin-bottom: 1rem;
    }

    .options-row {
      display: flex;
      gap: 1rem;
      width: 100%;
      margin-bottom: 1rem;
    }

    .half {
      flex: 1;
      margin-bottom: 0;
    }

    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .compose-input {
      width: 100%;
      height: 60px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      resize: vertical;
      font-size: 0.9rem;
      min-height: 60px;
      max-height: 200px;
    }

    .compose-select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background-color: white;
      font-size: 0.9rem;
    }

    .back-button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }

    .compose-button {
      background: var(--primary);
      margin: 0.5rem 0;
      justify-content: center;
      width: auto;
      padding: 0.5rem 1.5rem;
      font-size: 0.875rem;
      transition: background-color 0.2s ease;
    }

    .compose-button:hover {
      background: #2d3748;
    }

    .compose-button .material-icons,
    .compose-button .button-text {
      color: white !important;
    }

    .output-box {
      width: 100%;
      height: 150px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background-color: #f8fafc;
      font-size: 0.9rem;
      line-height: 1.5;
      overflow-y: auto;
    }

    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .copy-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .copy-button:hover {
      background: #e2e8f0;
    }

    .copy-button .material-icons {
      font-size: 1.25rem;
      color: #4a5568;
    }

    .copy-button.success .material-icons {
      color: #48bb78;
    }

    .word-count {
      font-size: 0.8rem;
      color: #666;
      text-align: right;
      margin-top: 0.5rem;
    }
  `;
  document.head.appendChild(style);

  // Add event listeners
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./gmail.js').then(module => {
      module.showGmailFeatures();
    });
  });

  // Add compose button listener with Prompt API integration
  document.querySelector('.compose-button').addEventListener('click', async () => {
    const prompt = document.querySelector('#prompt').value;
    const tone = document.querySelector('#tone').value;
    const length = document.querySelector('#length').value;
    const outputBox = document.querySelector('#outputBox');
    
    // Remove any existing word count display
    const existingWordCount = document.querySelector('.word-count');
    if (existingWordCount) {
      existingWordCount.remove();
    }
    
    // Define length constraints
    const lengthGuides = {
      'short': '2-3 sentences, approximately 50 words',
      'medium': '4-6 sentences, approximately 100 words',
      'long': '7-10 sentences, approximately 200 words'
    };
    
    try {
      console.log('🚀 Starting email generation process...');
      outputBox.textContent = 'Starting...';
      
      const capabilities = await window.ai.languageModel.capabilities();
      console.log('📊 AI Capabilities:', capabilities);

      if (capabilities.available === "no") {
        throw new Error('Language Model is not available on this device');
      }

      console.log('💫 Creating AI session...');
      const session = await window.ai.languageModel.create({
        systemPrompt: `You are an expert email writer who crafts precise, well-structured emails.
                      Follow these rules strictly:
                      1. Maintain a ${tone} tone throughout
                      2. Length requirement: ${lengthGuides[length]}
                      3. Be concise and direct
                      4. Include proper email greeting and signature`
      });

      console.log('💭 Sending prompt to AI...');
      
      const stream = await session.promptStreaming(
        `Write an email with these exact specifications:
         Task: ${prompt}
         Tone: ${tone}
         Length: ${lengthGuides[length]}
         
         Important: Strictly follow the length requirement - ${lengthGuides[length]}.
         Do not exceed this length limit.`
      );

      // Handle streaming response
      outputBox.textContent = '';
      let previousLength = 0;
      
      for await (const chunk of stream) {
        const newContent = chunk.slice(previousLength);
        console.log(`📨 New content: "${newContent}"`);
        outputBox.textContent += newContent;
        previousLength = chunk.length;
      }

      // Add word count display (now it won't accumulate)
      const wordCount = outputBox.textContent.trim().split(/\s+/).length;
      console.log(`📝 Word count: ${wordCount}`);
      
      console.log('✅ Email generation completed!');
      console.log(`📈 Tokens used: ${session.tokensSoFar}/${session.maxTokens}`);

      // Clean up
      session.destroy();

      // Show copy button and word count
      document.querySelector('#copyButton').style.display = 'block';
      
      // Add new word count
      outputBox.insertAdjacentHTML('afterend', 
        `<div class="word-count">Word count: ${wordCount}</div>`
      );

    } catch (error) {
      console.error('❌ Email composition failed:', error);
      outputBox.textContent = `Error: ${error.message}. Please ensure you have Chrome 122+ and experimental features enabled in chrome://flags`;
    }
  });

  // Add copy button functionality
  document.querySelector('#copyButton').addEventListener('click', async () => {
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');
    const icon = copyButton.querySelector('.material-icons');
    
    try {
      await navigator.clipboard.writeText(outputBox.textContent);
      
      // Show success state
      icon.textContent = 'check';
      copyButton.classList.add('success');
      
      // Reset after 2 seconds
      setTimeout(() => {
        icon.textContent = 'content_copy';
        copyButton.classList.remove('success');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
}

// Simplified tone mapping
function mapTone(uiTone) {
  const toneMap = {
    'professional': 'formal',
    'friendly': 'casual',
    'formal': 'formal',
    'casual': 'casual',
    'persuasive': 'formal'
  };
  return toneMap[uiTone] || 'neutral';
}

export { initSmartCompose }; 