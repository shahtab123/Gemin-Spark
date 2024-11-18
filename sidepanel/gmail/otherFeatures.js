function initOtherFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <div class="header-section">
      <button class="menu-button back-button">
        <span class="material-icons">arrow_back</span>
        Back to Gmail Features
      </button>
      <div class="gmail-notice">
        <span class="material-icons warning-icon">info</span>
        These features are exclusively available in Gmail
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-header">
        <span class="material-icons feature-icon">edit_note</span>
        <span class="feature-title">Smart Reply</span>
      </div>
      <div class="feature-description">
        <h3>How to use Reply:</h3>
        <div class="steps-container">
          <ol>
            <li><span class="highlight">Select text</span> in an email (minimum 10 characters)</li>
            <li>Click the <span class="sparkle">✨</span> floating icon</li>
            <li>Choose <span class="action-text">↩️ Reply</span></li>
            <li>Add your <span class="highlight">custom instructions</span></li>
            <li>Select length: <span class="pill">Short</span> <span class="pill">Medium</span> <span class="pill">Long</span></li>
            <li>Click <span class="button-text">Generate Reply</span></li>
            <li>Use the <span class="copy-text">Copy</span> button to save response</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-header">
        <span class="material-icons feature-icon">smart_toy</span>
        <span class="feature-title">Auto Reply</span>
      </div>
      <div class="feature-description">
        <h3>How to use Auto Reply:</h3>
        <div class="steps-container">
          <ol>
            <li><span class="highlight">Select</span> the email content</li>
            <li>Click the <span class="sparkle">✨</span> floating icon</li>
            <li>Choose <span class="action-text">🤖 Auto Reply</span></li>
            <li>Click <span class="button-text">Auto Generate Response</span></li>
            <li>AI generates an <span class="highlight">appropriate response</span></li>
            <li>Use the <span class="copy-text">Copy</span> button to save response</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-header">
        <span class="material-icons feature-icon">psychology</span>
        <span class="feature-title">Smart Summarize</span>
      </div>
      <div class="feature-description">
        <h3>How to use Summarize:</h3>
        <div class="steps-container">
          <ol>
            <li><span class="highlight">Select text</span> (max 4000 characters)</li>
            <li>Click the <span class="sparkle">✨</span> floating icon</li>
            <li>Choose <span class="action-text">📝 Summarize</span></li>
            <li>Click <span class="button-text">Generate Summary</span></li>
            <li>Get a <span class="highlight">concise summary</span></li>
            <li>Use the <span class="copy-text">Copy</span> button to save summary</li>
          </ol>
        </div>
      </div>
    </div>

    <div class="feature-section">
      <div class="feature-header">
        <span class="material-icons feature-icon">translate</span>
        <span class="feature-title">Smart Translate</span>
      </div>
      <div class="feature-description">
        <h3>How to use Translate:</h3>
        <div class="steps-container">
          <ol>
            <li><span class="highlight">Select</span> English text</li>
            <li>Click the <span class="sparkle">✨</span> floating icon</li>
            <li>Choose <span class="action-text">🌐 Translate</span></li>
            <li>Select: <span class="pill">Spanish</span> or <span class="pill">Japanese</span></li>
            <li>Click <span class="button-text">Translate Text</span></li>
            <li>Use the <span class="copy-text">Copy</span> button to save translation</li>
          </ol>
        </div>
        <div class="note">
          <span class="material-icons">info</span>
          Currently supports translation from English to Spanish and Japanese only
        </div>
      </div>
    </div>
  `;

  // Add enhanced styles
  const style = document.createElement('style');
  style.textContent = `
    .header-section {
      margin-bottom: 24px;
    }

    .gmail-notice {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 12px;
      padding: 12px;
      background: #f8f9fa;
      border-radius: 8px;
      border-left: 4px solid #4285f4;
      font-size: 0.9rem;
      color: #5f6368;
    }

    .warning-icon {
      color: #4285f4;
      font-size: 20px;
    }

    .feature-section {
      margin-bottom: 24px;
      padding: 20px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .feature-section:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }

    .feature-icon {
      padding: 8px;
      background: #f0f4ff;
      border-radius: 8px;
      color: #4285f4;
    }

    .feature-title {
      font-size: 1.1rem;
      font-weight: 600;
      color: #1a73e8;
    }

    .feature-description {
      padding: 16px;
      background: #f8f9fa;
      border-radius: 8px;
    }

    .steps-container {
      margin-top: 12px;
    }

    .feature-description h3 {
      margin: 0;
      color: #202124;
      font-size: 1rem;
      font-weight: 500;
    }

    .feature-description li {
      margin: 8px 0;
      color: #5f6368;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    .highlight {
      color: #1a73e8;
      font-weight: 500;
    }

    .sparkle {
      padding: 2px 6px;
      background: #fff4e5;
      border-radius: 4px;
      color: #f9ab00;
    }

    .action-text {
      padding: 2px 8px;
      background: #e8f0fe;
      border-radius: 4px;
      color: #1967d2;
      font-weight: 500;
    }

    .button-text {
      padding: 4px 8px;
      background: #1a73e8;
      border-radius: 4px;
      color: white;
      font-size: 0.9rem;
    }

    .copy-text {
      padding: 2px 8px;
      background: #e6f4ea;
      border-radius: 4px;
      color: #137333;
      font-weight: 500;
    }

    .pill {
      padding: 2px 8px;
      background: #f1f3f4;
      border-radius: 12px;
      color: #5f6368;
      font-size: 0.85rem;
    }

    .note {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 16px;
      padding: 12px;
      background: #fff4e5;
      border-radius: 6px;
      font-size: 0.85rem;
      color: #b06000;
    }

    .note .material-icons {
      font-size: 18px;
      color: #f9ab00;
    }
  `;
  document.head.appendChild(style);

  // Add event listeners
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./gmail.js').then(module => {
      module.showGmailFeatures();
    });
  });
}

export { initOtherFeatures }; 