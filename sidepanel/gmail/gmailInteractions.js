// Track current button and selected text
let currentButton = null;
let lastSelectedText = '';
let isPopupInitialized = false;

// Add this function at the top level
function cleanupExistingPopups() {
  // Remove any existing popups
  const existingPopups = document.querySelectorAll('.ai-reply-popup');
  existingPopups.forEach(popup => popup.remove());
}

// Check if current page is Gmail
function isGmail() {
  return window.location.hostname.includes('mail.google.com');
}

// Remove existing button
function removeButton() {
  if (currentButton) {
    currentButton.remove();
    currentButton = null;
  }
}

// Create button with dropdown
function createButton(position, selectedText) {
  removeButton();

  // Store the selected text
  lastSelectedText = selectedText;

  const button = document.createElement('div');
  button.className = 'ai-button';
  button.innerHTML = `
    <div class="ai-icon">✨</div>
    <div class="ai-dropdown" style="display: none;">
      <div class="ai-dropdown-item" data-action="reply">↩️ Reply</div>
      <div class="ai-dropdown-item" data-action="autoreply">🤖 Auto Reply</div>
      <div class="ai-dropdown-item" data-action="summarize">📝 Summarize</div>
      <div class="ai-dropdown-item" data-action="translate">🌐 Translate</div>
    </div>
  `;

  button.style.left = `${position.x}px`;
  button.style.top = `${position.y}px`;

  // Show menu when clicking the icon
  const icon = button.querySelector('.ai-icon');
  icon.addEventListener('click', (e) => {
    e.stopPropagation();
    const dropdown = button.querySelector('.ai-dropdown');
    dropdown.style.display = dropdown.style.display === 'none' ? 'block' : 'none';
  });

  // Handle dropdown item clicks
  button.querySelector('.ai-dropdown').addEventListener('click', (e) => {
    const action = e.target.closest('.ai-dropdown-item')?.dataset.action;
    if (action) {
      if (!isPopupInitialized) {
        // Initialize popup system on first interaction
        createReplyPopup(lastSelectedText);
        cleanupExistingPopups();
        isPopupInitialized = true;
      }
      
      // Then show the requested popup
      switch(action) {
        case 'reply':
          createReplyPopup(lastSelectedText);
          break;
        case 'autoreply':
          createAutoReplyPopup(lastSelectedText);
          break;
        case 'summarize':
          createSummarizePopup(lastSelectedText);
          break;
        case 'translate':
          createTranslatePopup(lastSelectedText);
          break;
      }
      removeButton();
    }
  });

  document.body.appendChild(button);
  currentButton = button;
}

async function generateReply(selectedText, prompt, length) {
  try {
    const outputArea = document.querySelector('.ai-output-area');
    outputArea.textContent = 'Starting...';
    console.log('🚀 Starting reply generation...');

    // Check AI capabilities
    const capabilities = await window.ai.languageModel.capabilities();
    console.log('📊 AI Capabilities:', capabilities);

    if (capabilities.available === "no") {
      throw new Error('Language Model is not available on this device');
    }

    // Define length guidelines
    const lengthGuides = {
      'short': '2-3 sentences, approximately 50 words',
      'medium': '4-6 sentences, approximately 100 words',
      'long': '7-10 sentences, approximately 200 words'
    };

    console.log('💫 Creating AI session...');
    const session = await window.ai.languageModel.create({
      systemPrompt: `You are an expert email reply writer who crafts precise, contextual responses.
                    Follow these rules strictly:
                    1. Maintain a professional and appropriate tone
                    2. Length requirement: ${lengthGuides[length]}
                    3. Be concise and directly address the points in the original email
                    4. Include proper email greeting and signature`
    });

    console.log('💭 Sending prompt to AI...');
    const stream = await session.promptStreaming(
      `Write an email reply with these specifications:
       Original Email: "${selectedText}"
       Instructions: ${prompt}
       Length: ${lengthGuides[length]}
       
       Important: Strictly follow the length requirement and ensure the reply is contextual to the original email.`
    );

    // Handle streaming response
    outputArea.textContent = '';
    let previousLength = 0;
    
    for await (const chunk of stream) {
      const newContent = chunk.slice(previousLength);
      console.log(`📨 New content: "${newContent}"`);
      outputArea.textContent += newContent;
      previousLength = chunk.length;
    }

    console.log('✅ Reply generation completed!');
    console.log(`📈 Tokens used: ${session.tokensSoFar}/${session.maxTokens}`);

    // Clean up
    session.destroy();

    // Add word count
    const wordCount = outputArea.textContent.trim().split(/\s+/).length;
    outputArea.insertAdjacentHTML('afterend', 
      `<div class="word-count">Word count: ${wordCount}</div>`
    );

  } catch (error) {
    console.error('❌ Reply generation failed:', error);
    outputArea.textContent = `Error: ${error.message}. Please ensure you have Chrome 122+ and experimental features enabled in chrome://flags`;
  }
}

// Update createReplyPopup to handle form submission
function createReplyPopup(selectedText) {
  cleanupExistingPopups();
  console.log('Creating reply popup with text:', selectedText);
  
  const popup = document.createElement('div');
  popup.className = 'ai-reply-popup';
  popup.innerHTML = `
    <div class="ai-reply-container">
      <div class="ai-reply-header">
        <div class="ai-header-title">AI Reply Assistant</div>
        <button class="ai-close-button">✕</button>
      </div>
      
      <div class="ai-reply-content">
        <div class="ai-input-group">
          <label>Selected Text</label>
          <div class="ai-selected-text">${selectedText}</div>
        </div>

        <div class="ai-input-group">
          <label for="replyPrompt">How would you like to reply?</label>
          <textarea 
            id="replyPrompt"
            class="ai-textarea" 
            placeholder="E.g., Write a professional response agreeing with the points made"
            rows="2"></textarea>
        </div>

        <div class="ai-input-group">
          <label for="length">Response Length</label>
          <select id="length" class="ai-select">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <button class="ai-submit-button">
          <span class="ai-button-content">Generate Reply</span>
        </button>

        <div class="ai-output-area"></div>
      </div>
    </div>
  `;

  // Update styles
  const style = document.createElement('style');
  style.textContent = `
    .ai-reply-popup {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      padding: 1rem;
    }

    .ai-reply-container {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      width: 100%;
      max-width: 400px;
      max-height: 90vh;
      overflow-y: auto;
      margin: 0 auto;
    }

    .ai-reply-header {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 1.25rem;
      border-bottom: 1px solid #e2e8f0;
      position: relative;
      background: #f8fafc;
    }

    .ai-header-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: #1a202c;
    }

    .ai-close-button {
      position: absolute;
      right: 1rem;
      background: none;
      border: none;
      font-size: 1.25rem;
      color: #4a5568;
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
    }

    .ai-reply-content {
      padding: 1.25rem;
      width: 100%;
      box-sizing: border-box;
    }

    .ai-input-group {
      margin-bottom: 1.25rem;
      width: 100%;
    }

    .ai-input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
      color: #4a5568;
      font-size: 0.9rem;
    }

    .ai-selected-text {
      padding: 0.75rem;
      background: #f7fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      font-size: 0.9rem;
      line-height: 1.5;
      max-height: 100px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
    }

    .ai-textarea {
      width: 100%;
      min-height: 50px;
      max-height: 150px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      resize: vertical;
      font-size: 0.9rem;
      line-height: 1.5;
      box-sizing: border-box;
    }

    .ai-textarea:focus {
      outline: none;
      border-color: #4a5568;
      box-shadow: 0 0 0 2px rgba(74, 85, 104, 0.1);
    }

    .ai-select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background-color: white;
      font-size: 0.9rem;
    }

    .ai-submit-button {
      width: 100%;
      padding: 0.75rem;
      background: #4a5568;
      color: white;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .ai-submit-button:hover {
      background: #2d3748;
    }

    .ai-output-area {
      margin-top: 1rem;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #f8fafc;
      min-height: 100px;
      max-height: 200px;
      overflow-y: auto;
      white-space: pre-wrap;
      word-break: break-word;
      font-size: 0.9rem;
      line-height: 1.5;
    }

    .ai-copy-button {
      margin-top: 0.5rem;
      padding: 0.5rem 1rem;
      background: #4a5568;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .ai-copy-button:hover {
      background: #2d3748;
    }
  `;
  document.head.appendChild(style);

  // Add event listeners
  popup.querySelector('.ai-close-button').addEventListener('click', () => {
    popup.remove();
  });

  popup.querySelector('.ai-submit-button').addEventListener('click', async () => {
    const promptText = popup.querySelector('#replyPrompt').value;
    const lengthValue = popup.querySelector('#length').value;
    
    if (!promptText) {
      alert('Please enter instructions for the reply');
      return;
    }

    const submitButton = popup.querySelector('.ai-submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Generating...';

    try {
      await generateReply(selectedText, promptText, lengthValue);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Generate Reply';
    }
  });

  // Close on background click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  document.body.appendChild(popup);
}

// Add the createAutoReplyPopup function
function createAutoReplyPopup(selectedText) {
  cleanupExistingPopups();
  console.log('Creating auto-reply popup with text:', selectedText);
  
  const popup = document.createElement('div');
  popup.className = 'ai-reply-popup';
  popup.innerHTML = `
    <div class="ai-reply-container">
      <div class="ai-reply-header">
        <div class="ai-header-title">AI Auto Reply</div>
        <button class="ai-close-button">✕</button>
      </div>
      
      <div class="ai-reply-content">
        <div class="ai-input-group">
          <label>Original Email</label>
          <div class="ai-selected-text">${selectedText}</div>
        </div>

        <div class="ai-input-group">
          <label for="tone">Reply Tone</label>
          <select id="tone" class="ai-select">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <div class="ai-input-group">
          <label for="length">Response Length</label>
          <select id="length" class="ai-select">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>

        <button class="ai-submit-button">
          <span class="ai-button-content">Generate Auto Reply</span>
        </button>

        <div class="ai-output-area"></div>
      </div>
    </div>
  `;

  // Add event listeners
  popup.querySelector('.ai-close-button').addEventListener('click', () => {
    popup.remove();
  });

  popup.querySelector('.ai-submit-button').addEventListener('click', async () => {
    const tone = popup.querySelector('#tone').value;
    const lengthValue = popup.querySelector('#length').value;
    const outputArea = popup.querySelector('.ai-output-area');
    
    const submitButton = popup.querySelector('.ai-submit-button');
    submitButton.disabled = true;
    submitButton.textContent = 'Generating...';

    try {
      await generateReply(selectedText, `Generate an auto-reply in a ${tone} tone`, lengthValue);
    } finally {
      submitButton.disabled = false;
      submitButton.textContent = 'Generate Auto Reply';
    }
  });

  // Close on background click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  document.body.appendChild(popup);
}

// Update the createSummarizePopup function
function createSummarizePopup(selectedText) {
  cleanupExistingPopups();
  console.log('Creating summarize popup with text:', selectedText);
  
  const popup = document.createElement('div');
  popup.className = 'ai-reply-popup';
  popup.innerHTML = `
    <div class="ai-reply-container">
      <div class="ai-reply-header">
        <div class="ai-header-title">AI Text Summary</div>
        <button class="ai-close-button">✕</button>
      </div>
      
      <div class="ai-reply-content">
        <div class="ai-input-group">
          <label>Selected Text</label>
          <div class="ai-selected-text">${selectedText}</div>
        </div>

        <button class="ai-submit-button">
          <span class="ai-button-content">Generate Summary</span>
        </button>

        <div class="ai-output-area"></div>
      </div>
    </div>
  `;

  // Add event listeners
  popup.querySelector('.ai-close-button').addEventListener('click', () => {
    popup.remove();
  });

  popup.querySelector('.ai-submit-button').addEventListener('click', async () => {
    const submitButton = popup.querySelector('.ai-submit-button');
    const outputArea = popup.querySelector('.ai-output-area');
    
    submitButton.disabled = true;
    submitButton.textContent = 'Generating...';

    await generateSummary(selectedText, outputArea, submitButton);
  });

  // Close on background click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  document.body.appendChild(popup);
}

// Update handleSelection function with minimum text length
function handleSelection() {
  const selection = window.getSelection();
  const selectedText = selection.toString().trim();

  // Only process selection if text is meaningful length (e.g., at least 10 characters)
  if (selectedText && selectedText.length >= 10) {
    console.log('Text selected:', selectedText.substring(0, 100) + '...');
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    createButton({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5
    }, selectedText);
  }
}

// Initialize only if we're on Gmail
if (isGmail()) {
  console.log('🚀 AI text helper initializing on Gmail...');
  document.addEventListener('mouseup', handleSelection);
  document.addEventListener('mousedown', (e) => {
    if (currentButton && !currentButton.contains(e.target)) {
      removeButton();
    }
  });
}

// Update the createTranslatePopup function with supported languages only
function createTranslatePopup(selectedText) {
  cleanupExistingPopups();
  console.log('Creating translate popup with text:', selectedText);
  
  const popup = document.createElement('div');
  popup.className = 'ai-reply-popup';
  popup.innerHTML = `
    <div class="ai-reply-container">
      <div class="ai-reply-header">
        <div class="ai-header-title">AI Text Translation</div>
        <button class="ai-close-button">✕</button>
      </div>
      
      <div class="ai-reply-content">
        <div class="ai-input-group">
          <label>Selected Text</label>
          <div class="ai-selected-text">${selectedText}</div>
        </div>

        <div class="ai-input-group">
          <label for="targetLanguage">Translate to:</label>
          <select id="targetLanguage" class="ai-select">
            <option value="en">English</option>
            <option value="es">Spanish (Español)</option>
            <option value="ja">Japanese (日本語)</option>
          </select>
        </div>

        <button class="ai-submit-button">
          <span class="ai-button-content">Translate Text</span>
        </button>

        <div class="ai-output-area"></div>
      </div>
    </div>
  `;

  // Add event listeners
  popup.querySelector('.ai-close-button').addEventListener('click', () => {
    popup.remove();
  });

  // Update this click handler to use the actual translation function
  popup.querySelector('.ai-submit-button').addEventListener('click', async () => {
    const submitButton = popup.querySelector('.ai-submit-button');
    const outputArea = popup.querySelector('.ai-output-area');
    const targetLanguage = popup.querySelector('#targetLanguage').value;
    
    submitButton.disabled = true;
    submitButton.textContent = 'Translating...';

    try {
      await generateTranslation(selectedText, targetLanguage, outputArea, submitButton);
    } catch (error) {
      console.error('Translation failed:', error);
      outputArea.textContent = 'Error: ' + error.message;
      submitButton.disabled = false;
      submitButton.textContent = 'Translate Text';
    }
  });

  // Close on background click
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      popup.remove();
    }
  });

  document.body.appendChild(popup);
}

// Update the generateTranslation function to match the official documentation
async function generateTranslation(text, targetLanguage, outputArea, submitButton) {
  try {
    outputArea.textContent = 'Loading...';
    console.log('🌐 Starting translation...');

    // Check if translation API exists
    if (!window.translation) {
      throw new Error('Translation API is not supported in this browser');
    }

    // Define language pair
    const languagePair = {
      sourceLanguage: 'en', // Currently only supporting English as source
      targetLanguage: targetLanguage
    };

    // Check if translation is available
    const canTranslate = await window.translation.canTranslate(languagePair);
    console.log('📊 Translation availability:', canTranslate);

    if (canTranslate === 'no') {
      throw new Error(`Translation not available for the selected language pair`);
    }

    // Create translator
    outputArea.textContent = 'Creating translator...';
    let translator;
    
    if (canTranslate === 'readily') {
      translator = await window.translation.createTranslator(languagePair);
    } else {
      // Handle model download if needed
      translator = await window.translation.createTranslator(languagePair);
      translator.addEventListener('downloadprogress', (e) => {
        const percent = Math.round((e.loaded / e.total) * 100);
        outputArea.textContent = `Downloading translation model: ${percent}%`;
        console.log(`Downloaded ${e.loaded} of ${e.total} bytes`);
      });
      await translator.ready;
    }

    // Translate the text
    outputArea.textContent = 'Translating...';
    const result = await translator.translate(text);
    console.log('✅ Translation completed');

    // Display result
    outputArea.textContent = result;

    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'ai-copy-button';
    copyButton.textContent = 'Copy Translation';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(result);
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy Translation';
      }, 2000);
    };
    outputArea.insertAdjacentElement('afterend', copyButton);

  } catch (error) {
    console.error('❌ Translation failed:', error);
    outputArea.textContent = 'Error: ' + error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Translate Text';
  }
}

// Update the generateSummary function
async function generateSummary(text, outputArea, submitButton) {
  try {
    outputArea.textContent = 'Loading...';
    
    // Basic text cleanup
    const cleanText = text.trim();

    // Check text length
    const MAX_MODEL_CHARS = 4000;
    if (cleanText.length > MAX_MODEL_CHARS) {
      throw new Error(`Text is too long (maximum supported length is ~4000 characters).`);
    }

    // Create session with specific summarization prompt
    let session = await window.ai.languageModel.create({
      systemPrompt: `You are a precise email summarizer. Create concise, clear summaries following these rules:
        1. Keep summaries short and focused (2-3 sentences maximum)
        2. Extract only the most important points
        3. Use simple, direct language
        4. Avoid unnecessary details
        5. Format in a single, clean paragraph`
    });

    // Generate summary
    const stream = await session.promptStreaming(
      `Summarize this email in a brief, clear way:\n\n${cleanText}`
    );

    // Display summary
    outputArea.textContent = '';
    let previousLength = 0;
    
    for await (const chunk of stream) {
      const newContent = chunk.slice(previousLength);
      outputArea.textContent += newContent;
      previousLength = chunk.length;
    }

    // Clean up
    session.destroy();

    // Add copy button
    const copyButton = document.createElement('button');
    copyButton.className = 'ai-copy-button';
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => {
      navigator.clipboard.writeText(outputArea.textContent);
      copyButton.textContent = 'Copied!';
      setTimeout(() => {
        copyButton.textContent = 'Copy';
      }, 2000);
    };
    outputArea.insertAdjacentElement('afterend', copyButton);

  } catch (error) {
    console.error('Summary generation failed:', error);
    outputArea.textContent = 'Error: ' + error.message;
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Generate Summary';
  }
}