export async function showTabSummarizerFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="tab-summarizer-container">
      <div class="header-section">
        <h2>Tab Summarizer</h2>
        <div class="header-buttons">
          <button class="icon-button" id="refreshTabs" title="Refresh Tabs">
            <span class="material-icons">refresh</span>
          </button>
          <button class="start-button" id="startSummarization">
            <span class="material-icons">play_arrow</span>
            Start
          </button>
        </div>
      </div>

      <div class="summary-stats">
        <div class="stat-item">
          <span class="material-icons">tab</span>
          <span id="tabCount">0 tabs open</span>
        </div>
        <div class="stat-item">
          <span class="material-icons">schedule</span>
          <span id="lastUpdate">Last updated: Never</span>
        </div>
      </div>

      <div class="summaries-container" id="summariesList">
        <div class="loading-message">
          <span class="material-icons spinning">refresh</span>
          Loading tabs...
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .tab-summarizer-container {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }

    .header-section h2 {
      margin: 0;
      color: #1f2937;
      font-size: 1.25rem;
    }

    .header-buttons {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      padding: 0;
      background: #4b5563;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-button:hover {
      background: #374151;
    }

    .icon-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .summary-stats {
      display: flex;
      gap: 1rem;
      padding: 0.75rem;
      background: #f8fafc;
      border-radius: 0.375rem;
      margin-bottom: 1rem;
    }

    .stat-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: #4b5563;
      font-size: 0.875rem;
    }

    .summaries-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      overflow-y: auto;
      max-height: calc(100vh - 250px);
    }

    .tab-summary {
      padding: 1rem;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      transition: transform 0.2s;
    }

    .tab-summary:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .tab-title {
      font-weight: 600;
      color: #1f2937;
      margin-bottom: 0.5rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .tab-summary-text {
      color: #4b5563;
      font-size: 0.875rem;
      line-height: 1.5;
    }

    .loading-message {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: center;
      color: #6b7280;
      padding: 2rem;
    }

    .spinning {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      100% { transform: rotate(360deg); }
    }

    .error-message {
      color: #dc2626;
      text-align: center;
      padding: 1rem;
      background: #fef2f2;
      border-radius: 0.375rem;
    }

    .start-button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .start-button:hover {
      background: #1d4ed8;
    }

    .start-button:disabled,
    .refresh-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .summarize-button {
      margin-top: 0.5rem;
      padding: 0.25rem 0.5rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.75rem;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', async () => {
    const module = await import('../otherTools.js');
    module.showOtherToolsFeatures();
  });

  // Initialize tab listing
  initializeTabSummarizer();
}

async function initializeTabSummarizer() {
  const summariesList = document.getElementById('summariesList');
  const tabCount = document.getElementById('tabCount');
  const lastUpdate = document.getElementById('lastUpdate');
  const startButton = document.getElementById('startSummarization');
  const refreshButton = document.getElementById('refreshTabs');

  async function createSummarizationSession() {
    if (!window.ai || !window.ai.summarizer) {
      throw new Error('AI Summarization is not supported in this browser');
    }
    const canSummarize = await window.ai.summarizer.capabilities();
    if (canSummarize.available === 'no') {
      throw new Error('AI Summarization is not available');
    }

    const summarizationSession = await window.ai.summarizer.create({
      maxOutputWords: 50,
      minOutputWords: 20,
      targetOutputWords: 35,
      temperature: 0.3
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
      .slice(0, 50)
      .join(' ');
  }

  async function loadTabs() {
    try {
      const tabs = await chrome.tabs.query({});
      tabCount.textContent = `${tabs.length} tabs open`;
      lastUpdate.textContent = `Last updated: ${new Date().toLocaleTimeString()}`;
      
      summariesList.innerHTML = ''; // Clear existing content

      tabs.forEach(tab => {
        const tabDiv = document.createElement('div');
        tabDiv.className = 'tab-summary';
        tabDiv.innerHTML = `
          <div class="tab-title">
            <img src="${tab.favIconUrl || 'icon.png'}" width="16" height="16" alt="favicon">
            ${tab.title}
          </div>
          <div class="tab-summary-text">Click Start Summarization to generate summaries</div>
        `;
        summariesList.appendChild(tabDiv);
      });

      return tabs;
    } catch (error) {
      summariesList.innerHTML = `
        <div class="error-message">
          Error loading tabs. Please try again.
        </div>
      `;
      console.error('Tab loading failed:', error);
      return [];
    }
  }

  async function startSummarization() {
    try {
      startButton.disabled = true;
      startButton.innerHTML = `
        <span class="material-icons spinning">refresh</span>
        Loading...
      `;

      const session = await createSummarizationSession();
      const tabs = await chrome.tabs.query({});
      const summaryDivs = document.querySelectorAll('.tab-summary');

      for (let i = 0; i < tabs.length; i++) {
        const summaryText = summaryDivs[i].querySelector('.tab-summary-text');
        summaryText.textContent = 'Generating summary...';

        try {
          let summary = await session.summarize(tabs[i].title + ": " + tabs[i].url);
          summary = cleanSummaryText(summary || '');
          summaryText.textContent = summary || 'No summary available';
        } catch (error) {
          summaryText.textContent = 'Unable to generate summary';
          console.error(`Error summarizing tab ${tabs[i].title}:`, error);
        }
      }

      session.destroy();
    } catch (error) {
      console.error('Summarization failed:', error);
    } finally {
      startButton.disabled = false;
      startButton.innerHTML = `
        <span class="material-icons">play_arrow</span>
        Start
      `;
    }
  }

  // Add start button handler
  startButton.addEventListener('click', startSummarization);

  // Add refresh button handler
  refreshButton.addEventListener('click', async () => {
    refreshButton.disabled = true;
    await loadTabs();
    refreshButton.disabled = false;
  });

  // Initial load of tabs
  await loadTabs();
} 