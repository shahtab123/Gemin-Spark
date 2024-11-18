import { AsciiTable3 } from './ascii-table3.js';

async function initDocumentInsights() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Document Insights</h2>
      
      <div class="input-group">
        <label for="inputText">Document Text</label>
        <textarea 
          id="inputText"
          class="compose-input input-text" 
          placeholder="Paste your document content here..."
          rows="6"></textarea>
      </div>

      <div class="insights-options">
        <label class="options-label">Analysis Focus</label>
        <div class="options-grid">
          <button class="insight-option active" data-type="key-points">
            <span class="material-icons">stars</span>
            Key Points
          </button>
          <button class="insight-option" data-type="action-items">
            <span class="material-icons">task_alt</span>
            Action Items
          </button>
          <button class="insight-option" data-type="recommendations">
            <span class="material-icons">tips_and_updates</span>
            Recommendations
          </button>
          <button class="insight-option" data-type="summary">
            <span class="material-icons">summarize</span>
            Summary
          </button>
        </div>
      </div>

      <button class="analyze-button">
        <span class="material-icons">analytics</span>
        Generate Insights
      </button>

      <div class="output-container">
        <div class="output-header">
          <label>Generated Insights</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Insights will appear here...</div>
      </div>
    </div>
    <script src="https://cdn.jsdelivr.net/npm/ascii-table3@0.9.0/dist/ascii-table3.min.js"></script>
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

    .input-group {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.375rem;
      margin-bottom: 1rem;
    }

    .input-group label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
      margin-bottom: 0.25rem;
      display: block;
    }

    .input-text {
      min-height: 80px !important;
      max-height: 200px;
      width: 100%;
      padding: 0.625rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      font-size: 0.875rem;
      line-height: 1.5;
      resize: vertical;
      transition: border-color 0.15s ease;
      margin: 0;
    }

    .insights-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .options-label {
      font-size: 0.875rem;
      font-weight: 500;
      color: #334155;
    }

    .options-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0.5rem;
    }

    .insight-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: white;
      color: #334155;
      font-size: 0.875rem;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .insight-option:hover {
      background: #f8fafc;
    }

    .insight-option.active {
      background: #4a5568;
      color: white;
      border-color: #4a5568;
    }

    .insight-option .material-icons {
      font-size: 1.25rem;
    }

    .analyze-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.375rem;
      padding: 0.5rem 1rem;
      background: #4a5568;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.15s ease;
      margin: 0.75rem auto;
      min-width: 150px;
    }

    .analyze-button:hover {
      background: #2d3748;
    }

    .output-container {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .output-box {
      min-height: 150px;
      max-height: 300px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.375rem;
      background: #f8fafc;
      font-size: 0.875rem;
      line-height: 1.5;
      overflow-y: auto;
      overflow-x: hidden;
      white-space: pre-wrap;
      word-wrap: break-word;
      word-break: break-word;
    }

    .copy-button {
      padding: 0.25rem;
      background: transparent;
      border: none;
      border-radius: 0.25rem;
      color: #64748b;
      cursor: pointer;
      transition: all 0.15s ease;
    }

    .copy-button:hover {
      background: #f1f5f9;
      color: #334155;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./docs.js').then(module => {
      module.showDocsFeatures();
    });
  });

  // Add insight option selection
  document.querySelectorAll('.insight-option').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.insight-option').forEach(btn => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
  });

  // Add copy button functionality
  document.querySelector('#copyButton').addEventListener('click', async () => {
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');
    const icon = copyButton.querySelector('.material-icons');
    
    try {
      await navigator.clipboard.writeText(outputBox.textContent);
      icon.textContent = 'check';
      copyButton.classList.add('success');
      
      setTimeout(() => {
        icon.textContent = 'content_copy';
        copyButton.classList.remove('success');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });

  // Add analyze button functionality
  document.querySelector('.analyze-button').addEventListener('click', async () => {
    const inputText = document.querySelector('#inputText').value;
    const insightType = document.querySelector('.insight-option.active').dataset.type;
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');

    if (!inputText.trim()) {
      outputBox.textContent = 'Please enter some text to analyze.';
      return;
    }

    try {
      console.log('🚀 Starting document analysis...');
      outputBox.textContent = 'Analyzing...';

      if (insightType === 'summary') {
        // Use Summarization API for summary
        await generateSummary(inputText, outputBox);
      } else {
        // Use Prompt API for other insight types
        await generateInsights(inputText, insightType, outputBox);
      }

      copyButton.style.display = 'block';

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      outputBox.textContent = `Error: ${error.message}. Please ensure you have Chrome 122+ and experimental features enabled in chrome://flags`;
    }
  });

  // Function to generate summary using Summarization API
  async function generateSummary(text, outputBox) {
    try {
      if (!window.ai || !window.ai.summarizer) {
        throw new Error('AI Summarization is not supported in this browser');
      }

      const canSummarize = await window.ai.summarizer.capabilities();
      if (canSummarize.available === 'no') {
        throw new Error('AI Summarization is not available');
      }

      const session = await window.ai.summarizer.create();
      if (canSummarize.available === 'after-download') {
        await session.ready;
      }

      const summary = await session.summarize(text);
      
      // Format the summary
      const formattedSummary = summary
        .split(/\r?\n/)  // Split into lines
        .filter(line => line.trim())  // Remove empty lines
        .map(line => line.trim())  // Trim each line
        .join('\n\n');  // Join with double line breaks for paragraphs

      outputBox.textContent = formattedSummary;
      session.destroy();

    } catch (error) {
      throw new Error(`Summary generation failed: ${error.message}`);
    }
  }

  // Function to generate insights using Prompt API
  async function generateInsights(text, insightType, outputBox) {
    const capabilities = await window.ai.languageModel.capabilities();
    if (capabilities.available === "no") {
      throw new Error('Language Model is not available on this device');
    }

    // Define insight type prompts
    const insightPrompts = {
      'key-points': `Extract key points from this text.
                    Format your response as follows:

                    Main Points:
                    1. [First key point]
                       • Supporting detail
                       • Additional context

                    2. [Second key point]
                       • Supporting detail
                       • Additional context

                    Important: Use only numbered points and bullet points, no tables.`,
      
      'action-items': `List the main action items from this text.
                      Format your response as follows:

                      High Priority:
                      • [Action Item] - [Brief one-line description] (Timeline: [Duration])

                      Medium Priority:
                      • [Action Item] - [Brief one-line description] (Timeline: [Duration])

                      Important:
                      - Keep each item to one line
                      - Use simple bullet points
                      - Include only essential details
                      - Group by priority
                      - Keep descriptions brief
                      - No complex formatting or nested lists`,
      
      'recommendations': `Provide recommendations based on this text.
                         Format your response as follows:

                         Primary Recommendations:
                         1. [Main Recommendation]
                             • Rationale: [Why]
                             • Implementation: [How]
                             • Expected Impact: [Result]

                         Additional Suggestions:
                         2. [Secondary Recommendation]
                             • Rationale: [Why]
                             • Implementation: [How]
                             • Expected Impact: [Result]

                         Important: Use only numbered lists and bullet points, no tables.`
    };

    const session = await window.ai.languageModel.create();
    const stream = await session.promptStreaming(
      `Analyze this text and provide insights:
       
       Text to analyze:
       "${text}"
       
       Type of analysis: ${insightType}
       ${insightPrompts[insightType]}
       
       Important Guidelines:
       - Use tables for structured data with clear relationships
       - Use bullet points for simple lists
       - Ensure tables are properly formatted with | separators
       - Include header rows and separators in tables
       - Keep content well-organized and easy to read
       - Use appropriate formatting based on the content type
       - Maintain consistent spacing and alignment
       
       Note: If using tables, follow this format exactly:
       | Header 1 | Header 2 | Header 3 |`
    );

    // Handle streaming response
    outputBox.textContent = '';
    let previousLength = 0;
    
    for await (const chunk of stream) {
      const newContent = chunk.slice(previousLength);
      const formattedContent = formatOutput(outputBox.textContent + newContent);
      outputBox.textContent = formattedContent;
      previousLength = chunk.length;
    }

    session.destroy();
  }

  // Update the formatting function
  function formatOutput(text) {
    // Clean up the text
    text = text
      .replace(/\|/g, '')         // Remove table characters
      .replace(/\*\*/g, '')       // Remove bold markers
      .replace(/[-]{3,}/g, '')    // Remove separator lines
      .replace(/\n{3,}/g, '\n\n') // Reduce multiple line breaks
      .trim();

    // Process line by line
    const lines = text.split('\n');
    let formattedLines = [];
    let isHeader = false;

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Handle headers (ends with ':')
      if (line.endsWith(':')) {
        if (formattedLines.length > 0) {
          formattedLines.push(''); // Add space before new section
        }
        formattedLines.push(line);
        isHeader = true;
        continue;
      }

      // Format numbered items and bullet points
      if (/^\d+\./.test(line)) {
        // Add space before new numbered item
        if (formattedLines.length > 0 && !isHeader) {
          formattedLines.push('');
        }
        isHeader = false;
      } else if (line.startsWith('-') || line.startsWith('•')) {
        line = '  • ' + line.substring(1).trim(); // Indent bullet points
        isHeader = false;
      }

      formattedLines.push(line);
    }

    return formattedLines.join('\n');
  }
}

export { initDocumentInsights }; 