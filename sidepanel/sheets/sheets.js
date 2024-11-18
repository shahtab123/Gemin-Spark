async function showSheetsFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="feature-container">
      <h2 class="feature-title">Google Sheets AI Features</h2>
      
      <button class="menu-button feature-button">
        <span class="material-icons">functions</span>
        Generate Formula
      </button>

      <button class="menu-button feature-button">
        <span class="material-icons">psychology</span>
        Formula Explainer
      </button>

      <button class="menu-button feature-button">
        <span class="material-icons">info</span>
        Info
      </button>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .feature-container {
      margin-top: 0.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .feature-title {
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

    .feature-button {
      width: 100%;
      margin: 0.5rem 0;
      justify-content: flex-start;
      padding: 1rem;
      transition: background-color 0.2s ease;
    }

    .feature-button:hover {
      background: #f1f5f9;
    }

    .back-button {
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      margin-bottom: 1rem;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.reload();
  });

  // Handle feature button clicks
  document.querySelectorAll('.feature-button').forEach(button => {
    button.addEventListener('click', () => {
      const featureText = button.textContent.trim();
      if (featureText.includes('Generate Formula')) {
        import('./generateFormula.js').then(module => {
          module.initGenerateFormula();
        });
      } else if (featureText.includes('Formula Explainer')) {
        import('./formulaExplainer.js').then(module => {
          module.initFormulaExplainer();
        });
      } else if (featureText.includes('Info')) {
        import('./sheetsInfo.js').then(module => {
          module.initSheetsInfo();
        });
      }
    });
  });
}

export { showSheetsFeatures }; 