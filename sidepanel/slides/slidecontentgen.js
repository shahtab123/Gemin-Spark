async function initContentGenerator() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>

    <div class="content-generator-container">
      <h2 class="feature-title">Slide Content Generator</h2>
      
      <form id="contentGeneratorForm" class="generator-form">
        <div class="form-group">
          <label for="presentationTopic">Presentation Topic</label>
          <input type="text" id="presentationTopic" placeholder="Enter the main topic" required>
        </div>

        <div class="form-group">
          <label for="targetAudience">Target Audience</label>
          <input type="text" id="targetAudience" placeholder="Who is this presentation for?">
        </div>

        <div class="form-group">
          <label for="presentationStyle">Presentation Style</label>
          <select id="presentationStyle">
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="educational">Educational</option>
            <option value="creative">Creative</option>
          </select>
        </div>

        <div class="form-group">
          <label for="numSlides">Number of Slides</label>
          <input type="number" id="numSlides" min="1" max="50" value="10">
        </div>

        <div class="form-group">
          <label for="keyPoints">Key Points (optional)</label>
          <input type="text" id="keyPoints" placeholder="Enter comma-separated key points">
        </div>

        <button type="submit" class="generate-button">
          <span class="material-icons">auto_awesome</span>
          Generate Content
        </button>
      </form>

      <div id="generatedContent" class="generated-content">
        <h3>Generated Slide Content</h3>
        <div id="outputContainer" class="output-container">
          <div id="slideContent" class="slide-content"></div>
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
    .content-generator-container {
      padding: 1rem;
      width: 100%;
    }

    .generator-form {
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

    .slide-content h1 {
      margin: 2rem 0 1.5rem;
    }

    .slide-content h2 {
      margin: 1.5rem 0 1rem;
    }

    .slide-content p {
      margin: 0.75rem 0;
    }

    .slide-content ul {
      margin: 0.75rem 0 0.75rem 1.5rem;
    }

    .slide-content li {
      margin: 0.5rem 0;
    }

    .slide-content .speaker-notes,
    .slide-content .image-suggestion {
      margin: 1rem 0;
    }

    .slide-content > *:not(:last-child) {
      margin-bottom: 1rem;
    }

    .slide-content h2 + ul,
    .slide-content h2 + p {
      margin-top: 0.5rem;
    }

    .slide-content li + li {
      margin-top: 0.25rem;
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
  document.getElementById('contentGeneratorForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const generatedContent = document.getElementById('generatedContent');
    const slideContent = document.getElementById('slideContent');
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
      const topic = document.getElementById('presentationTopic').value;
      const audience = document.getElementById('targetAudience').value;
      const style = document.getElementById('presentationStyle').value;
      const numSlides = document.getElementById('numSlides').value;
      const keyPoints = document.getElementById('keyPoints').value;

      // Check if AI capabilities are available
      const capabilities = await window.ai.languageModel.capabilities();
      if (capabilities.available === "no") {
        throw new Error('Language Model is not available on this device');
      }

      // Create AI session
      const session = await window.ai.languageModel.create();

      // Create prompt for the AI
      const prompt = `Create a detailed ${numSlides}-slide presentation outline about "${topic}" for ${audience} audience in a ${style} style.
      ${keyPoints ? `Include these key points: ${keyPoints.split(',').map(point => point.trim()).join(', ')}` : ''}
      
      Format the output as a clean markdown document with:
      - A title slide
      - Clear slide numbers
      - Bullet points for key content
      - Speaker notes where relevant
      - Suggested visuals/graphics
      
      Make it engaging and well-structured.`;

      // Use streaming for better UX
      const stream = await session.promptStreaming(prompt);
      
      // Clear previous content
      slideContent.innerHTML = '';
      let previousLength = 0;

      // Process the stream
      for await (const chunk of stream) {
        const newContent = chunk.slice(previousLength);
        const formattedText = formatContentToHTML(slideContent.innerHTML + newContent);
        slideContent.innerHTML = formattedText;
        previousLength = chunk.length;
      }

      // Show the generated content
      generatedContent.hidden = false;
      
      // Cleanup
      session.destroy();

      // Reset button state
      generateButton.disabled = false;
      generateButton.innerHTML = '<span class="material-icons">auto_awesome</span> Generate Content';

      // Show the copy button after content is generated
      document.getElementById('copyButton').style.display = 'block';

    } catch (error) {
      console.error('Error generating content:', error);
      warning.textContent = `Error: ${error.message || 'Failed to generate content. Please try again.'}`;
      slideContent.parentNode.insertBefore(warning, slideContent);

      // Hide the copy button if there's an error
      document.getElementById('copyButton').style.display = 'none';
    }
  });

  // Update the formatContentToHTML function for better formatting
  function formatContentToHTML(content) {
    // First, clean up any unwanted line breaks and multiple spaces
    content = content
      .replace(/##\s*(.*?)\s*\n\s*Guide/g, '## $1 Guide')
      .replace(/\n\s*\n\s*\n/g, '\n\n')  // Replace triple line breaks with double
      .replace(/[ \t]+/g, ' ');  // Replace multiple spaces with single space
    
    const lines = content.split('\n');
    let html = '';
    let inList = false;
    let previousType = ''; // Track previous element type

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue; // Skip empty lines
      
      let currentType = '';

      // Handle slide titles (### Slide X:)
      if (trimmedLine.match(/^###\s*\*?\*?Slide\s+\d+:/i)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        currentType = 'slide';
        const slideTitle = trimmedLine.replace(/^###\s*\*?\*?/, '').replace(/\*+$/, '');
        html += `<h1 class="slide-title">${slideTitle}</h1>`;
      }
      // Handle section titles (**Title:** or *Title:* or ## Title)
      else if (trimmedLine.match(/^(\*?\*?Title:|##\s+)/i)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const title = trimmedLine
          .replace(/^(\*?\*?Title:|##\s+)/, '')
          .replace(/\*+$/, '')
          .trim();
        html += `<h2>${title}</h2>`;
      }
      // Handle bullet points - improved regex pattern
      else if (trimmedLine.match(/^[\*\-]\s+(?!\*?Title:|\*?Image:|\*?Speaker Notes:)/i)) {
        if (!inList) {
          html += '<ul>';
          inList = true;
        }
        const bulletPoint = trimmedLine.substring(2)
          .replace(/^\*\*/, '')
          .replace(/\*\*$/, '')
          .trim();
        html += `<li>${bulletPoint}</li>`;
      }
      // Handle speaker notes
      else if (trimmedLine.match(/^\*?\*?Speaker Notes:/i)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const notes = trimmedLine.replace(/^\*?\*?Speaker Notes:\s*/, '').replace(/\*+$/, '');
        html += `<div class="speaker-notes"><strong>Speaker Notes:</strong> ${notes}</div>`;
      }
      // Handle image suggestions
      else if (trimmedLine.match(/^\*?\*?Image:/i)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const imageDesc = trimmedLine.replace(/^\*?\*?Image:\s*/, '').replace(/\*+$/, '');
        html += `<div class="image-suggestion"><strong>Image:</strong> ${imageDesc}</div>`;
      }
      // Handle regular text
      else if (trimmedLine && !trimmedLine.match(/^\*+$/)) {
        if (inList) {
          html += '</ul>';
          inList = false;
        }
        const cleanText = trimmedLine.replace(/\*\*/g, '');
        html += `<p>${cleanText}</p>`;
      }

      previousType = currentType;
    }

    if (inList) {
      html += '</ul>';
    }

    return html;
  }

  // Handle copy button
  document.getElementById('copyButton').addEventListener('click', async () => {
    const content = document.getElementById('slideContent').textContent;
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
}

export { initContentGenerator };
