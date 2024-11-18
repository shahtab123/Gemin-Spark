async function initSheetsInfo() {
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
            <span class="material-icons">functions</span>
            <h3>Generate Formula</h3>
          </div>
          <p>Create Google Sheets formulas with AI assistance:</p>
          <ul>
            <li>Choose from 4 formula types (Calculation, Lookup, Conditional, Array)</li>
            <li>Select complexity level (Simple to Advanced)</li>
            <li>Get explanations and examples</li>
            <li>Copy formulas directly to your spreadsheet</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">psychology</span>
            <h3>Formula Explainer</h3>
          </div>
          <p>Understand complex formulas easily:</p>
          <ul>
            <li>Paste any Google Sheets formula</li>
            <li>Choose explanation detail level</li>
            <li>Get clear function breakdowns</li>
            <li>Learn formula logic and usage</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">tips_and_updates</span>
            <h3>How to Use</h3>
          </div>
          <p>Quick tips for using AI features:</p>
          <ul>
            <li>Generate Formula: Describe what you want to calculate</li>
            <li>Formula Explainer: Paste any formula starting with =</li>
            <li>Copy results with one click</li>
            <li>Choose appropriate detail levels for your needs</li>
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
    import('./sheets.js').then(module => {
      module.showSheetsFeatures();
    });
  });
}

export { initSheetsInfo }; 