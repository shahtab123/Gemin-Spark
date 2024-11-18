chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onActivated.addListener((activeInfo) => {
  showSummary(activeInfo.tabId);
});
chrome.tabs.onUpdated.addListener(async (tabId) => {
  showSummary(tabId);
});

async function showSummary(tabId) {
  const tab = await chrome.tabs.get(tabId);
  if (!tab.url.startsWith('http')) {
    return;
  }
  const injection = await chrome.scripting.executeScript({
    target: { tabId },
    files: ['scripts/extract-content.js']
  });
  chrome.storage.session.set({ pageContent: injection[0].result });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'generateContent') {
    try {
      // Use Chrome's Generative API directly
      const generativeAPI = chrome.runtime.getManifest().permissions.includes('generativeContent');
      if (!generativeAPI) {
        throw new Error('Generative API not available');
      }

      // Use the generative language model
      chrome.generativeLanguageAPI.generateText({
        model: 'gemini-pro',
        prompt: message.prompt
      }).then(response => {
        // Format the response
        const markdown = `# ${message.topic}\n\n${response.text}`;
        sendResponse({ result: markdown });
      }).catch(error => {
        console.error('Generation error:', error);
        sendResponse({ error: error.message });
      });

      return true; // Required for async response
    } catch (error) {
      console.error('API error:', error);
      sendResponse({ error: error.message });
      return true;
    }
  }
});

// Initialize context menu state
let contextMenuEnabled = false;

// Handle right-click summarizer context menu
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === 'updateContextMenu') {
    contextMenuEnabled = message.enabled;
    if (message.enabled) {
      chrome.contextMenus.create({
        id: 'summarizeText',
        title: 'Summarize Text',
        contexts: ['selection']
      });
    } else {
      try {
        await chrome.contextMenus.remove('summarizeText');
      } catch (error) {
        console.log('Context menu already removed');
      }
    }
  }
});

// Handle context menu clicks for summarization
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'summarizeText' && contextMenuEnabled) {
    try {
      // Create summarization session with shorter, more concise settings
      const session = await chrome.ai.summarizer.create({
        maxOutputWords: 30,
        minOutputWords: 10,
        targetOutputWords: 20,
        temperature: 0.2,
        completeSentences: true  // Ensure complete sentences
      });

      // Generate and clean summary
      let summary = await session.summarize(info.selectionText);
      summary = summary
        .replace(/[^\w\s.,!?-]/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s+([.,!?])/g, '$1')
        .trim()
        .split(/\s+/)
        .slice(0, 30)
        .join(' ');

      // Ensure the summary ends with proper punctuation
      if (!summary.match(/[.!?]$/)) {
        summary += '.';
      }

      // Send result to sidepanel
      chrome.runtime.sendMessage({
        action: 'summaryComplete',
        originalText: info.selectionText,
        summary: summary
      });

      session.destroy();

    } catch (error) {
      console.error('Right-click summarization failed:', error);
      chrome.runtime.sendMessage({
        action: 'summaryComplete',
        originalText: info.selectionText,
        summary: 'Failed to generate summary'
      });
    }
  }
});

// Remove context menu on extension install/update
chrome.runtime.onInstalled.addListener(() => {
  try {
    chrome.contextMenus.remove('summarizeText');
  } catch (error) {
    console.log('No context menu to remove');
  }
});
