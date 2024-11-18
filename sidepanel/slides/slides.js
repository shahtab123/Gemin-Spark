async function showSlidesFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="feature-container">
      <h2 class="feature-title">Google Slides AI Features</h2>
      
      <button class="menu-button feature-button">
        <span class="material-icons">view_carousel</span>
        Slide Content Generator
      </button>

      <button class="menu-button feature-button">
        <span class="material-icons">format_list_bulleted</span>
        Presentation Outline Creator
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
      if (featureText.includes('Slide Content Generator')) {
        import('./slidecontentgen.js').then(module => {
          module.initContentGenerator();
        });
      } else if (featureText.includes('Presentation Outline')) {
        import('./outlineCreator.js').then(module => {
          module.initOutlineCreator();
        });
      } else if (featureText.includes('Speaker Notes')) {
        import('./notesGenerator.js').then(module => {
          module.initNotesGenerator();
        });
      } else if (featureText.includes('Slide-to-Blog')) {
        import('./blogConverter.js').then(module => {
          module.initBlogConverter();
        });
      } else if (featureText.includes('Info')) {
        import('./slidesInfo.js').then(module => {
          module.initSlidesInfo();
        });
      }
    });
  });
}

export { showSlidesFeatures }; 