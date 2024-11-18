export async function showRightClickSummarizerFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="right-click-summarizer-container">
      <div class="header-section">
        <h2>Right-Click Summarizer</h2>
        <div class="toggle-container">
          <label class="toggle-switch">
            <input type="checkbox" id="summarizerToggle">
            <span class="toggle-slider"></span>
          </label>
          <span class="toggle-label" id="toggleStatus">Off</span>
        </div>
      </div>

      <div class="info-section">
        <div class="info-card">
          <div class="info-icon">
            <span class="material-icons">info</span>
          </div>
          <div class="info-text">
            <h3>How to use:</h3>
            <ol>
              <li>Toggle the summarizer ON</li>
              <li>Select any text on a webpage</li>
              <li>Right-click to see "Summarize Text" option</li>
              <li>Click to get an instant summary</li>
            </ol>
          </div>
        </div>
      </div>

      <div class="summarize-section">
        <div class="input-group">
          <label>Selected Text:</label>
          <textarea 
            id="selectedText" 
            class="text-area" 
            placeholder="Selected text will appear here..."
            readonly
          ></textarea>
        </div>
        
        <button class="summarize-button" id="summarizeButton">
          <span class="material-icons">summarize</span>
          Summarize
        </button>

        <div class="input-group">
          <label>Summary:</label>
          <textarea 
            id="summaryOutput" 
            class="text-area" 
            placeholder="Summary will appear here..."
            readonly
          ></textarea>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .right-click-summarizer-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .header-section h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #9ca3af;
      transition: .4s;
      border-radius: 24px;
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .toggle-slider {
      background-color: #2563eb;
    }

    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    .toggle-label {
      font-size: 0.875rem;
      color: #4b5563;
    }

    .info-card {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
    }

    .info-icon {
      color: #2563eb;
    }

    .info-text h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .info-text ol {
      margin: 0;
      padding-left: 1.25rem;
      color: #4b5563;
      font-size: 0.875rem;
    }

    .info-text li {
      margin-bottom: 0.25rem;
    }

    .history-section {
      flex: 1;
    }

    .history-section h3 {
      margin: 0 0 1rem 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .summaries-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .empty-state {
      text-align: center;
      color: #6b7280;
      padding: 2rem;
      background: #f9fafb;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .summary-item {
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      font-size: 0.875rem;
    }

    .summary-item .original-text {
      color: #6b7280;
      margin-bottom: 0.5rem;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    .summary-item .summary-text {
      color: #1f2937;
    }

    .summary-item .timestamp {
      font-size: 0.75rem;
      color: #9ca3af;
      margin-top: 0.5rem;
    }

    .summarize-section {
      margin-top: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .input-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .input-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #4b5563;
    }

    .text-area {
      width: 100%;
      min-height: 100px;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      resize: vertical;
      font-size: 0.875rem;
      line-height: 1.5;
      background: #f9fafb;
    }

    .text-area:read-only {
      cursor: default;
    }

    .summarize-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 0.875rem;
    }

    .summarize-button:hover {
      background: #1d4ed8;
    }

    .summarize-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .summarize-button .material-icons {
      font-size: 1.25rem;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', async () => {
    const module = await import('../otherTools.js');
    module.showOtherToolsFeatures();
  });

  // Initialize toggle functionality
  const toggle = document.getElementById('summarizerToggle');
  const toggleStatus = document.getElementById('toggleStatus');
  const selectedTextArea = document.getElementById('selectedText');
  const summaryOutput = document.getElementById('summaryOutput');
  const summarizeButton = document.getElementById('summarizeButton');

  toggle.addEventListener('change', async () => {
    const isEnabled = toggle.checked;
    toggleStatus.textContent = isEnabled ? 'On' : 'Off';
    
    await chrome.runtime.sendMessage({
      action: 'updateContextMenu',
      enabled: isEnabled
    });
  });

  // Load initial state
  chrome.storage.local.get(['rightClickSummarizerEnabled'], (result) => {
    const isEnabled = result.rightClickSummarizerEnabled || false;
    toggle.checked = isEnabled;
    toggleStatus.textContent = isEnabled ? 'On' : 'Off';
  });

  // Add these helper functions first
  async function createSummarizationSession() {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error('AI Summarization is not supported in this browser');
    }
    const canSummarize = await window.ai.summarizer.capabilities();
    if (canSummarize.available === 'no') {
      throw new Error('AI Summarization is not available');
    }

    const summarizationSession = await window.ai.summarizer.create({
      maxOutputWords: 30,
      minOutputWords: 10,
      targetOutputWords: 20,
      temperature: 0.2
    });
    
    if (canSummarize.available === 'after-download') {
      await summarizationSession.ready;
    }

    return summarizationSession;
  }

  function cleanSummaryText(text) {
    return text
      .replace(/[^\w\s.,!?-]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\s+([.,!?])/g, '$1')
      .trim()
      .split(/\s+/)
      .slice(0, 30)
      .join(' ');
  }

  // Update the manual summarize button handler
  summarizeButton.addEventListener('click', async () => {
    const text = selectedTextArea.value.trim();
    if (!text) return;

    try {
      summarizeButton.disabled = true;
      summarizeButton.innerHTML = `
        <span class="material-icons spinning">refresh</span>
        Summarizing...
      `;
      summaryOutput.value = 'Generating summary...';

      const session = await createSummarizationSession();
      let summary = await session.summarize(text);
      summary = cleanSummaryText(summary || '');
      summaryOutput.value = summary || 'No summary available';

      session.destroy();

    } catch (error) {
      console.error('Summarization failed:', error);
      summaryOutput.value = 'Failed to generate summary';
    } finally {
      summarizeButton.disabled = false;
      summarizeButton.innerHTML = `
        <span class="material-icons">summarize</span>
        Summarize
      `;
    }
  });

  // Update the context menu listener to only update the selected text
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'summaryComplete') {
      selectedTextArea.value = message.originalText;
      // Don't auto-summarize, wait for button click
      summaryOutput.value = ''; // Clear any previous summary
    }
  });
} 