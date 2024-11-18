async function initGmailInfo() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Gmail AI Features</h2>
      
      <div class="features-list">
        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">edit_note</span>
            <h3>Smart Compose</h3>
          </div>
          <p>Generate professional emails with AI assistance:</p>
          <ul>
            <li>Choose from multiple writing tones</li>
            <li>Select desired email length (short/medium/long)</li>
            <li>Perfect for various email types</li>
            <li>Copy generated text to your email</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">reply</span>
            <h3>Auto Reply</h3>
          </div>
          <p>Generate contextual email replies:</p>
          <ul>
            <li>Automatically analyzes email content</li>
            <li>Creates appropriate responses</li>
            <li>Maintains professional tone</li>
            <li>Quick and efficient replies</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">summarize</span>
            <h3>Email Summary</h3>
          </div>
          <p>Get quick summaries of long emails:</p>
          <ul>
            <li>Extract key points from emails</li>
            <li>Identify important information</li>
            <li>Save time reading long threads</li>
            <li>Focus on essential content</li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">translate</span>
            <h3>Translation</h3>
          </div>
          <p>Translate email content:</p>
          <ul>
            <li>English ↔ Spanish translation</li>
            <li>English ↔ Japanese translation</li>
            <li>Preserve email formatting</li>
            <li>Quick language switching</li>
          </ul>
        </div>

        <div class="feature-card highlight-card">
          <div class="feature-header">
            <span class="material-icons">tips_and_updates</span>
            <h3>How to Use</h3>
          </div>
          <p>Quick tips for using AI features:</p>
          <ul>
            <li>Select text in emails to see AI options</li>
            <li>Click the ✨ icon to access features</li>
            <li>Choose desired feature from the menu</li>
            <li>Copy results back to your email</li>
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
      transition: all 0.2s ease;
    }

    .feature-card:hover {
      box-shadow: 0 2px 4px rgba(0,0,0,0.05);
      transform: translateY(-1px);
    }

    .highlight-card {
      background: #f8fafc;
      border: 1px solid #94a3b8;
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
    window.location.reload();
  });
}

export { initGmailInfo }; 