async function initAutoReply() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    <div class="compose-container">
      <h2 class="compose-title">Auto Reply</h2>
      
      <div class="input-group">
        <label for="emailContent">Email Content</label>
        <textarea 
          id="emailContent"
          class="compose-input" 
          placeholder="Paste the email content you want to reply to..."
          rows="4"></textarea>
      </div>

      <div class="options-row">
        <div class="input-group half">
          <label for="tone">Reply Tone</label>
          <select id="tone" class="compose-select">
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
        </div>

        <div class="input-group half">
          <label for="length">Reply Length</label>
          <select id="length" class="compose-select">
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="long">Long</option>
          </select>
        </div>
      </div>

      <button class="menu-button compose-button">
        <span class="material-icons">reply</span>
        <span class="button-text">Generate Reply</span>
      </button>

      <div class="input-group">
        <div class="output-header">
          <label>Generated Reply</label>
          <button class="copy-button" id="copyButton" style="display: none;">
            <span class="material-icons">content_copy</span>
          </button>
        </div>
        <div class="output-box" id="outputBox">Your reply will appear here...</div>
      </div>
    </div>
  `;

  // Add event listeners
  document.querySelector('.back-button').addEventListener('click', () => {
    import('./gmail.js').then(module => {
      module.showGmailFeatures();
    });
  });

  // Add generate button functionality
  document.querySelector('.compose-button').addEventListener('click', async () => {
    const emailContent = document.querySelector('#emailContent').value;
    const tone = document.querySelector('#tone').value;
    const length = document.querySelector('#length').value;
    const outputBox = document.querySelector('#outputBox');
    const copyButton = document.querySelector('#copyButton');
    
    if (!emailContent) {
      alert('Please enter the email content to reply to');
      return;
    }

    const submitButton = document.querySelector('.compose-button');
    submitButton.disabled = true;
    submitButton.querySelector('.button-text').textContent = 'Generating...';

    try {
      await generateReply(emailContent, tone, length, outputBox);
      copyButton.style.display = 'block';
    } catch (error) {
      outputBox.textContent = `Error: ${error.message}`;
    } finally {
      submitButton.disabled = false;
      submitButton.querySelector('.button-text').textContent = 'Generate Reply';
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
      setTimeout(() => {
        icon.textContent = 'content_copy';
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  });
}

export { initAutoReply }; 