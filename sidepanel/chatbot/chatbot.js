const MAX_HISTORY_LENGTH = 4; // Reduced from 6 to 4 messages

async function showChatbotFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button">
      <span class="material-icons">arrow_back</span>
      Back
    </button>
    
    <div class="chat-container">
      <div class="warning-message">
        Note: Each question is treated independently. Please ensure your questions are clear and specific.
      </div>
      <div class="chat-messages" id="chatMessages">
        <div class="message system">
          Hello! I'm your AI assistant. How can I help you today?
        </div>
      </div>
      
      <form id="chatForm" class="chat-input-container">
        <textarea 
          id="userInput" 
          class="chat-input" 
          placeholder="Type your message here..."
          rows="1"
          required
        ></textarea>
        <button type="submit" class="send-button" aria-label="Send message">
          <span class="material-icons">send</span>
        </button>
      </form>
    </div>
  `;

  // Add styles
  const style = document.createElement('style');
  style.textContent = `
    .chat-container {
      display: flex;
      flex-direction: column;
      height: calc(100vh - 120px);
      padding: 1rem;
      gap: 1rem;
    }

    .chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 1rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .message {
      padding: 0.75rem 1rem;
      border-radius: 0.5rem;
      max-width: 80%;
      line-height: 1.5;
      font-size: 0.875rem;
      animation: fadeIn 0.3s ease-out;
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    .message.system {
      background: #f3f4f6;
      align-self: flex-start;
      color: #374151;
    }

    .message.user {
      background: #2563eb;
      color: white;
      align-self: flex-end;
    }

    .message.assistant {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      align-self: flex-start;
      color: #1f2937;
    }

    .chat-input-container {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem;
      border: 1px solid #e5e7eb;
      border-radius: 0.5rem;
      background: #ffffff;
    }

    .chat-input {
      flex: 1;
      padding: 0.5rem;
      border: none;
      outline: none;
      resize: none;
      font-size: 0.875rem;
      line-height: 1.5;
      max-height: 120px;
      overflow-y: auto;
    }

    .chat-input:focus {
      outline: none;
    }

    .send-button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.5rem;
      background: #2563eb;
      color: white;
      border: none;
      border-radius: 0.375rem;
      cursor: pointer;
      transition: background-color 0.2s;
    }

    .send-button:hover {
      background: #1d4ed8;
    }

    .send-button:disabled {
      background: #9ca3af;
      cursor: not-allowed;
    }

    .typing-indicator {
      display: flex;
      gap: 0.5rem;
      padding: 0.75rem 1rem;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 0.5rem;
      align-self: flex-start;
      color: #6b7280;
      font-size: 0.875rem;
    }

    .typing-indicator .dots {
      display: flex;
      gap: 0.25rem;
    }

    .typing-indicator .dot {
      width: 4px;
      height: 4px;
      background: #6b7280;
      border-radius: 50%;
      animation: bounce 1.4s infinite ease-in-out;
    }

    .typing-indicator .dot:nth-child(1) { animation-delay: -0.32s; }
    .typing-indicator .dot:nth-child(2) { animation-delay: -0.16s; }

    @keyframes bounce {
      0%, 80%, 100% { transform: scale(0); }
      40% { transform: scale(1); }
    }

    .warning-message {
      color: #dc2626;
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
      margin-bottom: 1rem;
      background: #fef2f2;
      border: 1px solid #fee2e2;
      border-radius: 0.375rem;
      text-align: center;
    }
  `;
  document.head.appendChild(style);

  // Add back button functionality
  document.querySelector('.back-button').addEventListener('click', () => {
    window.location.reload();
  });

  // Auto-resize textarea
  const textarea = document.getElementById('userInput');
  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  });

  // Add conversation history array
  let conversationHistory = [];

  // Handle form submission
  document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const userInput = textarea.value.trim();
    if (!userInput) return;

    // Add user message
    addMessage('user', userInput);
    textarea.value = '';
    textarea.style.height = 'auto';

    // Reset conversation history each time - remove context tracking
    conversationHistory = [];
    conversationHistory.push({ role: 'user', content: userInput });

    // Show typing indicator
    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = `
      Thinking
      <div class="dots">
        <div class="dot"></div>
        <div class="dot"></div>
        <div class="dot"></div>
      </div>
    `;
    document.getElementById('chatMessages').appendChild(typingIndicator);

    try {
      const session = await window.ai.languageModel.create();
      
      // Enhanced prompt with better task understanding and formatting
      const prompt = `${userInput.toLowerCase().includes('write') || userInput.toLowerCase().includes('create') ? 
        `Task: ${userInput}

Format Rules:
1. For emails:
   Subject: [Clear subject line]
   
   Dear [Recipient],
   
   [Professional and concise body]
   
   [Appropriate closing],
   [Name]

2. For code:
   // File: [filename]
   // Purpose: [brief description]
   
   [Well-formatted code with comments]

3. For other writing:
   [Properly structured content with clear sections]

Note: Replace placeholder text with actual content. Remove brackets.`
        :
        `Question: ${userInput}

Instructions:
1. For factual queries about people:
   - Provide verified information only
   - Include full name and current status
   - For personal details (spouse, family), only include widely known public information
   - If uncertain, respond with "That information is not available"

2. For general queries:
   - Provide a clear, direct answer in 1-2 sentences
   - Focus on current, accurate information
   - No speculation or unverified details`}`;
      
      const stream = await session.promptStreaming(prompt);

      // Remove typing indicator
      typingIndicator.remove();

      // Create assistant message container
      const messageDiv = document.createElement('div');
      messageDiv.className = 'message assistant';
      document.getElementById('chatMessages').appendChild(messageDiv);

      // Stream the response with duplicate prevention
      let response = '';
      let lastChunk = '';
      
      for await (const chunk of stream) {
        // Get only the new content by removing any overlap
        const newContent = chunk.replace(lastChunk, '').trim();
        
        // Only append if it's new content
        if (newContent && !response.includes(newContent)) {
          response += (response ? ' ' : '') + newContent;
          messageDiv.textContent = response;
          messageDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        lastChunk = chunk;
      }

      // Clean up any repeated phrases in final response
      response = response.split('.').map(sentence => sentence.trim())
        .filter((sentence, index, array) => 
          sentence && array.indexOf(sentence) === index
        ).join('. ');
      
      if (response) response += '.';
      messageDiv.textContent = response;

      // Validate response
      if (!response || response.length < 3) {
        throw new Error('Invalid response');
      }

      // Cleanup
      session.destroy();

    } catch (error) {
      console.error('Chat error:', error);
      typingIndicator?.remove();
      addMessage('assistant', 'I apologize, there was an error processing your request. Please try again.');
    }
  });

  // Helper function to add messages
  function addMessage(type, content) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = content;
    document.getElementById('chatMessages').appendChild(messageDiv);
    messageDiv.scrollIntoView({ behavior: 'smooth' });
  }
}

export { showChatbotFeatures }; 