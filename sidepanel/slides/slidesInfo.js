async function initSlidesInfo() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Slides AI Features</h2>
      
      <div class="features-list">
        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">view_carousel</span>
            <h3>Slide Content Generator</h3>
          </div>
          <p>Generate professional slide content:</p>
          <ul>
            <li>Enter your presentation topic</li>
            <li>Choose target audience for appropriate tone</li>
            <li>Select presentation style (Professional/Casual/Educational/Creative)</li>
            <li>Specify number of slides needed</li>
            <li>Add key points to be included</li>
          </ul>
          <p class="usage-note">💡 Best for: Creating initial slide content and structure</p>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">format_list_bulleted</span>
            <h3>Presentation Outline Creator</h3>
          </div>
          <p>Create structured presentation outlines:</p>
          <ul>
            <li>Set presentation duration in minutes</li>
            <li>Choose outline depth (Basic/Detailed/Comprehensive)</li>
            <li>Get time allocations for each section</li>
            <li>Receive suggested transitions between sections</li>
            <li>Visual suggestions for each section</li>
          </ul>
          <p class="usage-note">💡 Best for: Planning presentation flow and timing</p>
        </div>

        <div class="feature-card highlight-card">
          <div class="feature-header">
            <span class="material-icons">tips_and_updates</span>
            <h3>How to Use</h3>
          </div>
          <p>Quick guide for using Slides AI features:</p>
          <ul>
            <li><strong>For Content Generation:</strong>
              <ul>
                <li>Select "Slide Content Generator"</li>
                <li>Fill in topic and preferences</li>
                <li>Click "Generate Content"</li>
                <li>Copy generated content to your slides</li>
              </ul>
            </li>
            <li><strong>For Outline Creation:</strong>
              <ul>
                <li>Select "Presentation Outline Creator"</li>
                <li>Set duration and depth</li>
                <li>Add any specific requirements</li>
                <li>Click "Generate Outline"</li>
              </ul>
            </li>
          </ul>
        </div>

        <div class="feature-card">
          <div class="feature-header">
            <span class="material-icons">lightbulb</span>
            <h3>Pro Tips</h3>
          </div>
          <p>Get the most out of Slides AI:</p>
          <ul>
            <li>Start with an outline for better structure</li>
            <li>Use generated content as a starting point</li>
            <li>Customize style based on your audience</li>
            <li>Add your own examples and context</li>
            <li>Review and edit AI suggestions</li>
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

    .feature-card ul ul {
      margin: 0.25rem 0;
    }

    .usage-note {
      margin-top: 0.75rem;
      padding: 0.5rem;
      background: #f1f5f9;
      border-radius: 0.25rem;
      font-style: italic;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./slides.js').then(module => {
      module.showSlidesFeatures();
    });
  });
}

export { initSlidesInfo }; 