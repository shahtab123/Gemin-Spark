async function initOutlineCreator() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="outline-creator-container">
      <h2 class="feature-title">Presentation Outline Creator</h2>
      
      <form id="outlineForm" class="outline-form">
        <div class="form-group">
          <label for="topic">Presentation Topic</label>
          <input type="text" id="topic" required placeholder="Enter your presentation topic">
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label for="duration">Duration (minutes)</label>
            <input type="number" id="duration" min="5" max="180" value="30">
          </div>

          <div class="form-group flex-1">
            <label for="outlineDepth">Outline Depth</label>
            <select id="outlineDepth">
              <option value="basic">Basic (Main points)</option>
              <option value="detailed">Detailed (With sub-points)</option>
              <option value="comprehensive">Comprehensive</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="additionalNotes">Additional Notes (Optional)</label>
          <textarea id="additionalNotes" class="resizable-input" placeholder="Enter any specific requirements or points to include..."></textarea>
        </div>

        <button type="submit" class="generate-button">
          <span class="material-icons">format_list_bulleted</span>
          Generate Outline
        </button>
      </form>

      <div id="generatedContent" class="generated-content">
        <h3>Generated Outline</h3>
        <div id="outputContainer" class="output-container">
          <div id="outlineContent" class="slide-content"></div>
        </div>
        <button id="copyButton" class="copy-button">
          <span class="material-icons">content_copy</span>
        </button>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .outline-creator-container {
      padding: 1rem;
      width: 100%;
    }

    .outline-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #4b5563;
    }

    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      font-size: 0.875rem;
      width: 100%;
    }

    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }

    .generate-button {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.75rem;
      background-color: #2563eb;
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .generate-button:hover {
      background-color: #1d4ed8;
    }

    .generated-content {
      margin-top: 2rem;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
    }

    .output-container {
      margin: 1rem 0;
      max-height: 500px;
      overflow-y: auto;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      background-color: #ffffff;
    }

    .slide-content {
      padding: 1rem;
      white-space: pre-wrap;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1.6;
    }

    .copy-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      margin-top: 1rem;
      background-color: #f3f4f6;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      width: auto;
    }

    .copy-button:hover {
      background-color: #e5e7eb;
    }

    .outline-section {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1a365d;
      margin: 2rem 0 1rem;
      border-bottom: 2px solid #e2e8f0;
      padding-bottom: 0.5rem;
    }

    .outline-subsection {
      font-size: 1.25rem;
      font-weight: 500;
      color: #2c5282;
      margin: 1.5rem 0 1rem;
    }

    .timing-note {
      color: #047857;
      font-style: italic;
      margin: 0.75rem 0;
      padding: 0.5rem;
      background-color: #f0fdf4;
      border-left: 4px solid #059669;
    }

    .transition-note {
      color: #1e40af;
      font-style: italic;
      margin: 0.75rem 0;
      padding: 0.5rem;
      background-color: #eff6ff;
      border-left: 4px solid #3b82f6;
    }

    .visual-note {
      color: #0f766e;
      margin: 0.75rem 0;
      padding: 0.5rem;
      background-color: #f0fdfa;
      border-left: 4px solid #14b8a6;
    }

    .slide-content ul {
      margin: 0.75rem 0 0.75rem 1.5rem;
      list-style-type: disc;
    }

    .slide-content li {
      margin: 0.5rem 0;
      line-height: 1.6;
    }

    .form-group textarea.resizable-input {
      min-height: 38px;  /* Same height as regular inputs */
      max-height: 150px; /* Maximum height when expanded */
      resize: vertical;
      overflow-y: hidden;
      line-height: 1.5;
      padding: 8px 12px;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./slides.js').then(module => {
      module.showSlidesFeatures();
    });
  });

  // Handle form submission
  document.getElementById('outlineForm').addEventListener('submit', handleOutlineGeneration);

  // Handle copy button
  document.getElementById('copyButton').addEventListener('click', async () => {
    const content = document.getElementById('outlineContent').textContent;
    try {
      await navigator.clipboard.writeText(content);
      const copyButton = document.getElementById('copyButton');
      const originalText = copyButton.innerHTML;
      copyButton.innerHTML = '<span class="material-icons">check</span>';
      setTimeout(() => {
        copyButton.innerHTML = originalText;
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  });

  // Add this JavaScript after the form is initialized
  document.getElementById('additionalNotes').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = (this.scrollHeight) + 'px';
  });

  // Reset height when form is submitted
  document.getElementById('outlineForm').addEventListener('reset', function() {
    document.getElementById('additionalNotes').style.height = '38px';
  });
}

async function handleOutlineGeneration(e) {
  e.preventDefault();
  const outlineContent = document.getElementById('outlineContent');
  const warning = document.createElement('div');
  warning.id = 'warning';
  warning.style.color = 'red';
  warning.style.marginTop = '1rem';
  
  try {
    // Show loading state
    const generateButton = e.target.querySelector('.generate-button');
    generateButton.disabled = true;
    generateButton.innerHTML = '<span class="material-icons">hourglass_empty</span> Generating...';

    // Get form data
    const topic = document.getElementById('topic').value;
    const duration = document.getElementById('duration').value;
    const depth = document.getElementById('outlineDepth').value;
    const additionalNotes = document.getElementById('additionalNotes').value;

    // Create the prompt text
    const promptText = `Create a presentation outline for ${duration} minutes about "${topic}".
${additionalNotes ? `Consider these points: ${additionalNotes}` : ''}

Use this simple format:
Slide 1: Title
- Main title
- Subtitle or tagline
- Visual suggestion

Slide 2: Introduction
- Opening point
- Key messages
- Visual elements

Slide 3: Main Content
- Key point 1
- Supporting details
- Visual elements

Slide 4: Conclusion
- Summary
- Call to action
- Final visual

Note: Total time should be ${duration} minutes. Use simple bullet points, no special formatting.`;

    // Use the same approach as slidecontentgen.js
    const session = await window.ai.languageModel.create();
    const stream = await session.promptStreaming(promptText);
    
    // Clear previous content
    outlineContent.innerHTML = '';
    let previousContent = '';

    // Make sure the generated content container is visible
    const generatedContent = document.getElementById('generatedContent');
    generatedContent.style.display = 'block';

    // Process the stream
    for await (const chunk of stream) {
      const newContent = chunk.slice(previousContent.length);
      const formattedText = formatOutlineToHTML(outlineContent.innerHTML + newContent);
      outlineContent.innerHTML = formattedText;
      previousContent = chunk;
      
      // Auto-scroll to show new content
      outlineContent.scrollTop = outlineContent.scrollHeight;
    }

    // Cleanup
    session.destroy();

    // Show copy button (no more download button in new structure)
    const copyButton = document.getElementById('copyButton');
    copyButton.style.display = 'block';

  } catch (error) {
    console.error('Error generating outline:', error);
    warning.textContent = `Error: ${error.message || 'Failed to generate outline. Please try again.'}`;
    outlineContent.parentNode.insertBefore(warning, outlineContent);
  } finally {
    // Reset button state
    const generateButton = e.target.querySelector('.generate-button');
    generateButton.disabled = false;
    generateButton.innerHTML = '<span class="material-icons">format_list_bulleted</span> Generate Outline';
  }
}

// Helper function to format the outline text to HTML
function formatOutlineToHTML(content) {
  // Clean up the content first
  content = content
    .replace(/\s*\n\s*/g, '\n')  // Clean up spaces around line breaks
    .replace(/([^.!?])\n/g, '$1 ')  // Join lines that don't end with punctuation
    .replace(/:\s+/g, ': ')  // Clean up spaces after colons
    .replace(/\n{3,}/g, '\n\n')  // Replace multiple line breaks
    .replace(/Slide\s+(\d+):/gi, '\nSlide $1:')  // Ensure slide titles start on new line
    .replace(/\*+/g, '')  // Remove asterisks
    .trim();

  const lines = content.split('\n');
  let html = '';
  let inList = false;

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) continue;

    // Handle slide titles
    if (trimmedLine.match(/^Slide \d+:/i)) {
      if (inList) html += '</ul>';
      inList = false;
      html += `<h2>${trimmedLine}</h2>`;
    }
    // Handle bullet points
    else if (trimmedLine.startsWith('-')) {
      if (!inList) {
        html += '<ul>';
        inList = true;
      }
      html += `<li>${trimmedLine.substring(1).trim()}</li>`;
    }
    // Handle regular text
    else {
      if (inList) html += '</ul>';
      inList = false;
      html += `<p>${trimmedLine}</p>`;
    }
  }

  if (inList) html += '</ul>';
  return html;
}

export { initOutlineCreator }; 