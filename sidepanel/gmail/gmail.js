function showGmailFeatures() {
  const mainContent = document.querySelector('.menu-container');
  mainContent.innerHTML = `
    <button class="menu-button back-button" style="color: black;">
      <span class="material-icons" style="color: black;">arrow_back</span>
      Back
    </button>
    
    <h2 class="compose-title">Gmail Features</h2>
    
    <button class="menu-button" id="smartCompose">
      <span class="material-icons">edit</span>
      Smart Compose
    </button>
    <button class="menu-button" id="otherFeatures">
      <span class="material-icons">auto_awesome</span>
      Other AI Features
    </button>
  `;

  // Add styles for the header
  const style = document.createElement('style');
  style.textContent = `
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
  `;
  document.head.appendChild(style);

  // Add event listeners
  document.querySelector('.back-button').addEventListener('click', goBack);
  document.querySelector('#smartCompose').addEventListener('click', showSmartCompose);
  document.querySelector('#otherFeatures').addEventListener('click', showOtherFeatures);
  document.querySelectorAll('.feature-button').forEach(button => {
    button.addEventListener('click', () => {
      const featureText = button.textContent.trim();
      if (featureText === 'Info') {
        import('./gmailInfo.js').then(module => {
          module.initGmailInfo();
        });
      }
    });
  });
}

function goBack() {
  window.location.reload(); // This will reload the main menu
}

function showSmartCompose() {
  // Load the smart compose interface
  import('./smartCompose.js').then(module => {
    module.initSmartCompose();
  });
}

function showOtherFeatures() {
  // Load the other features interface
  import('./otherFeatures.js').then(module => {
    module.initOtherFeatures();
  });
}

export { showGmailFeatures }; 