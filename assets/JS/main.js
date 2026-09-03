/**
 * D Y Patil School of Engineering and Management (DYPSEM Kolhapur)
 * India Smart Hackathon (SIH) - Main JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Header Video Player & Controls
  // ==========================================
  const headerVideo = document.getElementById('heroVideo');
  const muteToggleBtn = document.getElementById('videoMuteToggle');
  const playToggleBtn = document.getElementById('videoPlayToggle');
  const fullscreenBtn = document.getElementById('videoFullscreenBtn');
  const muteIconSpan = document.getElementById('muteIcon');
  const muteTextSpan = document.getElementById('muteText');
  const playIconSpan = document.getElementById('playIcon');
  const playTextSpan = document.getElementById('playText');

  if (headerVideo) {
    // Force muted autoplay configuration as required by modern browsers
    headerVideo.muted = true;
    headerVideo.playsInline = true;

    const playPromise = headerVideo.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          updatePlayStateUI(true);
        })
        .catch(err => {
          console.warn('Autoplay prevented or deferred:', err);
          updatePlayStateUI(false);
        });
    }

    // Mute/Unmute Toggle
    if (muteToggleBtn) {
      muteToggleBtn.addEventListener('click', () => {
        headerVideo.muted = !headerVideo.muted;
        updateMuteStateUI(!headerVideo.muted);
      });
    }

    // Play/Pause Toggle
    if (playToggleBtn) {
      playToggleBtn.addEventListener('click', () => {
        if (headerVideo.paused || headerVideo.ended) {
          headerVideo.play();
          updatePlayStateUI(true);
        } else {
          headerVideo.pause();
          updatePlayStateUI(false);
        }
      });
    }

    // Fullscreen Button
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', () => {
        if (!document.fullscreenElement) {
          const container = headerVideo.closest('.video-card-container') || headerVideo;
          if (container.requestFullscreen) {
            container.requestFullscreen();
          } else if (headerVideo.webkitRequestFullscreen) {
            headerVideo.webkitRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
      });
    }

    headerVideo.addEventListener('play', () => updatePlayStateUI(true));
    headerVideo.addEventListener('pause', () => updatePlayStateUI(false));
    headerVideo.addEventListener('volumechange', () => updateMuteStateUI(!headerVideo.muted));
  }

  function updateMuteStateUI(isAudioOn) {
    if (!muteIconSpan || !muteTextSpan) return;
    if (isAudioOn) {
      muteIconSpan.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
        </svg>`;
      muteTextSpan.textContent = 'Audio On';
    } else {
      muteIconSpan.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
        </svg>`;
      muteTextSpan.textContent = 'Muted';
    }
  }

  function updatePlayStateUI(isPlaying) {
    if (!playIconSpan || !playTextSpan) return;
    if (isPlaying) {
      playIconSpan.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
        </svg>`;
      playTextSpan.textContent = 'Pause';
    } else {
      playIconSpan.innerHTML = `
        <svg viewBox="0 0 24 24" width="18" height="18">
          <path d="M8 5v14l11-7z"/>
        </svg>`;
      playTextSpan.textContent = 'Play';
    }
  }

  // ==========================================
  // 1b. Challenges Showcase Video (assets/MEDIA/footer.mp4)
  // ==========================================
  const challengesVideo = document.getElementById('challengesVideo');
  const challengesSoundToggle = document.getElementById('challengesSoundToggle');
  const challengesSoundIcon = document.getElementById('challengesSoundIcon');
  const challengesSoundText = document.getElementById('challengesSoundText');

  if (challengesVideo) {
    challengesVideo.muted = true;
    challengesVideo.playsInline = true;

    // Autoplay attempt
    const playChallengesPromise = challengesVideo.play();
    if (playChallengesPromise !== undefined) {
      playChallengesPromise.catch(() => {
        challengesVideo.muted = true;
        challengesVideo.play().catch(() => {});
      });
    }

    // Click on video to toggle play/pause
    challengesVideo.addEventListener('click', () => {
      if (challengesVideo.paused || challengesVideo.ended) {
        challengesVideo.play();
      } else {
        challengesVideo.pause();
      }
    });

    // Sound toggle button
    if (challengesSoundToggle) {
      challengesSoundToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        challengesVideo.muted = !challengesVideo.muted;
        if (challengesVideo.muted) {
          challengesSoundText.textContent = 'Muted';
          challengesSoundIcon.innerHTML = `
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          `;
        } else {
          challengesSoundText.textContent = 'Audio On';
          challengesSoundIcon.innerHTML = `
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          `;
        }
      });
    }

    // Scroll into view trigger
    if ('IntersectionObserver' in window) {
      const vidObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && challengesVideo.paused) {
            challengesVideo.play().catch(() => {});
          }
        });
      }, { threshold: 0.15 });
      vidObserver.observe(challengesVideo);
    }
  }

  // ==========================================
  // 2. Sticky Navbar Effect
  // ==========================================
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar?.classList.add('scrolled');
    } else {
      navbar?.classList.remove('scrolled');
    }
  }, { passive: true });

  // ==========================================
  // 3. Mobile Navigation Drawer Toggle
  // ==========================================
  const mobileToggle = document.getElementById('mobileNavToggle');
  const navMenu = document.getElementById('navMenu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close when clicking any nav item
    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });
  }

  // ==========================================
  // 3b. Scroll Spy — Highlight Active Nav Link
  // ==========================================
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function updateActiveNavLink() {
    const scrollY = window.scrollY + 120; // offset for sticky navbar height
    let currentSection = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });
  updateActiveNavLink(); // run once on page load

  // ==========================================
  // 4. Interactive FAQ Accordion
  // ==========================================
  const faqQuestions = document.querySelectorAll('.faq-question');
  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.faq-card');
      const wasActive = card.classList.contains('active');

      // Close other open cards for clean accordion look
      document.querySelectorAll('.faq-card').forEach(c => c.classList.remove('active'));

      if (!wasActive) {
        card.classList.add('active');
      }
    });
  });

  // ==========================================
  // 5. Poster Lightbox Modal
  // ==========================================
  const posterModal = document.getElementById('posterLightbox');
  const openModalTriggers = document.querySelectorAll('.trigger-poster-modal');
  const closeModalBtn = document.getElementById('closePosterLightbox');

  if (posterModal) {
    openModalTriggers.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        posterModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeModal = () => {
      posterModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', closeModal);
    }

    posterModal.addEventListener('click', (e) => {
      if (e.target === posterModal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && posterModal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // ==========================================
  // 5b. Roadmap Infographic Lightbox Modal
  // ==========================================
  const roadmapModal = document.getElementById('roadmapLightbox');
  const openRoadmapTriggers = document.querySelectorAll('.trigger-roadmap-modal');
  const closeRoadmapModalBtn = document.getElementById('closeRoadmapLightbox');

  if (roadmapModal) {
    openRoadmapTriggers.forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        roadmapModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    const closeRoadmapModal = () => {
      roadmapModal.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (closeRoadmapModalBtn) {
      closeRoadmapModalBtn.addEventListener('click', closeRoadmapModal);
    }

    roadmapModal.addEventListener('click', (e) => {
      if (e.target === roadmapModal) {
        closeRoadmapModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && roadmapModal.classList.contains('active')) {
        closeRoadmapModal();
      }
    });
  }

  // ==========================================
  // 6. Multilingual SIH Assistant Chatbot with TTS
  // ==========================================
  const chatbotFab = document.getElementById('chatbotFab');
  const chatbotWindow = document.getElementById('chatbotWindow');
  const closeChatbotBtn = document.getElementById('closeChatbot');
  const chatMessages = document.getElementById('chatMessages');
  const chatForm = document.getElementById('chatForm');
  const chatInput = document.getElementById('chatInput');
  const chatSuggestions = document.getElementById('chatSuggestions');
  const suggestionsTitle = document.getElementById('suggestionsTitle');
  const chatSpeechToggle = document.getElementById('chatSpeechToggle');
  const ttsToggleIcon = document.getElementById('ttsToggleIcon');
  const langBtns = document.querySelectorAll('.lang-btn');

  let currentLang = 'en'; // 'en', 'mr', 'hi'
  let isTtsEnabled = true;
  let isTyping = false;

  // Multilingual Knowledge Base & Content
  const chatData = {
    en: {
      welcome: "Hello! I am your <strong>SIH Assistant</strong> for India Smart Hackathon at <strong>D Y Patil School of Engineering and Management (DYPSEM Kolhapur)</strong>. The grand finale is on <strong>11 September 2026</strong>. How can I help you today?",
      placeholder: "Ask about SIH, date, registration, tracks, roadmap...",
      suggestionsHeader: "Quick Questions:",
      suggestions: [
        "📅 When is the event?",
        "🗺️ Nodal Center Roadmap",
        "📝 How do I register?",
        "📞 Contact Coordinators",
        "📋 Team Leader Checklist & Deadline",
        "📊 Download Idea PPT Format",
        "👥 What is the team size?",
        "🎯 What are the tracks?",
        "🖼️ View Official Poster",
        "💡 9 Evaluation Criteria",
        "🏆 What are the prizes?",
        "📍 Where is the venue?"
      ],
      answers: {
        date: "The <strong>India Smart Hackathon (SIH 2026)</strong> internal grand finale & live pitch takes place on <strong>11 September 2026</strong> at D Y Patil School of Engineering and Management (DYPSEM Kolhapur). Registrations are open right now!<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> Register Now</a></div>",
        roadmap: "<strong>DYPSEM SIH 2026 Nodal Center Roadmap:</strong><br>• <strong>2 Sept</strong>: Problem Statements Uploaded on Portal<br>• <strong>2–10 Sept</strong>: Idea Screening, Mentoring & PPT Preparation<br>• <strong>11 Sept 2026</strong>: <strong>Grand Internal Hackathon Finale & Live Pitch</strong><br>• <strong>Milestone 2</strong>: Nomination of Top Teams to National SIH Portal<br>• <strong>SIH Grand Finale</strong>: National SIH 2026 Finale Round.<br><br>👉 Check the Roadmap Graphic placed right above the Innovation Tracks section!",
        poster: "<strong>Official DYPSEM SIH 2026 Event Poster:</strong><br>The grand internal hackathon poster is live with the theme: <em>Ideas + Innovation = Impact • Think, Build, Solve • 11 September 2026</em>.<div class='chat-actions-group'><a href='#poster' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg> View Event Poster</a></div>",
        register: "You can register your 6-member squad online via the official Google Form:<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> Open Official Registration Form</a></div>",
        team: "Each team must consist of strictly <strong>6 members</strong>. Following Smart India Hackathon guidelines, having at least one female team member is mandatory/strongly recommended to ensure diversity and national qualification.",
        tracks: "The hackathon features 6 innovation tracks: <br>1. <strong>AI & Smart Automation</strong><br>2. <strong>Smart Agriculture & IoT</strong><br>3. <strong>Clean Energy & Green Tech</strong><br>4. <strong>Healthcare & MedTech</strong><br>5. <strong>FinTech & Cyber Security</strong><br>6. <strong>Open Innovation</strong>.<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> Explore SIH Problem Statements</a></div>",
        ppt: "You can download the official standardized presentation template here:<div class='chat-actions-group'><a href='assets/MEDIA/SIH2026-IDEA-Presentation-Format.pptx' download='SIH2026-IDEA-Presentation-Format.pptx' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg> Download SIH Idea PPT (.pptx)</a></div><br>Use this standard format for your Stage 02 Idea Submission, covering problem definition, architecture, tech stack, and impact!",
        checklist: "<strong>Team Leader Submission Checklist:</strong><br>1. Team name<br>2. College authorization letter<br>3. Team leader & member details<br>4. Gender details (1 female mandatory)<br>5. Email IDs & mobile numbers<br>6. Selected Problem Statement / Student Innovation category<br>7. Idea title & description<br>8. Idea presentation in PPT format<br><br>⏰ <strong>Important Deadline: 11 September 2026</strong>.",
        sources: "<strong>SIH 2026 brings problem statements from:</strong><br>• <strong>Government Ministries</strong> (Central Ministries & Departments)<br>• <strong>State Governments</strong> (State Administrations & Civic Bodies)<br>• <strong>Public Organizations</strong> (PSUs & Public Sector Undertakings)<br>• <strong>Private Organizations</strong> (Enterprises, MNCs & Tech Corporates)<br>• <strong>NGOs</strong> (Non-Governmental & Social Organizations)<br>• <strong>Other Collaborating Organizations</strong> (Research Labs & Institutions)<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> View Problem Statements</a></div>",
        evaluation: "<strong>How Ideas Are Evaluated — 9 Judging Criteria:</strong><br>💡 <strong>Novelty</strong> – Originality & Creativity<br>⚙️ <strong>Complexity</strong> – Technical Depth<br>🎯 <strong>Clarity</strong> – Communication Quality<br>✅ <strong>Feasibility</strong> – Technical Viability<br>🔧 <strong>Practicability</strong> – Real-World Deployment<br>🌱 <strong>Sustainability</strong> – Long-Term Viability<br>📈 <strong>Scale of Impact</strong> – Societal Reach<br>👤 <strong>User Experience</strong> – Design & Usability<br>🚀 <strong>Future Scope</strong> – Scalability & Growth<br><br>Score high across all 9 to maximize your National SIH nomination chances!",
        individual: "<strong>Can I register individually?</strong><br>No, individual registrations are strictly not allowed. SIH is a team hackathon. You must form a 6-member squad (with at least 1 female participant) and register via your Team Leader.",
        intercollege: "<strong>Can I join another college's team?</strong><br>No, cross-college or inter-college teams are not permitted for this internal edition. All 6 members must be enrolled students of DYPSEM Kolhapur with an official College Authorization Letter.",
        multiple_ps: "<strong>How many Problem Statements (PS) can we submit?</strong><br>Each team can submit for <strong>only 1 Problem Statement</strong> (or 1 Student Innovation idea). Focus your squad's efforts on delivering a high-quality Idea PPT and architecture.",
        contact: "<strong>SIH Student Coordinators / Helpdesk:</strong><br>• <strong>Shriniket Sarshetti</strong>: <a href='tel:+919284331824' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 92843 31824</a><br>• <strong>Aditya Avadan</strong>: <a href='tel:+919890345429' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 98903 45429</a><br>• <strong>Athrav Shinde</strong>: <a href='tel:+917499652753' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 74996 52753</a><br>• <strong>Harshad Teli</strong>: <a href='tel:+919970898012' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 99708 98012</a><br><br>Feel free to call for registration, problem statements, or team guidance!",
        prizes: "Winners receive <strong>exciting cash prizes</strong>, certificates of excellence, hardware incubation toolkits, and direct nomination for the national Smart India Hackathon round!",
        venue: "The venue is <strong>D Y Patil School of Engineering and Management (DYPSEM)</strong>, D. Y. Patil Education Society campus, Kolhapur, Maharashtra.",
        video: "The hero section showcases the official photograph of the <strong>DYPSEM Kolhapur campus</strong>. The official event showcase video is playing right above the challenges section (taken from <code>assets/MEDIA/footer.mp4</code>).",
        default: "I can help with all details regarding the India Smart Hackathon on <strong>11 September 2026</strong> at DYPSEM Kolhapur. Ask about registration, roadmap, teams, tracks, evaluation criteria, poster, coordinators, or download the Idea PPT template!"
      }
    },
    mr: {
      welcome: "नमस्कार! मी डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM) मधील <strong>इंडिया स्मार्ट हॅकाथॉन (SIH)</strong> चा सहाय्यक आहे. कार्यक्रमाची मुख्य तारीख <strong>११ सप्टेंबर २०२६</strong> आहे. मी तुम्हाला कशी मदत करू शकेन?",
      placeholder: "तारीख, नोंदणी, संघ, ट्रॅक्स, रोडमॅप बद्दल विचारा...",
      suggestionsHeader: "वारंवार विचारले जाणारे प्रश्न:",
      suggestions: [
        "📅 कार्यक्रमाची तारीख काय आहे?",
        "🗺️ नोडल सेंटर रोडमॅप (Roadmap)",
        "📝 नोंदणी कशी करायची?",
        "📞 समन्वयक संपर्क (Coordinators)",
        "📋 टीम लीडर चेकलिस्ट व मुदत",
        "📊 Idea PPT फॉरमॅट डाउनलोड करा",
        "👥 संघात किती सदस्य असावेत?",
        "🎯 कोणते ट्रॅक्स आहेत?",
        "🖼️ अधिकृत इव्हेंट पोस्टर",
        "💡 ९ मूल्यांकन निकष",
        "🏆 बक्षिसे कोणती आहेत?",
        "📍 कार्यक्रमाचे स्थळ कुठे आहे?"
      ],
      answers: {
        date: "<strong>इंडिया स्मार्ट हॅकाथॉन (SIH २०२६)</strong> ची ग्रँड फिनाले व थेट सादरीकरण <strong>११ सप्टेंबर २०२६</strong> रोजी डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (कोल्हापूर) येथे होणार आहे. नोंदणी सध्या सुरू आहे!<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> नोंदणी करा</a></div>",
        roadmap: "<strong>DYPSEM SIH २०२६ नोडल सेंटर रोडमॅप:</strong><br>• <strong>२ सप्टेंबर</strong>: पोर्टलवर समस्या विधाने (PS) उपलब्ध<br>• <strong>२-१० सप्टेंबर</strong>: आयडिया स्क्रीनिंग, मेंटॉरिंग आणि सादरीकरण तयारी<br>• <strong>११ सप्टेंबर २०२६</strong>: <strong>ग्रँड अंतर्गत हॅकाथॉन फिनाले आणि थेट सादरीकरण</strong><br>• <strong>टप्पा २</strong>: अव्वल संघांची निवड आणि राष्ट्रीय SIH पोर्टलवर नामांकन<br>• <strong>महाअंतिम फेरी</strong>: राष्ट्रीय SIH ग्रँड फिनाले.<br><br>👉 इनोव्हेशन ट्रॅक्सच्या वरील संपूर्ण रोडमॅप पहा!",
        poster: "<strong>अधिकृत SIH २०२६ इव्हेंट पोस्टर:</strong><br><strong>डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM कोल्हापूर)</strong> चे अधिकृत हॅकाथॉन पोस्टर उपलब्ध आहे! थीम: <em>Ideas + Innovation = Impact • Think, Build, Solve • ११ सप्टेंबर २०२६</em>.<div class='chat-actions-group'><a href='#poster' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg> पोस्टर पहा</a></div>",
        register: "तुम्ही अधिकृत गुगल फॉर्म लिंकद्वारे आपल्या ६ सदस्यीय संघाची नोंदणी करू शकता:<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> अधिकृत नोंदणी फॉर्म उघडा</a></div>",
        team: "प्रत्येक संघात काटेकोरपणे <strong>६ सदस्य</strong> असणे आवश्यक आहे. राष्ट्रीय SIH नियमांनुसार संघात किमान एका महिला सदस्याचा समावेश असणे अनिवार्य / शिफारस केलेले आहे.",
        tracks: "हॅकाथॉनमध्ये ६ मुख्य ट्रॅक्स आहेत: <br>१. <strong>AI आणि स्मार्ट ऑटोमेशन</strong><br>२. <strong>स्मार्ट शेती आणि IoT</strong><br>३. <strong>हरित ऊर्जा आणि ग्रीन टेक</strong><br>४. <strong>आरोग्य सेवा आणि मेडटेक</strong><br>५. <strong>फिनटेक आणि सायबर सुरक्षा</strong><br>६. <strong>मुक्त नवकल्पना (Open Innovation)</strong>.<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> समस्या विधाने पहा</a></div>",
        ppt: "तुम्ही अधिकृत साचा (Template) येथून डाउनलोड करू शकता:<div class='chat-actions-group'><a href='assets/MEDIA/SIH2026-IDEA-Presentation-Format.pptx' download='SIH2026-IDEA-Presentation-Format.pptx' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg> Idea PPT डाउनलोड करा (.pptx)</a></div><br>स्टेज ०२ साठी कल्पना सादरीकरण (Idea PPT) तयार करण्यासाठी याच अधिकृत फॉरमॅटचा वापर करा!",
        checklist: "<strong>संघ प्रमुखांसाठी आवश्यक चेकलिस्ट:</strong><br>१. संघाचे नाव (Team Name)<br>२. कॉलेज अधिकृत पत्र (Authorization Letter)<br>३. संघ प्रमुख व सदस्यांचे तपशील<br>४. लिंग तपशील (१ महिला सदस्य अनिवार्य)<br>५. ईमेल आयडी व मोबाईल नंबर<br>६. निवडलेले समस्या विधान / नवकल्पना प्रवर्ग<br>७. कल्पनेचे शीर्षक व वर्णन<br>८. PPT स्वरूपात सादरीकरण<br><br>⏰ <strong>महत्त्वाची अंतिम मुदत: ११ सप्टेंबर २०२६</strong>!",
        sources: "<strong>SIH 2026 खालील घटकांकडून समस्या विधाने आणते:</strong><br>• <strong>सरकारी मंत्रालये</strong> (Government Ministries)<br>• <strong>राज्य सरकारे</strong> (State Governments)<br>• <strong>सार्वजनिक संस्था</strong> (Public Organizations / PSUs)<br>• <strong>खाजगी संस्था</strong> (Private Organizations & Corporates)<br>• <strong>स्वयंसेवी संस्था (NGOs)</strong><br>• <strong>इतर सहयोगी संस्था</strong> (Collaborating Organizations)<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> अधिकृत समस्या विधाने येथे पहा</a></div>",
        evaluation: "<strong>कल्पनांचे मूल्यांकन कसे केले जाते — ९ निकष:</strong><br>💡 <strong>नाविन्य (Novelty)</strong> – मौलिकता आणि सर्जनशीलता<br>⚙️ <strong>जटिलता (Complexity)</strong> – तांत्रिक खोली<br>🎯 <strong>स्पष्टता (Clarity)</strong> – संभाषण गुणवत्ता<br>✅ <strong>साध्यता (Feasibility)</strong> – तांत्रिक व्यवहार्यता<br>🔧 <strong>व्यावहारिकता (Practicability)</strong> – वास्तव जगातील तैनाती<br>🌱 <strong>टिकाऊपणा (Sustainability)</strong> – दीर्घकालीन व्यवहार्यता<br>📈 <strong>प्रभावाचे प्रमाण (Scale of Impact)</strong> – सामाजिक पोहोच<br>👤 <strong>वापरकर्ता अनुभव (User Experience)</strong> – डिझाइन आणि उपयुक्तता<br>🚀 <strong>भविष्यातील संधी (Future Scope)</strong> – वाढीची क्षमता",
        individual: "<strong>वैयक्तिक नोंदणी करता येईल का?</strong><br>नाही, वैयक्तिक नोंदणीला परवानगी नाही. SIH ही पूर्णपणे सांघिक स्पर्धा आहे. ६ सदस्यांचा संघ बनवून संघ प्रमुखांमार्फतच नोंदणी करावी लागेल.",
        intercollege: "<strong>दुसऱ्या कॉलेजच्या टीममध्ये सामील होता येईल का?</strong><br>नाही, आंतर-महाविद्यालयीन संघांना परवानगी नाही. सर्व ६ सदस्य डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (कोल्हापूर) चेच नियमित विद्यार्थी असावेत.",
        multiple_ps: "<strong>आम्ही किती समस्या विधाने (PS) सादर करू शकतो?</strong><br>प्रत्येक संघ फक्त <strong>१ समस्या विधान</strong> (किंवा ओपन इनोव्हेशन प्रकल्प) सादर करू शकतो.",
        contact: "<strong>SIH विद्यार्थी समन्वयक (Student Coordinators):</strong><br>• <strong>श्रीनिकेत सरशेट्टी</strong>: <a href='tel:+919284331824' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 92843 31824</a><br>• <strong>आदित्य अवदान</strong>: <a href='tel:+919890345429' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 98903 45429</a><br>• <strong>अथर्व शिंदे</strong>: <a href='tel:+917499652753' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 74996 52753</a><br>• <strong>हर्षद तेली</strong>: <a href='tel:+919970898012' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 99708 98012</a><br><br>नोंदणी किंवा कोणत्याही मार्गदर्शनासाठी निसंकोच संपर्क साधा!",
        prizes: "विजेत्या संघांना <strong>आकर्षक रोख बक्षिसे</strong>, प्रमाणपत्रे, हार्डवेअर किट्स आणि राष्ट्रीय स्तरावरील SIH फेरीत थेट कॉलेज नामांकन व मार्गदर्शन मिळेल!",
        venue: "कार्यक्रमाचे स्थळ: <strong>डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM)</strong>, डी. वाय. पाटील एज्युकेशन सोसायटी परिसर, कोल्हापूर, महाराष्ट्र.",
        video: "हेडर विभागात <strong>डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM कोल्हापूर) च्या कॅम्पसचे सुंदर छायाचित्र</strong> आहे. शोकेस व्हिडिओ इनोव्हेशन चॅलेंजेसच्या वर पाहू शकता (assets/MEDIA/footer.mp4)!",
        default: "मी ११ सप्टेंबर रोजी होणाऱ्या डीवायपीटीईएम SIH हॅकाथॉनच्या सर्व माहितीसाठी येथे आहे. आपण तारीख, नोंदणी, रोडमॅप, संघ, ट्रॅक्स, पोस्टर, समन्वयक किंवा Idea PPT डाउनलोड विषयी विचारू शकता!"
      }
    },
    hi: {
      welcome: "नमस्ते! मैं डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM) में <strong>इंडिया स्मार्ट हैकाथॉन (SIH)</strong> का सहायक हूँ। इस कार्यक्रम का ग्रैंड फिनाले <strong>11 सितंबर 2026</strong> को है। मैं आपकी क्या सहायता कर सकता हूँ?",
      placeholder: "तारीख, रजिस्ट्रेशन, टीम, थीम्स, रोडमॅप के बारे में पूछें...",
      suggestionsHeader: "सुझाए गए प्रश्न:",
      suggestions: [
        "📅 कार्यक्रम की तारीख क्या है?",
        "🗺️ नोडल सेंटर रोडमॅप (Roadmap)",
        "📝 रजिस्ट्रेशन कैसे करें?",
        "📞 समन्वयक संपर्क (Coordinators)",
        "📋 टीम लीडर चेकलिस्ट और डेडलाइन",
        "📊 Idea PPT फॉर्मेट डाउनलोड करें",
        "👥 टीम में कितने सदस्य होने चाहिए?",
        "🎯 थीम्स और ट्रैक्स कौन से हैं?",
        "🖼️ आधिकारिक इवेंट पोस्टर",
        "💡 9 मूल्यांकन मानदंड",
        "🏆 पुरस्कार क्या हैं?",
        "📍 कार्यक्रम का स्थान कहाँ है?"
      ],
      answers: {
        date: "<strong>इंडिया स्मार्ट हैकाथॉन (SIH 2026)</strong> का ग्रैंड फिनाले एवं लाइव पिचिंग <strong>11 सितंबर 2026</strong> को डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (कोल्हापुर) में आयोजित किया जाएगा। रजिस्ट्रेशन प्रारंभ हैं!<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> रजिस्ट्रेशन करें</a></div>",
        roadmap: "<strong>DYPSEM SIH 2026 नोडल सेंटर रोडमॅप:</strong><br>• <strong>2 सितंबर</strong>: पोर्टल पर प्रॉब्लम स्टेटमेंट्स जारी<br>• <strong>2–10 सितंबर</strong>: आइडिया स्क्रीनिंग, मेंटरिंग एवं PPT तैयारी<br>• <strong>11 सितंबर 2026</strong>: <strong>ग्रैंड इंटरनल हैकाथॉन फिनाले एवं लाइव पिचिंग</strong><br>• <strong>माइलस्टोन 2</strong>: टॉप टीमों का चयन और राष्ट्रीय SIH पोर्टल पर नामांकन<br>• <strong>ग्रैंड फिनाले</strong>: राष्ट्रीय SIH 2026 ग्रैंड फिनाले राउंड।<br><br>👉 इनोवेशन ट्रैक्स के ठीक ऊपर दिया गया संपूर्ण रोडमॅप देखें!",
        poster: "<strong>आधिकारिक SIH 2026 इवेंट पोस्टर:</strong><br><strong>डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM कोल्हापुर)</strong> का आधिकारिक हैकाथॉन पोस्टर जारी हो चुका है! थीम: <em>Ideas + Innovation = Impact • Think, Build, Solve • 11 सितंबर 2026</em>.<div class='chat-actions-group'><a href='#poster' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg> पोस्टर देखें</a></div>",
        register: "आप आधिकारिक गूगल फॉर्म के माध्यम से अपनी 6-सदस्यीय टीम का रजिस्ट्रेशन कर सकते हैं:<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> आधिकारिक रजिस्ट्रेशन फॉर्म खोलें</a></div>",
        team: "प्रत्येक टीम में अनिवार्य रूप से <strong>6 सदस्य</strong> होने चाहिए। राष्ट्रीय SIH दिशानिर्देशों के तहत विविधता और चयन के लिए कम से कम एक महिला सदस्य होना अनिवार्य / दृढ़ता से अनुशंसित है।",
        tracks: "हैकाथॉन में 6 मुख्य इनोवेशन ट्रैक्स शामिल हैं: <br>1. <strong>AI और स्मार्ट ऑटोमेशन</strong><br>2. <strong>स्मार्ट कृषि और IoT</strong><br>3. <strong>स्वच्छ ऊर्जा और ग्रीन टेक</strong><br>4. <strong>हेल्थकेयर और मेडटेक</strong><br>5. <strong>फिनटेक और साइबर सुरक्षा</strong><br>6. <strong>ओपन इनोवेशन</strong>.<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> प्रॉब्लम स्टेटमेंट्स देखें</a></div>",
        ppt: "आप आधिकारिक आइडिया प्रस्तुति टेम्पलेट यहाँ से डाउनलोड कर सकते हैं:<div class='chat-actions-group'><a href='assets/MEDIA/SIH2026-IDEA-Presentation-Format.pptx' download='SIH2026-IDEA-Presentation-Format.pptx' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg> Idea PPT डाउनलोड करें (.pptx)</a></div><br>स्टेज 02 के लिए अपनी प्रेजेंटेशन स्लाइड्स तैयार करने हेतु इसी प्रारूप का उपयोग करें!",
        checklist: "<strong>टीम लीडर के लिए अनिवार्य चेकलिस्ट:</strong><br>1. टीम का नाम (Team name)<br>2. कॉलेज ऑथराइजेशन लेटर (Authorization letter)<br>3. टीम लीडर और सभी सदस्यों का विवरण<br>4. जेंडर विवरण (1 महिला सदस्य अनिवार्य)<br>5. ईमेल आईडी एवं मोबाइल नंबर<br>6. चयनित प्रॉब्लम स्टेटमेंट / इनोवेशन कैटेगरी<br>7. आइडिया टाइटल एवं विवरण<br>8. PPT फॉर्मेट में आइडिया प्रेजेंटेशन<br><br>⏰ <strong>महत्वपूर्ण डेडलाइन: 11 सितंबर 2026</strong>!",
        sources: "<strong>SIH 2026 निम्नलिखित से प्रॉब्लम स्टेटमेंट्स लाता है:</strong><br>• <strong>सरकारी मंत्रालय</strong> (Government Ministries)<br>• <strong>राज्य सरकारें</strong> (State Governments)<br>• <strong>सार्वजनिक संगठन</strong> (Public Organizations / PSUs)<br>• <strong>निजी संगठन</strong> (Private Organizations & Corporates)<br>• <strong>गैर-सरकारी संगठन (NGOs)</strong><br>• <strong>अन्य सहयोगी संगठन</strong> (Collaborating Organizations)<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> सभी प्रॉब्लम स्टेटमेंट्स देखें</a></div>",
        evaluation: "<strong>आइडिया का मूल्यांकन कैसे होता है — 9 मानदंड:</strong><br>💡 <strong>नवीनता (Novelty)</strong> – मौलिकता और रचनात्मकता<br>⚙️ <strong>जटिलता (Complexity)</strong> – तकनीकी गहराई<br>🎯 <strong>स्पष्टता (Clarity)</strong> – संचार गुणवत्ता<br>✅ <strong>संभावनीयता (Feasibility)</strong> – तकनीकी व्यावहारिकता<br>🔧 <strong>व्यावहारिकता (Practicability)</strong> – वास्तविक दुनिया में तैनाती<br>🌱 <strong>स्थिरता (Sustainability)</strong> – दीर्घकालिक व्यवहार्यता<br>📈 <strong>प्रभाव का पैमाना (Scale of Impact)</strong> – सामाजिक पहुंच<br>👤 <strong>उपयोगकर्ता अनुभव (UX)</strong> – डिज़ाइन और उपयोगिता<br>🚀 <strong>भविष्य का दायरा (Future Scope)</strong> – स्केलेबिलिटी और विकास",
        individual: "<strong>क्या मैं व्यक्तिगत रूप से रजिस्ट्रेशन कर सकता हूँ?</strong><br>नहीं, व्यक्तिगत रजिस्ट्रेशन की अनुमति नहीं है। SIH एक टीम हैकाथॉन है। आपको 6 सदस्यों की टीम बनाकर टीम लीडर के माध्यम से रजिस्ट्रेशन करना होगा।",
        intercollege: "<strong>क्या मैं दूसरे कॉलेज की टीम में शामिल हो सकता हूँ?</strong><br>नहीं, क्रॉस-कॉलेज टीमों की अनुमति नहीं है। सभी 6 सदस्य डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (कोल्हापुर) के ही नियमित छात्र होने चाहिए।",
        multiple_ps: "<strong>हम कितने प्रॉब्लम स्टेटमेंट्स (PS) सबमिट कर सकते हैं?</strong><br>प्रत्येक टीम केवल <strong>1 प्रॉब्लम स्टेटमेंट</strong> (या ओपन इनोवेशन आइडिया) सबमिट कर सकती है।",
        contact: "<strong>SIH छात्र समन्वयक (Student Coordinators):</strong><br>• <strong>श्रीनीकेत सरशेट्टी</strong>: <a href='tel:+919284331824' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 92843 31824</a><br>• <strong>आदित्य अवदान</strong>: <a href='tel:+919890345429' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 98903 45429</a><br>• <strong>अथर्व शिंदे</strong>: <a href='tel:+917499652753' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 74996 52753</a><br>• <strong>हर्षद तेली</strong>: <a href='tel:+919970898012' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 99708 98012</a><br><br>रजिस्ट्रेशन या किसी भी सहायता के लिए संपर्क करें!",
        prizes: "विजेता टीमों को <strong>आकर्षक नकद पुरस्कार</strong>, उत्कृष्टता प्रमाण पत्र, हार्डवेयर किट्स, और राष्ट्रीय स्मार्ट इंडिया हैकाथॉन के लिए डायरेक्ट कॉलेज नामांकन मिलेगा!",
        venue: "स्थान: <strong>डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM)</strong>, डी. वाई. पाटिल एजुकेशन सोसाइटी कैंपस, कोल्हापुर, महाराष्ट्र।",
        video: "हेडर सेक्शन में <strong>डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM कोल्हापुर) के खूबसूरत कैंपस का फोटो</strong> प्रदर्शित है। आधिकारिक शोकेस वीडियो चुनौतियों के ठीक ऊपर देखा जा सकता है (assets/MEDIA/footer.mp4)।",
        default: "मैं 11 सितंबर को DYPSEM कोल्हापुर में आयोजित इंडिया स्मार्ट हैकाथॉन की पूरी जानकारी के लिए उपस्थित हूँ। आप तारीख, रजिस्ट्रेशन, रोडमॅप, टीम, थीम्स, पोस्टर, समन्वयक या Idea PPT डाउनलोड के बारे में पूछ सकते हैं!"
      }
    }
  };

  // Text-To-Speech (TTS) Engine
  function speakText(rawHtml, lang) {
    if (!isTtsEnabled || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel(); // Stop any active speech

    // Strip HTML tags for clean speech synthesis
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = rawHtml;
    const cleanText = tempDiv.textContent || tempDiv.innerText || '';

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.96;
    utterance.pitch = 1.0;

    // Language code mapping
    const langCode = lang === 'mr' ? 'mr-IN' : (lang === 'hi' ? 'hi-IN' : 'en-IN');
    utterance.lang = langCode;

    // Search available voices
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === langCode || v.lang.startsWith(langCode.substring(0, 2)));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // Typewriter effect for bot responses
  function appendBotMessageWithTyping(contentHtml, shouldSpeak = true) {
    if (!chatMessages) return;

    isTyping = true;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble bot';
    
    // We will type out text gradually, then finalize HTML (for links & bold tags)
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = contentHtml;
    const plainText = tempDiv.textContent || tempDiv.innerText || '';

    bubble.innerHTML = `<span class="bot-text"></span><span class="typing-cursor"></span>`;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    const textSpan = bubble.querySelector('.bot-text');
    const cursor = bubble.querySelector('.typing-cursor');

    let charIndex = 0;
    const typingSpeed = Math.max(8, Math.min(18, 1000 / (plainText.length || 1)));

    const typeInterval = setInterval(() => {
      if (charIndex < plainText.length) {
        textSpan.textContent += plainText.charAt(charIndex);
        charIndex++;
        chatMessages.scrollTop = chatMessages.scrollHeight;
      } else {
        clearInterval(typeInterval);
        cursor.remove();
        // Replace with rich HTML (including links and formatting)
        textSpan.innerHTML = contentHtml;

        // Add Listen / Speaker button
        const speechBtn = document.createElement('button');
        speechBtn.className = 'bot-speech-btn';
        speechBtn.innerHTML = `
          <svg viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <span>Listen</span>
        `;
        speechBtn.addEventListener('click', () => {
          speakText(contentHtml, currentLang);
        });
        bubble.appendChild(speechBtn);

        chatMessages.scrollTop = chatMessages.scrollHeight;
        isTyping = false;

        // Auto speak if enabled
        if (shouldSpeak && isTtsEnabled) {
          speakText(contentHtml, currentLang);
        }
      }
    }, typingSpeed);
  }

  function appendUserMessage(text) {
    if (!chatMessages) return;
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble user';
    bubble.textContent = text;
    chatMessages.appendChild(bubble);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Match query to responses
  function processUserQuery(query) {
    const q = query.toLowerCase().trim();
    const data = chatData[currentLang] || chatData.en;
    let answer = data.answers.default;

    if (q.includes('roadmap') || q.includes('timeline') || q.includes('schedule') || q.includes('milestone') || q.includes('phases') || q.includes('stages') ||
        q.includes('रोडमॅप') || q.includes('टाईमलाईन') || q.includes('वेळापत्रक') || q.includes('चरण') || q.includes('टाइमलाइन') || q.includes('शेड्यूल')) {
      answer = data.answers.roadmap;
    } else if (q.includes('poster') || q.includes('banner') || q.includes('flyer') || q.includes('photo') || q.includes('image') ||
               q.includes('पोस्टर') || q.includes('बॅनर') || q.includes('फोटो')) {
      answer = data.answers.poster;
    } else if (q.includes('date') || q.includes('when') || q.includes('11') || q.includes('september') || 
               q.includes('तारीख') || q.includes('कधी') || q.includes('दिनांक') || q.includes('कब') || q.includes('दिन')) {
      answer = data.answers.date;
    } else if (q.includes('register') || q.includes('form') || q.includes('link') || q.includes('apply') || 
               q.includes('नोंदणी') || q.includes('अर्ज') || q.includes('रजिस्ट्रेशन') || q.includes('आवेदन')) {
      answer = data.answers.register;
    } else if (q.includes('team') || q.includes('size') || q.includes('member') || q.includes('female') || q.includes('girl') ||
               q.includes('संघ') || q.includes('सदस्य') || q.includes('महिला') || q.includes('टीम')) {
      answer = data.answers.team;
    } else if (q.includes('track') || q.includes('theme') || q.includes('domain') || q.includes('topic') || q.includes('ai') || q.includes('iot') ||
               q.includes('ट्रॅक') || q.includes('थीम') || q.includes('विषय') || q.includes('ट्रैक') || q.includes('थीम्स')) {
      answer = data.answers.tracks;
    } else if (q.includes('prize') || q.includes('award') || q.includes('cash') || q.includes('reward') || q.includes('win') ||
               q.includes('बक्षीस') || q.includes('पारितोषिक') || q.includes('पुरस्कार') || q.includes('इनाम')) {
      answer = data.answers.prizes;
    } else if (q.includes('venue') || q.includes('where') || q.includes('location') || q.includes('college') || q.includes('kolhapur') || q.includes('dypsem') ||
               q.includes('स्थळ') || q.includes('पत्ता') || q.includes('कोल्हापूर') || q.includes('स्थान') || q.includes('कहाँ') || q.includes('पता')) {
      answer = data.answers.venue;
    } else if (q.includes('ppt') || q.includes('presentation') || q.includes('template') || q.includes('format') || q.includes('slide') ||
               q.includes('पीपीटी') || q.includes('फॉर्मेट') || q.includes('फॉरमॅट') || q.includes('सादरीकरण') || q.includes('प्रस्तुति')) {
      answer = data.answers.ppt;
    } else if (q.includes('check') || q.includes('list') || q.includes('leader') || q.includes('document') || q.includes('deadline') || q.includes('require') ||
               q.includes('चेकलिस्ट') || q.includes('कागदपत्रे') || q.includes('मुदत') || q.includes('दस्तावेज') || q.includes('डेडलाइन')) {
      answer = data.answers.checklist;
    } else if (q.includes('ministr') || q.includes('gov') || q.includes('ngo') || q.includes('public') || q.includes('private') || q.includes('collaborat') || q.includes('source') ||
               q.includes('मंत्रालय') || q.includes('संस्था') || q.includes('संगठन')) {
      answer = data.answers.sources;
    } else if (q.includes('evaluat') || q.includes('judg') || q.includes('criteria') || q.includes('novelty') || q.includes('feasib') || q.includes('sustain') || q.includes('impact') || q.includes('clarity') || q.includes('practi') || q.includes('complex') || q.includes('scope') ||
               q.includes('मूल्यांकन') || q.includes('निकष') || q.includes('नाविन्य') || q.includes('मानदंड')) {
      answer = data.answers.evaluation;
    } else if (q.includes('individ') || q.includes('alone') || q.includes('single') || q.includes('एकट्याने') || q.includes('अकेले')) {
      answer = data.answers.individual;
    } else if (q.includes('another college') || q.includes('other college') || q.includes('inter college') || q.includes('cross college') ||
               q.includes('दुसरे कॉलेज') || q.includes('दुसऱ्या कॉलेज') || q.includes('दूसरे कॉलेज')) {
      answer = data.answers.intercollege;
    } else if (q.includes('how many ps') || q.includes('multiple ps') || q.includes('how many problem') || q.includes('किती ps') || q.includes('कितने ps')) {
      answer = data.answers.multiple_ps;
    } else if (q.includes('contact') || q.includes('phone') || q.includes('call') || q.includes('number') ||
               q.includes('shriniket') || q.includes('aditya') || q.includes('athrav') || q.includes('shinde') ||
               q.includes('harshad') || q.includes('teli') || q.includes('coordinator') || q.includes('helpdesk') ||
               q.includes('संपर्क') || q.includes('फोन') || q.includes('नंबर') || q.includes('समन्वयक') ||
               q.includes('अथर्व') || q.includes('हर्षद')) {
      answer = data.answers.contact;
    } else if (q.includes('video') || q.includes('teaser') || q.includes('promo') || q.includes('व्हिडिओ') || q.includes('वीडियो')) {
      answer = data.answers.video;
    }

    setTimeout(() => {
      appendBotMessageWithTyping(answer, true);
    }, 250);
  }

  // Render Language Suggestions & Placeholder
  function updateLanguageUI(lang) {
    currentLang = lang;
    const data = chatData[lang] || chatData.en;

    if (chatInput) {
      chatInput.placeholder = data.placeholder;
    }

    if (suggestionsTitle) {
      suggestionsTitle.querySelector('span').textContent = data.suggestionsHeader;
    }

    if (chatSuggestions) {
      chatSuggestions.innerHTML = '';
      data.suggestions.forEach(suggestionText => {
        const chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'suggestion-chip';
        chip.textContent = suggestionText;
        chip.addEventListener('click', () => {
          if (isTyping) return;
          appendUserMessage(suggestionText);
          processUserQuery(suggestionText);
        });
        chatSuggestions.appendChild(chip);
      });
    }

    // Greet with new language welcome message
    appendBotMessageWithTyping(data.welcome, false);
  }

  // Language Button Listeners
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (btn.classList.contains('active')) return;
      langBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const chosenLang = btn.getAttribute('data-lang') || 'en';
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      updateLanguageUI(chosenLang);
    });
  });

  // FAB Toggle
  if (chatbotFab && chatbotWindow) {
    chatbotFab.addEventListener('click', () => {
      const isOpen = chatbotWindow.classList.contains('open');
      if (isOpen) {
        chatbotWindow.classList.remove('open');
        chatbotFab.classList.remove('active');
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      } else {
        chatbotWindow.classList.add('open');
        chatbotFab.classList.add('active');
        if (chatMessages && chatMessages.children.length === 0) {
          updateLanguageUI(currentLang);
        }
        setTimeout(() => chatInput?.focus(), 200);
      }
    });

    if (closeChatbotBtn) {
      closeChatbotBtn.addEventListener('click', () => {
        chatbotWindow.classList.remove('open');
        chatbotFab.classList.remove('active');
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      });
    }
  }

  // TTS Global Toggle
  if (chatSpeechToggle) {
    chatSpeechToggle.addEventListener('click', () => {
      isTtsEnabled = !isTtsEnabled;
      if (!isTtsEnabled && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      chatSpeechToggle.classList.toggle('muted', !isTtsEnabled);
      chatSpeechToggle.title = isTtsEnabled ? 'Text to Speech Audio Enabled' : 'Text to Speech Audio Muted';
    });
  }

  // Form Submit
  if (chatForm && chatInput) {
    chatForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = chatInput.value.trim();
      if (!text || isTyping) return;
      chatInput.value = '';
      appendUserMessage(text);
      processUserQuery(text);
    });
  }

  // Pre-load voices if available
  if ('speechSynthesis' in window) {
    window.speechSynthesis.onvoiceschanged = () => {
      window.speechSynthesis.getVoices();
    };
  }

  // Initialize suggestions on load
  if (chatSuggestions) {
    const data = chatData[currentLang];
    data.suggestions.forEach(suggestionText => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'suggestion-chip';
      chip.textContent = suggestionText;
      chip.addEventListener('click', () => {
        if (isTyping) return;
        if (!chatbotWindow?.classList.contains('open')) {
          chatbotWindow?.classList.add('open');
          chatbotFab?.classList.add('active');
        }
        appendUserMessage(suggestionText);
        processUserQuery(suggestionText);
      });
      chatSuggestions.appendChild(chip);
    });
  }
});

