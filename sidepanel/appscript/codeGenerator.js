async function initCodeGenerator() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="code-generator-container">
      <h2 class="feature-title">Apps Script Code Generator</h2>
      
      <form id="codeGeneratorForm" class="generator-form">
        <div class="form-group">
          <label for="taskDescription">Task Description</label>
          <textarea 
            id="taskDescription" 
            placeholder="Describe what you want the script to do (e.g., 'Send an email every Monday with spreadsheet data')"
            required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group flex-1">
            <label for="scriptType">Script Type</label>
            <select id="scriptType">
              <option value="standalone">Standalone Script</option>
              <option value="sheets">Google Sheets</option>
              <option value="docs">Google Docs</option>
              <option value="forms">Google Forms</option>
              <option value="gmail">Gmail</option>
              <option value="calendar">Calendar</option>
            </select>
          </div>

          <div class="form-group flex-1">
            <label for="complexity">Code Complexity</label>
            <select id="complexity">
              <option value="basic">Basic</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="additionalFeatures">Additional Features</label>
          <div class="checkbox-group">
            <label class="checkbox-label">
              <input type="checkbox" id="errorHandling"> Error Handling
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="logging"> Logging
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="documentation"> Documentation
            </label>
            <label class="checkbox-label">
              <input type="checkbox" id="testing"> Unit Tests
            </label>
          </div>
        </div>

        <button type="submit" class="generate-button">
          <span class="material-icons">code</span>
          Generate Code
        </button>
      </form>

      <div id="generatedContent" class="generated-content">
        <div class="output-header">
          <h3>Generated Code</h3>
          <div class="output-actions">
            <button id="copyCode" class="icon-button" title="Copy Code">
              <span class="material-icons">content_copy</span>
            </button>
            <button id="downloadCode" class="icon-button" title="Download as .gs">
              <span class="material-icons">download</span>
            </button>
          </div>
        </div>
        <div class="output-container">
          <pre id="codeOutput" class="code-output">// Your generated code will appear here...</pre>
        </div>
      </div>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .code-generator-container {
      padding: 1rem;
      width: 100%;
    }

    .generator-form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 1rem;
    }

    .flex-1 {
      flex: 1;
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

    .form-group textarea {
      min-height: 100px;
      resize: vertical;
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

    .checkbox-group {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      padding: 0.5rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      background-color: #f9fafb;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.875rem;
      color: #4b5563;
      padding: 0.5rem;
      border-radius: 0.25rem;
      transition: background-color 0.2s;
    }

    .checkbox-label:hover {
      background-color: #f3f4f6;
    }

    .checkbox-label input[type="checkbox"] {
      width: 1rem;
      height: 1rem;
      margin: 0;
      cursor: pointer;
      accent-color: #2563eb;
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
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      overflow: hidden;
    }

    .output-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background-color: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
    }

    .output-header h3 {
      margin: 0;
      font-size: 1rem;
      color: #1f2937;
    }

    .output-actions {
      display: flex;
      gap: 0.5rem;
    }

    .icon-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: none;
      border: 1px solid #e5e7eb;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .icon-button:hover {
      background-color: #f3f4f6;
    }

    .output-container {
      max-height: 500px;
      overflow-y: auto;
      background-color: #1f2937;
    }

    .code-output {
      margin: 0;
      padding: 1rem;
      font-family: 'Courier New', monospace;
      font-size: 0.875rem;
      line-height: 1.5;
      color: #e5e7eb;
      white-space: pre-wrap;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./appscript.js').then(module => {
      module.showAppScriptFeatures();
    });
  });

  // Handle form submission
  document.getElementById('codeGeneratorForm').addEventListener('submit', handleCodeGeneration);

  // Handle copy button
  document.getElementById('copyCode').addEventListener('click', async () => {
    const code = document.getElementById('codeOutput').textContent;
    try {
      await navigator.clipboard.writeText(code);
      const button = document.getElementById('copyCode');
      const icon = button.querySelector('.material-icons');
      icon.textContent = 'check';
      setTimeout(() => {
        icon.textContent = 'content_copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  });

  // Handle download button
  document.getElementById('downloadCode').addEventListener('click', () => {
    const code = document.getElementById('codeOutput').textContent;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.gs';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
}

async function handleCodeGeneration(e) {
  e.preventDefault();
  const codeOutput = document.getElementById('codeOutput');
  const complexity = document.getElementById('complexity').value;
  
  // Show warning for intermediate/advanced code
  if (complexity !== 'basic') {
    alert('Note: Gemini Nano works best with basic Apps Script code. For intermediate and advanced code, it may provide inconsistent or incorrect results. Please review and test generated code carefully.');
  }
  
  try {
    // Show loading state
    const generateButton = e.target.querySelector('.generate-button');
    generateButton.disabled = true;
    generateButton.innerHTML = '<span class="material-icons">hourglass_empty</span> Generating...';

    // Hide action buttons initially
    document.getElementById('copyCode').style.display = 'none';
    document.getElementById('downloadCode').style.display = 'none';

    // Get form data
    const taskDescription = document.getElementById('taskDescription').value;
    const scriptType = document.getElementById('scriptType').value;
    const errorHandling = document.getElementById('errorHandling').checked;
    const logging = document.getElementById('logging').checked;
    const documentation = document.getElementById('documentation').checked;
    const testing = document.getElementById('testing').checked;

    // Create the prompt with more detailed structure
    const prompt = `Generate Google Apps Script code to ${taskDescription}

Requirements:

1. The script must use only official Google Apps Script services and methods for ${scriptType}
2. Complexity level: ${complexity}
3. Follow these specific Apps Script guidelines:
   - Use GmailApp for email operations
   - Use SpreadsheetApp for spreadsheet operations
   - Use DriveApp for file operations
   - Use CalendarApp for calendar operations
   - Use proper method calls like GmailApp.sendEmail() instead of invalid methods
   - Use correct service methods as documented in https://developers.google.com/apps-script/reference
4. Code must be production-ready and follow Apps Script best practices
${errorHandling ? '5. Include comprehensive error handling with try-catch blocks and error logging' : ''}
${logging ? '6. Implement Logger.log() statements for debugging key operations' : ''}
${documentation ? '7. Add detailed JSDoc comments for all functions and parameters' : ''}
${testing ? '8. Include example test functions to validate the main functionality' : ''}

Expected Behavior:
- Use only valid Apps Script methods and properties
- Handle edge cases and invalid inputs
- Follow Google Apps Script naming conventions
- Implement efficient and maintainable code structure
- Ensure all service calls are valid and documented

Important: 
1. Return only the raw Apps Script code without any markdown formatting or code block markers
2. The code should be ready to paste directly into the Apps Script editor
3. Use only methods that exist in the official Apps Script documentation
4. Do not invent or use non-existent methods or properties`;

    // Use the language model
    const session = await window.ai.languageModel.create();
    const stream = await session.promptStreaming(prompt);
    
    // Clear previous content
    codeOutput.textContent = '';
    let previousContent = '';

    // Process the stream
    for await (const chunk of stream) {
      const newContent = chunk.slice(previousContent.length);
      // Remove any markdown code block markers and language tags
      const cleanedContent = newContent
        .replace(/```javascript\n?/g, '')
        .replace(/```\n?/g, '')
        .replace(/```js\n?/g, '')
        .replace(/```apps-script\n?/g, '');
      codeOutput.textContent += cleanedContent;
      previousContent = chunk;
      
      // Auto-scroll
      codeOutput.scrollTop = codeOutput.scrollHeight;
    }

    // Cleanup
    session.destroy();

    // Show action buttons after successful generation
    document.getElementById('copyCode').style.display = 'block';
    document.getElementById('downloadCode').style.display = 'block';

  } catch (error) {
    console.error('Error generating code:', error);
    codeOutput.textContent = `// Error: ${error.message || 'Failed to generate code. Please try again.'}`;
  } finally {
    // Reset button state
    const generateButton = e.target.querySelector('.generate-button');
    generateButton.disabled = false;
    generateButton.innerHTML = '<span class="material-icons">code</span> Generate Code';
  }
}

export { initCodeGenerator }; 