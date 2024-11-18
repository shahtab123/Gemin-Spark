document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#docsButton').addEventListener('click', () => {
    import('./docs/docs.js').then(module => {
      module.showDocsFeatures();
    });
  });

  // Add Sheets button click handler
  document.querySelector('#sheetsButton').addEventListener('click', () => {
    import('./sheets/sheets.js').then(module => {
      module.showSheetsFeatures();
    });
  });

  // Add Gmail button click handler
  document.querySelector('#gmailButton').addEventListener('click', () => {
    import('./gmail/gmail.js').then(module => {
      module.showGmailFeatures();
    });
  });

  // Add Slides button click handler
  document.querySelector('#slidesButton').addEventListener('click', () => {
    import('./slides/slides.js').then(module => {
      module.showSlidesFeatures();
    });
  });

  // Add AI Chat button click handler
  document.getElementById('aiChatButton').addEventListener('click', () => {
    import('./chatbot/chatbot.js').then(module => {
      module.showChatbotFeatures();
    });
  });

  // Add Other Tools button click handler
  document.getElementById('otherToolsButton').addEventListener('click', () => {
    import('./otherTools/otherTools.js').then(module => {
      module.showOtherToolsFeatures();
    });
  });

  // Add About button click handler - simplified to just show the about view
  document.getElementById('aboutButton').addEventListener('click', () => {
    import('./about/about.js')
      .then(module => {
        module.showAboutInfo();
      });
  });
});
