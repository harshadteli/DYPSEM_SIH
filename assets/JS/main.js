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
      welcome: "Hello! I am your <strong>SIH Assistant</strong> for India Smart Hackathon at <strong>D Y Patil School of Engineering and Management</strong>. The grand finale is on <strong>11 September</strong>. How can I help you?",
      placeholder: "Ask about SIH, date, registration, tracks...",
      suggestionsHeader: "Quick Questions:",
      suggestions: [
        "📅 When is the event?",
        "📝 How do I register?",
        "👥 What is the team size?",
        "🎯 What are the tracks?",
        "🏆 What are the prizes?",
        "📍 Where is the venue?"
      ],
      answers: {
        date: "The <strong>India Smart Hackathon (SIH)</strong> grand finale will take place on <strong>11 September 2026</strong> at D Y Patil School of Engineering and Management (DYPSEM Kolhapur). Registrations are open right now!",
        register: "You can register your team online via the official Google Form: <a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' style='color:#1a73e8; font-weight:700; text-decoration:underline;'>Click Here to Register</a>.",
        team: "Each team must consist of <strong>6 members</strong>. Following Smart India Hackathon guidelines, having at least one female team member is strongly recommended to ensure diversity and national qualification.",
        tracks: "The hackathon features 6 innovation tracks: <br>1. <strong>AI & Smart Automation</strong><br>2. <strong>Smart Agriculture & IoT</strong><br>3. <strong>Clean Energy & Green Tech</strong><br>4. <strong>Healthcare & MedTech</strong><br>5. <strong>FinTech & Cyber Security</strong><br>6. <strong>Open Innovation</strong>.",
        prizes: "Winners receive <strong>exciting cash prizes</strong>, certificates of excellence, hardware incubation toolkits, and direct nomination for the national Smart India Hackathon round!",
        venue: "The venue is <strong>D Y Patil School of Engineering and Management</strong>, D. Y. Patil Education Society campus, Kolhapur, Maharashtra.",
        video: "The official video teaser is playing right at the top of the header section (taken from <code>assets/MEDIA/dyptemsih.mp4</code>).",
        default: "I can help with all details regarding the India Smart Hackathon on <strong>11 September</strong> at DYPSEM Kolhapur. Feel free to ask about registration, teams, tracks, or prizes!"
      }
    },
    mr: {
      welcome: "नमस्कार! मी डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM) मधील <strong>इंडिया स्मार्ट हॅकाथॉन (SIH)</strong> चा सहाय्यक आहे. कार्यक्रमाची मुख्य तारीख <strong>११ सप्टेंबर</strong> आहे. मी तुम्हाला कशी मदत करू शकेन?",
      placeholder: "तारीख, नोंदणी, संघ, ट्रॅक्सबद्दल विचारा...",
      suggestionsHeader: "वारंवार विचारले जाणारे प्रश्न:",
      suggestions: [
        "📅 कार्यक्रमाची तारीख काय आहे?",
        "📝 नोंदणी कशी करायची?",
        "👥 संघात किती सदस्य असावेत?",
        "🎯 कोणते ट्रॅक्स आहेत?",
        "🏆 बक्षिसे कोणती आहेत?",
        "📍 कार्यक्रमाचे स्थळ कुठे आहे?"
      ],
      answers: {
        date: "<strong>इंडिया स्मार्ट हॅकाथॉन (SIH)</strong> ची ग्रँड फिनाले <strong>११ सप्टेंबर</strong> रोजी डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (कोल्हापूर) येथे होणार आहे. नोंदणी सध्या सुरू आहे!",
        register: "तुम्ही अधिकृत गुगल फॉर्म लिंकद्वारे आपल्या संघाची नोंदणी करू शकता: <a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' style='color:#1a73e8; font-weight:700; text-decoration:underline;'>येथे क्लिक करून नोंदणी करा</a>.",
        team: "प्रत्येक संघात <strong>६ सदस्य</strong> असणे आवश्यक आहे. राष्ट्रीय SIH नियमांनुसार संघात किमान एका महिला सदस्याचा समावेश असणे शिफारस केलेले आहे.",
        tracks: "हॅकाथॉनमध्ये ६ मुख्य ट्रॅक्स आहेत: <br>१. <strong>AI आणि स्मार्ट ऑटोमेशन</strong><br>२. <strong>स्मार्ट शेती आणि IoT</strong><br>३. <strong>हरित ऊर्जा आणि ग्रीन टेक</strong><br>४. <strong>आरोग्य सेवा आणि मेडटेक</strong><br>५. <strong>फिनटेक आणि सायबर सुरक्षा</strong><br>६. <strong>मुक्त नवकल्पना (Open Innovation)</strong>.",
        prizes: "विजेत्या संघांना <strong>आकर्षक रोख बक्षिसे</strong>, प्रमाणपत्रे, हार्डवेअर किट्स आणि राष्ट्रीय स्तरावरील SIH फेरीत थेट कॉलेज नामांकन व मार्गदर्शन मिळेल!",
        venue: "कार्यक्रमाचे स्थळ: <strong>डी वाय पाटील स्कूल ऑफ इंजिनिअरिंग अँड मॅनेजमेंट (DYPSEM)</strong>, डी. वाय. पाटील एज्युकेशन सोसायटी परिसर, कोल्हापूर, महाराष्ट्र.",
        video: "अधिकृत व्हिडिओ टीझर वरच्या हेडर विभागात म्यूटेड ऑटोप्लेसह सुरू आहे (assets/MEDIA/dyptemsih.mp4).",
        default: "मी ११ सप्टेंबर रोजी होणाऱ्या डीवायपीटीईएम SIH हॅकाथॉनच्या सर्व माहितीसाठी येथे आहे. आपण तारीख, नोंदणी, संघ, ट्रॅक्स किंवा बक्षिसांविषयी विचारू शकता!"
      }
    },
    hi: {
      welcome: "नमस्ते! मैं डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM) में <strong>इंडिया स्मार्ट हैकाथॉन (SIH)</strong> का सहायक हूँ। इस कार्यक्रम का ग्रैंड फिनाले <strong>11 सितंबर</strong> को है। मैं आपकी क्या सहायता कर सकता हूँ?",
      placeholder: "तारीख, रजिस्ट्रेशन, टीम, थीम्स के बारे में पूछें...",
      suggestionsHeader: "सुझाए गए प्रश्न:",
      suggestions: [
        "📅 कार्यक्रम की तारीख क्या है?",
        "📝 रजिस्ट्रेशन कैसे करें?",
        "👥 टीम में कितने सदस्य होने चाहिए?",
        "🎯 थीम्स और ट्रैक्स कौन से हैं?",
        "🏆 पुरस्कार क्या हैं?",
        "📍 कार्यक्रम का स्थान कहाँ है?"
      ],
      answers: {
        date: "<strong>इंडिया स्मार्ट हैकाथॉन (SIH)</strong> का ग्रैंड फिनाले <strong>11 सितंबर</strong> को डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (कोल्हापुर) में आयोजित किया जाएगा। रजिस्ट्रेशन प्रारंभ हैं!",
        register: "आप आधिकारिक गूगल फॉर्म के माध्यम से अपनी टीम का रजिस्ट्रेशन कर सकते हैं: <a href='https://forms.gle/QCQWTcSJoKSEKExD9' target='_blank' style='color:#1a73e8; font-weight:700; text-decoration:underline;'>यहाँ क्लिक करके रजिस्ट्रेशन करें</a>.",
        team: "प्रत्येक टीम में <strong>6 सदस्य</strong> होने अनिवार्य हैं। राष्ट्रीय SIH दिशानिर्देशों के तहत विविधता और चयन के लिए कम से कम एक महिला सदस्य होना दृढ़ता से अनुशंसित है।",
        tracks: "हैकाथॉन में 6 मुख्य इनोवेशन ट्रैक्स शामिल हैं: <br>1. <strong>AI और स्मार्ट ऑटोमेशन</strong><br>2. <strong>स्मार्ट कृषि और IoT</strong><br>3. <strong>स्वच्छ ऊर्जा और ग्रीन टेक</strong><br>4. <strong>हेल्थकेयर और मेडटेक</strong><br>5. <strong>फिनटेक और साइबर सुरक्षा</strong><br>6. <strong>ओपन इनोवेशन</strong>.",
        prizes: "विजेता टीमों को <strong>आकर्षक नकद पुरस्कार</strong>, उत्कृष्टता प्रमाण पत्र, हार्डवेयर किट्स, और राष्ट्रीय स्मार्ट इंडिया हैकाथॉन के लिए डायरेक्ट कॉलेज नामांकन मिलेगा!",
        venue: "स्थान: <strong>डी वाई पाटिल स्कूल ऑफ इंजीनियरिंग एंड मैनेजमेंट (DYPSEM)</strong>, डी. वाई. पाटिल एजुकेशन सोसाइटी कैंपस, कोल्हापुर, महाराष्ट्र।",
        video: "आधिकारिक वीडियो टीज़र ऊपर हेडर सेक्शन में म्यूटेड ऑटोप्ले के साथ देखा जा सकता है (assets/MEDIA/dyptemsih.mp4)।",
        default: "मैं 11 सितंबर को DYPSEM कोल्हापुर में आयोजित इंडिया स्मार्ट हैकाथॉन की पूरी जानकारी के लिए उपस्थित हूँ। आप तारीख, रजिस्ट्रेशन, टीम, थीम्स या पुरस्कारों के बारे में पूछ सकते हैं!"
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
    const typingSpeed = Math.max(10, Math.min(22, 1200 / (plainText.length || 1)));

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

    if (q.includes('date') || q.includes('when') || q.includes('11') || q.includes('september') || 
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

