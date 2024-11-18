export function showAboutInfo() {
  const menuView = document.querySelector('.menu-view');
  const aboutView = document.querySelector('.about-view');
  const aboutContent = aboutView.querySelector('.about-content');
  
  menuView.style.display = 'none';
  aboutView.style.display = 'block';
  
  aboutContent.innerHTML = `
    <div class="about-container">
      <div class="card">
        <h3>About Me</h3>
        <p>I'm a graduate in Information Technology Management from De Montfort University, with over 2 years of experience as a freelance IT consultant. During this time, I have honed my skills in team management and provided valuable tech-related solutions to companies.</p>
        <p>My passion lies in Artificial Intelligence, and I am currently dedicated to building my own AI startup, AIApp.gg. Outside of the tech world, I find enjoyment in watching anime and playing games.</p>
        <p>I am open to networking and collaboration opportunities in the fields of AI, technology, and beyond.</p>
      </div>

      <div class="card">
        <h3>Why Create This Extension</h3>
        <p>This extension was created as part of the Google Chrome Built-in AI Challenge on DevPost. The challenge required developing a Chrome Extension that utilizes Chrome's built-in AI APIs to interact with integrated models such as Gemini Nano.</p>
        <p>Having previously created only two simple extensions, this challenge provided an opportunity to expand my knowledge and skills in Chrome extension development. The project involved overcoming various technical challenges and learning to effectively implement AI capabilities.</p>
      </div>

      <div class="card">
        <h3>How to Contact Me</h3>
        <p>If you encounter any bugs, have suggestions, or would like to collaborate, feel free to reach out through any of these channels:</p>
        <div class="contact-links">
          <a href="https://www.linkedin.com/in/shahtab-mohtasin/" target="_blank" class="contact-link">
            <span class="material-icons">work</span>
            LinkedIn
          </a>
          <a href="https://x.com/SMohtasin" target="_blank" class="contact-link">
            <span class="material-icons">tag</span>
            Twitter
          </a>
          <a href="mailto:smohtasin@gmail.com" class="contact-link">
            <span class="material-icons">email</span>
            Email
          </a>
          <a href="https://github.com/shahtab123" target="_blank" class="contact-link">
            <span class="material-icons">code</span>
            GitHub
          </a>
        </div>
      </div>

      <div class="card footer-card">
        <p>Built with ❤️ using Chrome Extension APIs and builtin chrome api that uses gemini nano</p>
      </div>
    </div>
  `;

  const backButton = aboutView.querySelector('.back-button');
  backButton.addEventListener('click', () => {
    aboutView.style.display = 'none';
    menuView.style.display = 'block';
  });
} 