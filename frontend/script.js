document.addEventListener('DOMContentLoaded', () => {
  // Loader
  window.addEventListener('load', () => {
    gsap.to('#loader', { opacity: 0, duration: 1, delay: 1, onComplete: () => {
      document.getElementById('loader').style.display = 'none';
    }});
  });

  // Three.js Wave Background
  try {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    const waveCanvas = document.getElementById('waveCanvas');
    waveCanvas.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(100, 100, 50, 50);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0x6366f1, 
      wireframe: true, 
      transparent: true, 
      opacity: 0.3 
    });
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);

    camera.position.z = 50;

    function animateWave() {
      const time = Date.now() * 0.001;
      plane.rotation.x = Math.sin(time) * 0.2;
      plane.rotation.y = Math.cos(time) * 0.2;
      const positions = plane.geometry.attributes.position.array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2] = Math.sin(positions[i] * 0.1 + time) * 5;
      }
      plane.geometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
      requestAnimationFrame(animateWave);
    }
    animateWave();

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
  } catch (error) {
    console.error('Three.js Error:', error);
    document.getElementById('waveCanvas').style.background = 'linear-gradient(180deg, #4b5563, #1f2937)';
  }

  // GSAP Animations
  try {
    gsap.registerPlugin(ScrollTrigger);
    gsap.from('#home h2', { opacity: 0, y: 50, duration: 1, delay: 0.5, onComplete: () => {
      document.querySelector('#home h2').style.opacity = 1;
    }});
    gsap.from('#heroSubtitle', { opacity: 0, duration: 1, delay: 1, onComplete: () => {
      const subtitle = document.getElementById('heroSubtitle');
      subtitle.style.opacity = 1;
      let text = subtitle.textContent;
      subtitle.textContent = '';
      let i = 0;
      function type() {
        if (i < text.length) {
          subtitle.textContent += text[i];
          i++;
          setTimeout(type, 50);
        }
      }
      type();
    }});

    document.querySelectorAll('section').forEach(section => {
      gsap.from(section, {
        opacity: 0,
        y: 100,
        duration: 1,
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          toggleActions: 'play none none none',
          onEnter: () => section.style.opacity = 1
        }
      });
    });

    // Parallax Background
    gsap.to('.bg-pattern', {
      backgroundPosition: '50% 100%',
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true
      }
    });
  } catch (error) {
    console.error('GSAP Error:', error);
    document.querySelectorAll('section').forEach(section => section.style.opacity = 1);
  }

  // Tilt.js for Cards
  try {
    VanillaTilt.init(document.querySelectorAll('.tilt'), {
      max: 15,
      speed: 400,
      glare: true,
      'max-glare': 0.3
    });
  } catch (error) {
    console.error('Tilt.js Error:', error);
  }

  // Ripple Effect for Buttons
  document.querySelectorAll('.ripple').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-effect';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Smooth Scroll
  document.querySelectorAll('.smooth-scroll').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // Functionality (unchanged)
  const generateAudioBtn = document.getElementById('generateAudio');
  const generateLyricsAudioBtn = document.getElementById('generateLyricsAudio');
  const promptInput = document.getElementById('promptInput');
  const lyricsInput = document.getElementById('lyricsInput');
  const promptCharCount = document.getElementById('promptCharCount');
  const lyricsCharCount = document.getElementById('lyricsCharCount');
  const voiceStyle = document.getElementById('voiceStyle');
  const promptType = document.getElementById('promptType');
  const audioOutput = document.getElementById('audioOutput');
  const status = document.getElementById('status');
  const progressBar = document.getElementById('progressBar');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const accountBtn = document.getElementById('accountBtn');
  const accountModal = document.getElementById('accountModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const signInBtn = document.getElementById('signInBtn');
  const signUpBtn = document.getElementById('signUpBtn');
  const googleSignInBtn = document.getElementById('googleSignInBtn');
  const githubSignInBtn = document.getElementById('githubSignInBtn');
  const accountSection = document.getElementById('accountSection');
  const accountError = document.getElementById('accountError');
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');

  const MAX_PROMPT_CHARS = 200;
  const MAX_LYRICS_CHARS = 2000;

  // Character Counter
  const updateCharCount = (input, counter, max) => {
    const count = input.value.length;
    counter.textContent = `${count}/${max} characters`;
    counter.className = `text-sm ${count > max ? 'text-red-600' : 'text-gray-600'}`;
  };

  promptInput.addEventListener('input', () => updateCharCount(promptInput, promptCharCount, MAX_PROMPT_CHARS));
  lyricsInput.addEventListener('input', () => updateCharCount(lyricsInput, lyricsCharCount, MAX_LYRICS_CHARS));

  updateCharCount(promptInput, promptCharCount, MAX_PROMPT_CHARS);
  updateCharCount(lyricsInput, lyricsCharCount, MAX_LYRICS_CHARS);

  // Simple Hash Function for Passwords
  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return hash.toString();
  };

  // Validate Email and Password
  const validateInput = (email, password) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      accountError.textContent = 'Please enter a valid email address.';
      accountError.classList.remove('hidden');
      return false;
    }
    if (password && password.length < 6) {
      accountError.textContent = 'Password must be at least 6 characters.';
      accountError.classList.remove('hidden');
      return false;
    }
    accountError.classList.add('hidden');
    return true;
  };

  // Update Account UI
  const updateAccountUI = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      accountSection.innerHTML = `
        <span class="text-white mr-4">${user.email}</span>
        <button id="logoutBtn" class="bg-gradient-to-r from-red-600 to-pink-600 px-4 py-2 rounded-lg hover:from-red-700 hover:to-pink-700 transition ripple">Logout</button>
      `;
      const logoutBtn = document.getElementById('logoutBtn');
      logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('user');
        updateAccountUI();
      });
    } else {
      accountSection.innerHTML = `
        <button id="accountBtn" class="bg-gradient-to-r from-purple-600 to-indigo-600 px-4 py-2 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition ripple">Account</button>
      `;
      const newAccountBtn = document.getElementById('accountBtn');
      newAccountBtn.addEventListener('click', () => {
        gsap.to(accountModal, { autoAlpha: 1, duration: 0.3 });
        accountModal.classList.remove('hidden');
      });
    }
  };

  // Sign Up
  signUpBtn.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    if (!validateInput(email, password)) return;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email]) {
      accountError.textContent = 'Email already registered.';
      accountError.classList.remove('hidden');
      return;
    }

    users[email] = simpleHash(password);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify({ email }));
    gsap.to(accountModal, { autoAlpha: 0, duration: 0.3, onComplete: () => {
      accountModal.classList.add('hidden');
    }});
    updateAccountUI();
    status.textContent = 'Signed up successfully!';
  });

  // Sign In
  signInBtn.addEventListener('click', () => {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
    if (!validateInput(email, password)) return;

    const users = JSON.parse(localStorage.getItem('users') || '{}');
    if (users[email] && users[email] === simpleHash(password)) {
      localStorage.setItem('user', JSON.stringify({ email }));
      gsap.to(accountModal, { autoAlpha: 0, duration: 0.3, onComplete: () => {
        accountModal.classList.add('hidden');
      }});
      updateAccountUI();
      status.textContent = 'Signed in successfully!';
    } else {
      accountError.textContent = 'Invalid email or password.';
      accountError.classList.remove('hidden');
    }
  });

  // Google Sign-In (Simulated)
  googleSignInBtn.addEventListener('click', () => {
    const email = `google_${Date.now()}@example.com`;
    localStorage.setItem('user', JSON.stringify({ email }));
    gsap.to(accountModal, { autoAlpha: 0, duration: 0.3, onComplete: () => {
      accountModal.classList.add('hidden');
    }});
    updateAccountUI();
    status.textContent = 'Signed in with Google!';
  });

  // GitHub Sign-In (Simulated)
  githubSignInBtn.addEventListener('click', () => {
    const email = `github_${Date.now()}@example.com`;
    localStorage.setItem('user', JSON.stringify({ email }));
    gsap.to(accountModal, { autoAlpha: 0, duration: 0.3, onComplete: () => {
      accountModal.classList.add('hidden');
    }});
    updateAccountUI();
    status.textContent = 'Signed in with GitHub!';
  });

  // Close Modal
  closeModalBtn.addEventListener('click', () => {
    gsap.to(accountModal, { autoAlpha: 0, duration: 0.3, onComplete: () => {
      accountModal.classList.add('hidden');
      accountError.classList.add('hidden');
    }});
  });

  // Generate Audio
  const generateAudio = async (text, inputType) => {
    if (!text) {
      status.textContent = 'Please enter some text or lyrics!';
      return;
    }

    status.textContent = 'Generating audio...';
    audioOutput.classList.add('hidden');
    progressBar.classList.remove('hidden');
    loadingSpinner.classList.remove('hidden');

    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      progressBar.firstElementChild.style.width = `${progress}%`;
      if (progress >= 100) clearInterval(progressInterval);
    }, 500);

    try {
      const response = await fetch('/generate-audio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text,
          voiceStyle: voiceStyle.value,
          promptType: promptType.value,
          inputType
        })
      });

      clearInterval(progressInterval);
      progressBar.firstElementChild.style.width = '100%';
      setTimeout(() => {
        progressBar.classList.add('hidden');
        loadingSpinner.classList.add('hidden');
      }, 500);

      if (!response.ok) throw new Error('Failed to generate audio');

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioOutput.src = url;
      audioOutput.classList.remove('hidden');
      status.textContent = 'Audio generated successfully!';
    } catch (error) {
      clearInterval(progressInterval);
      progressBar.classList.add('hidden');
      loadingSpinner.classList.add('hidden');
      status.textContent = 'Error: ' + error.message;
    }
  };

  generateAudioBtn.addEventListener('click', () => generateAudio(promptInput.value, 'prompt'));
  generateLyricsAudioBtn.addEventListener('click', () => generateAudio(lyricsInput.value, 'lyrics'));

  // Mobile Menu Toggle
  menuToggle.addEventListener('click', () => {
    const isHidden = navMenu.classList.contains('hidden');
    gsap.to(navMenu, {
      x: isHidden ? 0 : 300,
      opacity: isHidden ? 1 : 0,
      duration: 0.3,
      onComplete: () => {
        navMenu.classList.toggle('hidden');
      }
    });
    menuToggle.innerHTML = isHidden ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
  });

  // Initialize Account UI
  updateAccountUI();
});