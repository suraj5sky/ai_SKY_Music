# SKY Sound AI

SKY Sound AI is a web application that transforms text into audio using the Bark model. It supports generating speech, music, and sound effects from short prompts (up to 200 characters) or lyrics (up to 2000 characters). The application features a modern, engaging UI with 3D wave animations, neumorphic cards, glassmorphism, and smooth scroll-triggered animations.

## Features
- **Text-to-Audio Generation**:
  - **Prompt**: Generate audio from short text (200 chars max) with selectable voice styles (male, female, British, musical) and prompt types (speech, music, sound effect).
  - **Lyrics**: Generate audio from longer text (2000 chars max) using the same voice style and prompt type as the prompt section.
- **Authentication**:
  - Email-based sign-in/up with password hashing.
  - Simulated Google and GitHub OAuth (stores mock user data in `localStorage`).
  - Dynamic navbar updates based on login status.
- **UI/UX**:
  - 3D wave background (Three.js) in the hero section.
  - Scroll-triggered animations (GSAP) for sections and elements.
  - Neumorphic cards with tilt effects (Tilt.js) for Features and Pricing.
  - Glassmorphic navbar and modal with backdrop blur.
  - Gradient buttons with ripple effects.
  - Floating labels for inputs and smooth scrolling for navigation.
  - Wave SVG separators between sections.
  - Responsive design for mobile and tablet.
- **Pricing Plans**:
  - Free ($0/month): 100 generations, basic styles.
  - Pro ($9.99/month): Unlimited generations, advanced styles.
  - Enterprise (Custom): Custom integrations, dedicated support.
- **Additional**:
  - Newsletter subscription form.
  - Social media links (Twitter, LinkedIn, GitHub, YouTube).
  - "About Me" link to [skyinfinitetech.com](http://www.skyinfinitetech.com).

## Project Structure
```
ai_Sound/
├── backend/
│   └── app.py              # Flask backend for audio generation
├── frontend/
│   ├── index.html         # Main webpage with HTML structure
│   ├── script.js          # JavaScript for interactivity and animations
│   └── style.css          # CSS for styling and responsive design
└── venv/                  # Virtual environment (not included in repo)
```

## Prerequisites
- **Python 3.8+**
- **Node.js** (optional, for local development tools)
- **Git** (for cloning or version control)
- **Browser**: Chrome, Firefox, or Edge (latest versions recommended)

## Setup Instructions

1. **Clone the Repository** (if applicable):
   ```bash
   git clone <repository-url>
   cd ai_Sound
   ```

2. **Create and Activate Virtual Environment**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```

3. **Install Backend Dependencies**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install required packages:
     ```bash
     pip install flask flask-cors
     ```
   - **Note**: The Bark model and its dependencies are assumed to be pre-installed. If not, install them:
     ```bash
     pip install bark
     ```
     Ensure Bark is configured correctly (refer to [Bark documentation](https://github.com/suno-ai/bark)).

4. **Verify Frontend Files**:
   - Ensure the `frontend/` directory contains:
     - `index.html`
     - `script.js`
     - `style.css`
   - These files use CDNs for dependencies (Three.js, GSAP, Tilt.js, Font Awesome, Tailwind CSS), so no additional frontend setup is needed.

5. **Run the Backend Server**:
   - From the `backend/` directory:
     ```bash
     python app.py
     ```
   - The server will run on `http://127.0.0.1:5000`.

6. **Access the Application**:
   - Open a browser and navigate to `http://127.0.0.1:5000`.
   - You should see the SKY Sound AI homepage with a 3D wave background, navbar, and sections.

## Usage
1. **Homepage**:
   - View the hero section with a 3D wave animation and "Try Now" button.
   - Navigate using the sticky navbar (Home, Features, Prompt, Pricing, Contact, About Me).

2. **Generate Audio**:
   - **Prompt Section**:
     - Select a voice style and prompt type.
     - Enter up to 200 characters.
     - Click "Generate Audio" to create and play the audio.
   - **Lyrics Section**:
     - Enter up to 2000 characters.
     - Click "Generate Lyrics Audio" (uses Prompt section's voice style and type).
   - Audio output appears in the Audio Output section with a progress bar and player.

3. **Authentication**:
   - Click "Account" in the navbar.
   - Sign in or sign up with email/password, Google, or GitHub.
   - The navbar updates to show the user’s email and a "Logout" button.

4. **Explore Other Sections**:
   - **Features**: View cards highlighting multilingual speech, music/effects, and nonverbal sounds.
   - **Pricing**: Review Free, Pro, and Enterprise plans.
   - **Contact**: Email support@skysoundai.com.
   - **Footer**: Subscribe to the newsletter or follow social media links.

## Testing
- **Visuals**:
  - Verify the loader animation (logo pulse).
  - Check the 3D wave background in the hero section.
  - Ensure sections (Features, Prompt, Lyrics, etc.) are visible with animations.
  - Test mobile responsiveness (use browser dev tools or a phone).
- **Functionality**:
  - Test audio generation:
    ```bash
    curl -X POST -H "Content-Type: application/json" -d '{"text":"Test","voiceStyle":"male","promptType":"speech","inputType":"prompt"}' http://127.0.0.1:5000/generate-audio
    ```
  - Verify character limits (200 for prompt, 2000 for lyrics).
  - Test authentication (email, Google, GitHub sign-in).
- **Logs**:
  - Check server logs for errors:
    ```
    127.0.0.1 - - [26/Apr/2025 10:00:00] "POST /generate-audio HTTP/1.1" 200 -
    ```
  - Open browser console (F12 > Console) for JS errors.

## Troubleshooting
- **Content Not Visible**:
  - Check browser console for errors (e.g., `THREE is not defined`).
  - Inspect elements (F12 > Elements) to verify `z-index` (`#waveCanvas` should be `z-index: -1`, sections `z-index: 10`).
  - Disable `#waveCanvas` in `style.css` (`display: none`) to test.
- **Audio Generation Fails**:
  - Check terminal for `ERROR:root:` messages.
  - Ensure Bark model is installed and configured.
  - Test API with `curl` (see Testing section).
- **CDN Issues**:
  - Verify CDNs load in the network tab (F12 > Network).
  - Clear browser cache (Ctrl+Shift+R) or try a different browser.
- **Auth Issues**:
  - Clear `localStorage` (F12 > Application > Local Storage > Clear).
- **Contact**:
  - Share console errors, screenshots, or server logs for further assistance.

## Development Notes
- **Frontend**:
  - Uses Tailwind CSS (CDN) for utility classes.
  - Three.js for 3D wave animation, GSAP for scroll animations, Tilt.js for card effects.
  - Indentation: 4 spaces (HTML), 2 spaces (JS/CSS).
- **Backend**:
  - Flask server with CORS enabled.
  - Assumes Bark model for audio generation.
- **Improvements**:
  - Add real OAuth for Google/GitHub.
  - Optimize Three.js for low-end devices.
  - Implement payment integration for Pro/Enterprise plans.

## License
© 2025 SKY Sound AI. All rights reserved.

## Contact
- Email: [support@skysoundai.com](mailto:support@skysoundai.com)
- Website: [skyinfinitetech.com](http://www.skyinfinitetech.com)