export function showOtherToolsFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="tools-container">
      <button class="tool-button" id="tabSummarizer">
        <span class="material-icons">summarize</span>
        Tab Summarizer
      </button>
      
      <button class="tool-button" id="rightClickSummarizer">
        <span class="material-icons">mouse</span>
        Right-Click Summarizer
      </button>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .tools-container {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      padding: 1rem;
    }

    .tool-button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 1rem;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      cursor: pointer;
      transition: all 0.2s;
      font-size: 1rem;
      color: #374151;
    }

    .tool-button:hover {
      background: #f3f4f6;
      transform: translateY(-2px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .tool-button .material-icons {
      font-size: 1.5rem;
      color: #2563eb;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.reload();
  });

  // Add click handlers for each tool
  document.getElementById('tabSummarizer').addEventListener('click', async () => {
    try {
      const module = await import('./tabSummarizer/tabSummarizer.js');
      module.showTabSummarizerFeatures();
    } catch (error) {
      console.error('Error loading Tab Summarizer:', error);
    }
  });

  document.getElementById('rightClickSummarizer').addEventListener('click', async () => {
    const module = await import('./rightClickSummarizer/rightClickSummarizer.js');
    module.showRightClickSummarizerFeatures();
  });
} 