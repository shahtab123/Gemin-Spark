async function initAIWriter() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">AI Writer</h2>
      
      <div class="input-group">
        <label for="prompt">What would you like to write about?</label>
        <textarea 
          id="prompt"
          class="compose-input" 
          placeholder="E.g., Write a detailed project proposal for a new mobile app"></textarea>
      </div>

      <div class="options-row">
        <div class="input-group half">
          <label for="tone">Select Tone</label>
          <select id="tone" class="compose-select">
            <option value="academic">Academic</option>
            <option value="technical">Technical</option>
            <option value="business">Business</option>
            <option value="creative">Creative</option>
            <option value="instructional">Instructional</option>
          </select>
        </div>

        <div class="input-group half">
          <label for="wordLimit">Word Limit</label>
          <input 
            type="number" 
            id="wordLimit" 
            class="compose-input word-limit" 
            placeholder="Enter word limit"
            min="50"
            max="2000"
            value="500"
          >
        </div>
      </div>

      <button class="menu-button compose-button">
        <span class="material-icons">edit</span>
        <span class="button-text">Generate</span>
      </button>

      <div class="input-group">
        <div class="output-header">
          <label>Generated Content</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Your generated content will appear here...</div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .compose-container {
      margin-top: 0.25rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;
    }

    .compose-title {
      text-align: center;
      margin: 0 0 1.5rem 0;
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
      margin-bottom: 1rem;
    }

    .options-row {
      display: flex;
      gap: 1rem;
      width: 100%;
      margin-bottom: 1rem;
    }

    .half {
      flex: 1;
      margin-bottom: 0;
    }

    .input-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    .compose-input {
      width: 100%;
      height: 60px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      resize: vertical;
      font-size: 0.9rem;
      min-height: 60px;
      max-height: 200px;
    }

    .word-limit {
      height: 1.8rem !important;
      min-height: 1.8rem !important;
      padding: 0.25rem !important;
      resize: none;
    }

    .compose-select {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background-color: white;
      font-size: 0.9rem;
    }

    .compose-button {
      background: var(--primary);
      margin: 0.5rem 0;
      justify-content: center;
      width: auto;
      padding: 0.5rem 1.5rem;
      font-size: 0.875rem;
      transition: background-color 0.2s ease;
    }

    .compose-button:hover {
      background: #2d3748;
    }

    .compose-button .material-icons,
    .compose-button .button-text {
      color: white !important;
    }

    .output-box {
      width: 100%;
      height: 200px;
      padding: 0.75rem;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      background-color: #f8fafc;
      font-size: 0.9rem;
      line-height: 1.5;
      overflow-y: auto;
      white-space: pre-wrap;
    }

    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
    }

    .copy-button {
      background: none;
      border: none;
      padding: 4px;
      cursor: pointer;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .copy-button:hover {
      background: #e2e8f0;
    }

    .copy-button .material-icons {
      font-size: 1.25rem;
      color: #4a5568;
    }

    .copy-button.success .material-icons {
      color: #48bb78;
    }

    .word-count {
      font-size: 0.8rem;
      color: #666;
      text-align: right;
      margin-top: 0.5rem;
    }

    .button-group {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }

    .insert-button {
      display: flex;
      align-items: center;
      gap: 0.25rem;
      background: var(--primary);
      color: white;
      border: none;
      padding: 0.25rem 0.5rem;
      border-radius: 0.25rem;
      cursor: pointer;
      font-size: 0.8rem;
      transition: background-color 0.2s ease;
    }

    .insert-button:hover {
      background: #2d3748;
    }

    .insert-button .material-icons {
      font-size: 1rem;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./docs.js').then(module => {
      module.showDocsFeatures();
    });
  });

  // Add generate button functionality
  document.querySelector('.compose-button').addEventListener('click', async () => {
    const prompt = document.querySelector('#prompt').value;
    const tone = document.querySelector('#tone').value;
    const wordLimit = document.querySelector('#wordLimit').value;
    const outputBox = document.querySelector('#outputBox');
    
    // Remove any existing word count display
    const existingWordCount = document.querySelector('.word-count');
    if (existingWordCount) {
      existingWordCount.remove();
    }
    
    try {
      console.log('🚀 Starting document generation...');
      outputBox.textContent = 'Starting...';
      
      const capabilities = await window.ai.languageModel.capabilities();
      console.log('📊 AI Capabilities:', capabilities);

      if (capabilities.available === "no") {
        throw new Error('Language Model is not available on this device');
      }

      console.log('💫 Creating AI session...');
      const session = await window.ai.languageModel.create();

      // Define tone-specific formatting
      const toneFormats = {
        academic: `Format Guidelines for Academic Writing:
          - Start with a clear thesis statement
          - Organize into proper academic paragraphs
          - Use formal academic language and terminology
          - Include topic sentences for each paragraph
          - Cite relevant information (if applicable)
          - Conclude by restating the thesis and summarizing key points
          - Avoid bullet points or informal formatting
          - Strictly maintain ${wordLimit} word limit`,

        technical: `Format Guidelines for Technical Writing:
          - Begin with a clear technical overview
          - Define key technical terms
          - Use precise, technical language
          - Organize into logical sections
          - Include specific details and specifications
          - Use numbered steps for processes
          - Conclude with technical implications
          - Strictly maintain ${wordLimit} word limit`,

        business: `Format Guidelines for Business Writing:
          - Start with an executive summary approach
          - Present clear business context
          - Use professional business terminology
          - Focus on key metrics and outcomes
          - Include actionable insights
          - Organize in clear business sections
          - End with recommendations or next steps
          - Strictly maintain ${wordLimit} word limit`,

        creative: `Format Guidelines for Creative Writing:
          - Begin with an engaging hook
          - Use descriptive language
          - Develop a clear narrative flow
          - Include sensory details
          - Create vivid imagery
          - Maintain consistent style
          - End with a meaningful conclusion
          - Strictly maintain ${wordLimit} word limit`,

        instructional: `Format Guidelines for Instructional Writing:
          - Start with clear learning objectives
          - Present information in logical sequence
          - Use clear, step-by-step explanations
          - Include practical examples
          - Break down complex concepts
          - Provide clear guidance
          - End with summary of key points
          - Strictly maintain ${wordLimit} word limit`
      };

      console.log('💭 Sending prompt to AI...');
      
      const stream = await session.promptStreaming(
        `Write a document about: ${prompt}
         
         ${toneFormats[tone]}
         
         Additional Requirements:
         - Strictly adhere to the ${wordLimit} word limit
         - Follow proper paragraph structure
         - Use appropriate transitions between ideas
         - Maintain consistent formatting throughout
         - Ensure proper grammar and punctuation`
      );

      // Handle streaming response
      outputBox.textContent = '';
      let previousLength = 0;
      
      for await (const chunk of stream) {
        const newContent = chunk.slice(previousLength);
        outputBox.textContent += newContent;
        previousLength = chunk.length;
      }

      // Show copy button
      document.querySelector('#copyButton').style.display = 'block';
      
      // Add word count
      const wordCount = outputBox.textContent.trim().split(/\s+/).length;
      outputBox.insertAdjacentHTML('afterend', 
        `<div class="word-count">Word count: ${wordCount} / ${wordLimit}</div>`
      );

      session.destroy();

    } catch (error) {
      console.error('❌ Document generation failed:', error);
      outputBox.textContent = `Error: ${error.message}. Please ensure you have Chrome 122+ and experimental features enabled in chrome://flags`;
    }
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
}

export { initAIWriter }; 