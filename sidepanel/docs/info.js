async function initInfo() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Features Guide</h2>
      
      <div class="features-list">
        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">edit_note</span>
            <h3>AI Writer</h3>
          </div>
          <p>Generate high-quality content with AI assistance:</p>
          <ul>
            <li>Choose from 10 different writing styles</li>
            <li>Set custom word limits</li>
            <li>Perfect for creating drafts, proposals, and more</li>
            <li>Copy generated text directly to your document</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">autorenew</span>
            <h3>Paraphrasing Tools</h3>
          </div>
          <p>Rewrite and enhance your text:</p>
          <ul>
            <li>10 different writing styles available</li>
            <li>4 levels of synonym changes</li>
            <li>Maintains original meaning while improving flow</li>
            <li>Perfect for refining existing content</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">lightbulb</span>
            <h3>Document Insights</h3>
          </div>
          <p>Extract valuable information from your documents:</p>
          <ul>
            <li>Generate key points and summaries</li>
            <li>Extract action items and tasks</li>
            <li>Get recommendations and suggestions</li>
            <li>Analyze document content effectively</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">translate</span>
            <h3>Translation</h3>
          </div>
          <p>Translate between supported languages:</p>
          <ul>
            <li>English ↔ Spanish translation</li>
            <li>English ↔ Japanese translation</li>
            <li>Easy language switching</li>
            <li>Preserves text formatting</li>
          </ul>
        </div>
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

    .features-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .feature-card {
      padding: 1rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background: white;
    }

    .feature-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }

    .feature-header .material-icons {
      color: #4a5568;
      font-size: 1.25rem;
    }

    .feature-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
      color: #1a202c;
    }

    .feature-card p {
      margin: 0.5rem 0;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .feature-card ul {
      margin: 0.5rem 0;
      padding-left: 1.5rem;
      font-size: 0.875rem;
      color: #4a5568;
    }

    .feature-card li {
      margin: 0.25rem 0;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./docs.js').then(module => {
      module.showDocsFeatures();
    });
  });
}

export { initInfo }; 