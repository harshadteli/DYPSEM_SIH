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
  // Multilingual Knowledge Base & Content
  const chatData = {
    en: {
      welcome: "Hello! I am your <strong>SIH Assistant</strong> for India Smart Hackathon at <strong>D Y Patil School of Engineering and Management (DYPSEM Kolhapur)</strong>. ⏰ <strong>Last Date to Register is 8 September 2026</strong>. Grand Finale is on <strong>11 September 2026</strong>. How can I help you today?",
      placeholder: "Ask about SIH, deadline, registration, tracks, roadmap...",
      suggestionsHeader: "Quick Questions:",
      suggestions: [
        "⏰ Last Date to Register?",
        "📷 Official Instagram Page",
        "📅 When is the Grand Finale?",
        "🗺️ Nodal Center Roadmap",
        "📝 How do I register?",
        "📞 Contact Coordinators",
        "📋 Team Leader Checklist & Deadline",
        "📊 Download Idea PPT Format",
        "👥 What is the team size?",
        "🎯 What are the tracks?",
        "🖼️ View Official Poster",
        "🏆 What are the prizes?"
      ],
      answers: {
        instagram: "<strong>Official DYPSEM SIH Instagram Page:</strong><br>Follow us for live event updates, photos, reels, and announcements on <strong>@hackthon/_dypsem</strong>:<div class='chat-actions-group'><a href='https://instagram.com/hackthon/_dypsem' target='_blank' class='chat-action-btn' style='background: linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888); color:#fff;'><svg viewBox='0 0 24 24'><path d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/></svg> Follow @_dypsem on Instagram</a></div>",
        date: "⏰ <strong>Important Dates for SIH 2026:</strong><br>• <strong>Last Date to Register</strong>: <strong>8 September 2026</strong> (Registrations Close Strictly!)<br>• <strong>Internal Grand Finale & Live Pitch</strong>: <strong>11 September 2026</strong> at D Y Patil School of Engineering and Management (DYPSEM Kolhapur).<br><br>👉 Make sure your 6-member team registers before 8 September!<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> Register Now Before 8 Sept</a></div>",
        roadmap: "<strong>DYPSEM SIH 2026 Nodal Center Roadmap:</strong><br>• <strong>2 Sept</strong>: Problem Statements Uploaded on Portal<br>• <strong>8 Sept 2026</strong>: ⏰ <strong>LAST DATE TO REGISTER TEAM</strong><br>• <strong>8–10 Sept</strong>: Idea Screening, Mentoring & PPT Preparation<br>• <strong>11 Sept 2026</strong>: <strong>Grand Internal Hackathon Finale & Live Pitch</strong><br>• <strong>Milestone 2</strong>: Nomination of Top Teams to National SIH Portal<br>• <strong>SIH Grand Finale</strong>: National SIH 2026 Finale Round.<br><br>👉 Check the Roadmap Graphic placed right above the Innovation Tracks section!",
        poster: "<strong>Official DYPSEM SIH 2026 Event Poster:</strong><br>The grand internal hackathon poster is live with the theme: <em>Ideas + Innovation = Impact • Think, Build, Solve • Last Date: 8 Sept 2026 • Grand Finale: 11 Sept 2026</em>.<div class='chat-actions-group'><a href='#poster' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg> View Event Poster</a></div>",
        register: "You can register your 6-member squad online via the official Google Form. ⏰ <strong>Last Date to Register is 8 September 2026</strong>:<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> Open Official Registration Form</a></div>",
        team: "Each team must consist of strictly <strong>6 members</strong>. Following Smart India Hackathon guidelines, having at least one female team member is mandatory/strongly recommended to ensure diversity and national qualification.",
        tracks: "The hackathon features 6 innovation tracks: <br>1. <strong>AI & Smart Automation</strong><br>2. <strong>Smart Agriculture & IoT</strong><br>3. <strong>Clean Energy & Green Tech</strong><br>4. <strong>Healthcare & MedTech</strong><br>5. <strong>FinTech & Cyber Security</strong><br>6. <strong>Open Innovation</strong>.<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> Explore SIH Problem Statements</a></div>",
        ppt: "You can download the official standardized presentation template here:<div class='chat-actions-group'><a href='assets/media/SIH2026-IDEA-Presentation-Format.pptx' download='SIH2026-IDEA-Presentation-Format.pptx' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg> Download SIH Idea PPT (.pptx)</a></div><br>Use this standard format for your Stage 02 Idea Submission, covering problem definition, architecture, tech stack, and impact!",
        checklist: "<strong>Team Leader Submission Checklist:</strong><br>1. Team name<br>2. College authorization letter<br>3. Team leader & member details<br>4. Gender details (1 female mandatory)<br>5. Email IDs & mobile numbers<br>6. Selected Problem Statement / Student Innovation category<br>7. Idea title & description<br>8. Idea presentation in PPT format<br><br>⏰ <strong>Last Date to Register: 8 September 2026</strong><br>🏆 <strong>Grand Finale: 11 September 2026</strong>.",
        sources: "<strong>SIH 2026 brings problem statements from:</strong><br>• <strong>Government Ministries</strong> (Central Ministries & Departments)<br>• <strong>State Governments</strong> (State Administrations & Civic Bodies)<br>• <strong>Public Organizations</strong> (PSUs & Public Sector Undertakings)<br>• <strong>Private Organizations</strong> (Enterprises, MNCs & Tech Corporates)<br>• <strong>NGOs</strong> (Non-Governmental & Social Organizations)<br>• <strong>Other Collaborating Organizations</strong> (Research Labs & Institutions)<div class='chat-actions-group'><a href='https://www.sih.gov.in/sih2026PS' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z'/></svg> View Problem Statements</a></div>",
        evaluation: "<strong>How Ideas Are Evaluated — 9 Judging Criteria:</strong><br>💡 <strong>Novelty</strong> – Originality & Creativity<br>⚙️ <strong>Complexity</strong> – Technical Depth<br>🎯 <strong>Clarity</strong> – Communication Quality<br>✅ <strong>Feasibility</strong> – Technical Viability<br>🔧 <strong>Practicability</strong> – Real-World Deployment<br>🌱 <strong>Sustainability</strong> – Long-Term Viability<br>📈 <strong>Scale of Impact</strong> – Societal Reach<br>👤 <strong>User Experience</strong> – Design & Usability<br>🚀 <strong>Future Scope</strong> – Scalability & Growth<br><br>Score high across all 9 to maximize your National SIH nomination chances!",
        individual: "<strong>Can I register individually?</strong><br>No, individual registrations are strictly not allowed. SIH is a team hackathon. You must form a 6-member squad (with at least 1 female participant) and register via your Team Leader before 8 September 2026.",
        intercollege: "<strong>Can I join another college's team?</strong><br>No, cross-college or inter-college teams are not permitted for this internal edition. All 6 members must be enrolled students of DYPSEM Kolhapur with an official College Authorization Letter.",
        multiple_ps: "<strong>How many Problem Statements (PS) can we submit?</strong><br>Each team can submit for <strong>only 1 Problem Statement</strong> (or 1 Student Innovation idea). Focus your squad's efforts on delivering a high-quality Idea PPT and architecture.",
        contact: "<strong>SIH Student Coordinators / Helpdesk:</strong><br>• <strong>Shriniket Sarshetti (Host Coordinator)</strong>: <a href='tel:+919284331824' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 92843 31824</a><br>• <strong>Aditya Avadan</strong>: <a href='tel:+919890345429' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 98903 45429</a><br>• <strong>Athrav Shinde</strong>: <a href='tel:+917499652753' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 74996 52753</a><br>• <strong>Harshad Teli</strong>: <a href='tel:+919970898012' class='chat-phone-chip'><svg viewBox='0 0 24 24'><path d='M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z'/></svg> +91 99708 98012</a><br><br>💬 <strong>Host Coordinator Instagram:</strong> For any queries, DM <a href='https://www.instagram.com/rebel330.t?igsi=OWlnZXNxd28wcnk1' target='_blank' class='chat-action-btn' style='background: linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045); color:#fff;'>DM Host Coordinator (@rebel330.t)</a>",
        prizes: "Winners receive <strong>exciting cash prizes</strong>, certificates of excellence, hardware incubation toolkits, and direct nomination for the national Smart India Hackathon round!",
        venue: "The venue is <strong>D Y Patil School of Engineering and Management (DYPSEM)</strong>, D. Y. Patil Education Society campus, Kolhapur, Maharashtra.",
        video: "The official video is playing in the background of the hero section, showcasing the <strong>DYPSEM Kolhapur campus</strong>. Another showcase video plays above the challenges section.",
        default: "I can help with all details regarding the India Smart Hackathon (SIH 2026) at DYPSEM Kolhapur.<br>⏰ <strong>Last Date to Register: 8 September 2026</strong><br>🏆 <strong>Grand Finale: 11 September 2026</strong>!"
      }
    },
    mr: {
      welcome: "नमस्कार! मी डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM) मधील <strong>इंडिया स्मार्ट हॅकाथॉन (SIH)</strong> चा सहाय्यक आहे. ⏰ <strong>नोंदणीची शेवटची तारीख ८ सप्टेंबर २०२६ आहे</strong>. कार्यक्रमाची मुख्य ग्रँड फिनाले तारीख <strong>११ सप्टेंबर २०२६</strong> आहे. मी तुम्हाला कशी मदत करू शकेन?",
      placeholder: "तारीख, मुदत, नोंदणी, संघ, ट्रॅक्स, रोडमॅप बद्दल विचारा...",
      suggestionsHeader: "वारंवार विचारले जाणारे प्रश्न:",
      suggestions: [
        "⏰ नोंदणीची शेवटची तारीख काय आहे?",
        "📅 ग्रँड फिनाले कधी आहे?",
        "🗺️ नोडल सेंटर रोडमॅप (Roadmap)",
        "📝 नोंदणी कशी करायची?",
        "📞 समन्वयक संपर्क (Coordinators)",
        "📋 टीम लीडर चेकलिस्ट व मुदत",
        "📊 Idea PPT फॉरमॅट डाउनलोड करा",
        "👥 संघात किती सदस्य असावेत?",
        "🎯 कोणते ट्रॅक्स आहेत?",
        "🖼️ अधिकृत इव्हेंट पोस्टर",
        "💡 ९ मूल्यांकन निकष",
        "🏆 बक्षिसे कोणती आहेत?"
      ],
      answers: {
        date: "⏰ <strong>SIH २०२६ महत्त्वाच्या तारखा:</strong><br>• <strong>नोंदणीची शेवटची तारीख</strong>: <strong>८ सप्टेंबर २०२६</strong> (मुदतीनंतर नोंदणी बंद)<br>• <strong>ग्रँड अंतर्गत हॅकाथॉन फिनाले</strong>: <strong>११ सप्टेंबर २०२६</strong> रोजी डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (कोल्हापूर) येथे.<br><br>👉 ८ सप्टेंबर पूर्वी आपल्या ६ सदस्यीय संघाची नोंदणी पूर्ण करा!<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> ८ सप्टें पूर्वी नोंदणी करा</a></div>",
        roadmap: "<strong>DYPSEM SIH २०२६ नोडल सेंटर रोडमॅप:</strong><br>• <strong>२ सप्टेंबर</strong>: समस्या विधाने उपलब्ध<br>• <strong>८ सप्टेंबर २०२६</strong>: ⏰ <strong>संघ नोंदणीची शेवटची तारीख</strong><br>• <strong>८–१० सप्टेंबर</strong>: आयडिया स्क्रीनिंग व सादरीकरण तयारी<br>• <strong>११ सप्टेंबर २०२६</strong>: <strong>ग्रँड अंतर्गत हॅकाथॉन फिनाले आणि थेट सादरीकरण</strong><br>• <strong>राष्ट्रीय फेरी</strong>: राष्ट्रीय SIH ग्रँड फिनाले.",
        poster: "<strong>अधिकृत SIH २०२६ इव्हेंट पोस्टर:</strong><br>पोस्टर उपलब्ध आहे! थीम: <em>Ideas + Innovation = Impact • नोंदणी मुदत: ८ सप्टें २०२६ • ग्रँड फिनाले: ११ सप्टें २०२६</em>.<div class='chat-actions-group'><a href='#poster' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/></svg> पोस्टर पहा</a></div>",
        register: "तुम्ही अधिकृत गुगल फॉर्मद्वारे नोंदणी करू शकता. ⏰ <strong>नोंदणीची शेवटची तारीख ८ सप्टेंबर २०२६ आहे</strong>:<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> अधिकृत नोंदणी फॉर्म उघडा</a></div>",
        team: "प्रत्येक संघात काटेकोरपणे <strong>६ सदस्य</strong> असणे आवश्यक आहे (किमान १ महिला सदस्य अनिवार्य).",
        tracks: "हॅकाथॉनमध्ये ६ मुख्य ट्रॅक्स आहेत: AI, स्मार्ट शेती, ग्रीन टेक, मेडटेक, फिनटेक आणि ओपन इनोव्हेशन.",
        ppt: "तुम्ही अधिकृत साचा (Template) येथून डाउनलोड करू शकता:<div class='chat-actions-group'><a href='assets/media/SIH2026-IDEA-Presentation-Format.pptx' download='SIH2026-IDEA-Presentation-Format.pptx' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg> Idea PPT डाउनलोड करा (.pptx)</a></div>",
        checklist: "<strong>संघ प्रमुखांसाठी आवश्यक चेकलिस्ट:</strong><br>१. संघाचे नाव<br>२. कॉलेज अधिकृत पत्र<br>३. ६ सदस्यांचे तपशील (१ महिला सदस्य)<br>४. निवडलेले समस्या विधान<br>५. PPT स्वरूपात सादरीकरण<br><br>⏰ <strong>नोंदणी मुदत: ८ सप्टेंबर २०२६</strong><br>🏆 <strong>ग्रँड फिनाले: ११ सप्टेंबर २०२६</strong>!",
        sources: "SIH 2026 केंद्र/राज्य सरकारे, PSUs व खाजगी कंपन्यांचे प्रॉब्लेम स्टेटमेंट आणते.",
        evaluation: "९ मुख्य निकषांवर आधारित मूल्यांकन केले जाईल.",
        individual: "नाही, वैयक्तिक नोंदणीला परवानगी नाही. ६ सदस्यांचा संघ अनिवार्य आहे.",
        intercollege: "नाही, सर्व ६ सदस्य DYPSEM कोल्हापूरचेच विद्यार्थी असावेत.",
        multiple_ps: "प्रत्येक संघ फक्त १ समस्या विधान सादर करू शकतो.",
        contact: "विद्यार्थी समन्वयक: श्रीनिकेत (+91 92843 31824), आदित्य (+91 98903 45429), अथर्व (+91 74996 52753), हर्षद (+91 99708 98012).",
        prizes: "रोख बक्षिसे, प्रमाणपत्रे आणि राष्ट्रीय SIH फेरीत कॉलेज नामांकन मिळेल!",
        venue: "डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM), कोल्हापूर.",
        video: "डीवायपीटीईएम कॅम्पसचा पार्श्वभूमी व्हिडिओ सुरू आहे.",
        default: "⏰ <strong>नोंदणीची शेवटची तारीख: ८ सप्टेंबर २०२६</strong><br>🏆 <strong>ग्रँड फिनाले: ११ सप्टेंबर २०२६</strong>!"
      }
    },
    hi: {
      welcome: "नमस्ते! मैं डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM) में <strong>इंडिया स्मार्ट हैकाथॉन (SIH)</strong> का सहायक हूँ। ⏰ <strong>रजिस्ट्रेशन की अंतिम तिथि 8 सितंबर 2026 है</strong>। ग्रैंड फिनाले <strong>11 सितंबर 2026</strong> को है। मैं आपकी क्या सहायता कर सकता हूँ?",
      placeholder: "तारीख, अंतिम तिथि, रजिस्ट्रेशन, टीम, थीम्स के बारे में पूछें...",
      suggestionsHeader: "सुझाए गए प्रश्न:",
      suggestions: [
        "⏰ रजिस्ट्रेशन की अंतिम तिथि क्या है?",
        "📅 ग्रैंड फिनाले कब है?",
        "🗺️ नोडल सेंटर रोडमॅप (Roadmap)",
        "📝 रजिस्ट्रेशन कैसे करें?",
        "📞 समन्वयक संपर्क (Coordinators)",
        "📋 टीम लीडर चेकलिस्ट और डेडलाइन",
        "📊 Idea PPT फॉर्मेट डाउनलोड करें",
        "👥 टीम में कितने सदस्य होने चाहिए?",
        "🎯 थीम्स और ट्रैक्स कौन से हैं?",
        "🖼️ आधिकारिक इवेंट पोस्टर",
        "💡 9 मूल्यांकन मानदंड",
        "🏆 पुरस्कार क्या हैं?"
      ],
      answers: {
        date: "⏰ <strong>SIH 2026 की महत्वपूर्ण तिथियाँ:</strong><br>• <strong>रजिस्ट्रेशन की अंतिम तिथि</strong>: <strong>8 सितंबर 2026</strong> (समय सीमा के बाद फॉर्म बंद)<br>• <strong>ग्रैंड इंटरनल हैकाथॉन फिनाले एवं लाइव पिचिंग</strong>: <strong>11 सितंबर 2026</strong> को DYPSEM कोल्हापुर में।<br><br>👉 8 सितंबर से पहले अपनी 6-सदस्यीय टीम का रजिस्ट्रेशन अवश्य पूरा करें!<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> 8 सितंबर से पहले रजिस्ट्रेशन करें</a></div>",
        roadmap: "<strong>DYPSEM SIH 2026 नोडल सेंटर रोडमॅप:</strong><br>• <strong>2 सितंबर</strong>: प्रॉब्लम स्टेटमेंट्स जारी<br>• <strong>8 सितंबर 2026</strong>: ⏰ <strong>टीम रजिस्ट्रेशन की अंतिम तिथि</strong><br>• <strong>8–10 सितंबर</strong>: आइडिया स्क्रीनिंग एवं PPT तैयारी<br>• <strong>11 सितंबर 2026</strong>: <strong>ग्रैंड इंटरनल हैकाथॉन फिनाले एवं लाइव पिचिंग</strong><br>• <strong>राष्ट्रीय राउंड</strong>: राष्ट्रीय SIH 2026 फिनाले।",
        poster: "आधिकारिक हैकाथॉन पोस्टर जारी हो चुका है! थीम: <em>Ideas + Innovation = Impact • रजिस्ट्रेशन अंतिम तिथि: 8 सितंबर 2026 • ग्रैंड फिनाले: 11 सितंबर 2026</em>.",
        register: "आप आधिकारिक गूगल फॉर्म के माध्यम से 6-सदस्यीय टीम का रजिस्ट्रेशन कर सकते हैं। ⏰ <strong>रजिस्ट्रेशन की अंतिम तिथि 8 सितंबर 2026 है</strong>:<div class='chat-actions-group'><a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z'/></svg> आधिकारिक फॉर्म खोलें</a></div>",
        team: "प्रत्येक टीम में अनिवार्य रूप से <strong>6 सदस्य</strong> होने चाहिए (कम से कम 1 महिला सदस्य अनिवार्य)।",
        tracks: "हैकाथॉन में 6 मुख्य इनोवेशन ट्रैक्स शामिल हैं: AI, कृषि, क्लीन टेक, हेल्थकेयर, फिनटेक और ओपन इनोवेशन।",
        ppt: "आइडिया PPT फॉर्मेट डाउनलोड करें:<div class='chat-actions-group'><a href='assets/media/SIH2026-IDEA-Presentation-Format.pptx' download='SIH2026-IDEA-Presentation-Format.pptx' class='chat-action-btn'><svg viewBox='0 0 24 24'><path d='M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z'/></svg> Idea PPT डाउनलोड करें (.pptx)</a></div>",
        checklist: "⏰ <strong>रजिस्ट्रेशन की अंतिम तिथि: 8 सितंबर 2026</strong><br>🏆 <strong>ग्रैंड फिनाले: 11 सितंबर 2026</strong>!",
        sources: "प्रॉब्लम स्टेटमेंट्स सरकारी मंत्रालयों, राज्य सरकारों और कंपनियों द्वारा प्रदान किए जाते हैं।",
        evaluation: "9 जजिंग क्राइटेरिया के आधार पर मूल्यांकन किया जाएगा।",
        individual: "नहीं, व्यक्तिगत रजिस्ट्रेशन की अनुमति नहीं है। 6-सदस्यीय टीम अनिवार्य है।",
        intercollege: "नहीं, सभी 6 सदस्य DYPSEM कोल्हापुर के ही होने चाहिए।",
        multiple_ps: "प्रत्येक टीम केवल 1 प्रॉब्लम स्टेटमेंट सबमिट कर सकती है।",
        contact: "छात्र समन्वयक: श्रीनीकेत (+91 92843 31824), आदित्य (+91 98903 45429), अथर्व (+91 74996 52753), हर्षद (+91 99708 98012)।",
        prizes: "नकद पुरस्कार, प्रमाण पत्र और राष्ट्रीय राउंड के लिए डायरेक्ट नामांकन।",
        venue: "डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM कोल्हापुर)।",
        video: "DYPSEM कैंपस बैकग्राउंड वीडियो चल रहा है।",
        default: "⏰ <strong>रजिस्ट्रेशन की अंतिम तिथि: 8 सितंबर 2026</strong><br>🏆 <strong>ग्रैंड फिनाले: 11 सितंबर 2026</strong>!"
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


/* ==========================================================================
   Hero Typewriter Effect — Hackathon Name + Rotating Slogans
   ========================================================================== */
(function heroTypewriter() {
  const wordEl   = document.getElementById('heroTypeWord');
  const sloganEl = document.getElementById('heroTypeSlogan');
  if (!wordEl || !sloganEl) return;

  // ── Words typed in the title line (after "Smart India") ─────────────────
  const titleWords = [
    'Hackathon SIH',
    'Innovation 2026',
    'Grand Finale',
    'Hackathon SIH'   // loops back
  ];

  // ── Slogans typed below the title ────────────────────────────────────────
  const slogans = [
    'LAST DATE TO REGISTER: 8 SEPTEMBER 2026',
    'REGISTER BEFORE 8 SEPT 2026!',
    'YOUR IDEA CAN CHANGE TOMORROW',
    'IDEAS + INNOVATION = IMPACT',
    'THINK • BUILD • SOLVE',
    'D Y Patil School of Engineering',
    'Grand Finale: 11 September 2026'
  ];

  const SPEED_TYPE   = 60;   // ms per char while typing
  const SPEED_DEL    = 30;   // ms per char while deleting
  const PAUSE_AFTER  = 1800; // ms pause after word fully typed
  const PAUSE_BEFORE = 350;  // ms pause before deleting

  let wIdx = 0, sIdx = 0;

  // ── Title typewriter ────────────────────────────────────────────────────
  function typeWord(word, i, cb) {
    if (i <= word.length) {
      wordEl.textContent = word.slice(0, i);
      setTimeout(() => typeWord(word, i + 1, cb), SPEED_TYPE);
    } else {
      setTimeout(cb, PAUSE_AFTER);
    }
  }

  function deleteWord(word, i, cb) {
    if (i >= 0) {
      wordEl.textContent = word.slice(0, i);
      setTimeout(() => deleteWord(word, i - 1, cb), SPEED_DEL);
    } else {
      setTimeout(cb, PAUSE_BEFORE);
    }
  }

  function cycleTitle() {
    const word = titleWords[wIdx % titleWords.length];
    typeWord(word, 0, () => {
      deleteWord(word, word.length, () => {
        wIdx++;
        cycleTitle();
      });
    });
  }

  // ── Slogan typewriter (starts 800ms after title begins) ─────────────────
  function typeSlogan(slogan, i, cb) {
    if (i <= slogan.length) {
      sloganEl.textContent = slogan.slice(0, i);
      setTimeout(() => typeSlogan(slogan, i + 1, cb), SPEED_TYPE);
    } else {
      setTimeout(cb, PAUSE_AFTER + 200);
    }
  }

  function deleteSlogan(slogan, i, cb) {
    if (i >= 0) {
      sloganEl.textContent = slogan.slice(0, i);
      setTimeout(() => deleteSlogan(slogan, i - 1, cb), SPEED_DEL);
    } else {
      setTimeout(cb, PAUSE_BEFORE);
    }
  }

  function cycleSlogan() {
    const slogan = slogans[sIdx % slogans.length];
    typeSlogan(slogan, 0, () => {
      deleteSlogan(slogan, slogan.length, () => {
        sIdx++;
        cycleSlogan();
      });
    });
  }

  // Start both sequences
  cycleTitle();
  setTimeout(cycleSlogan, 800);
})();
