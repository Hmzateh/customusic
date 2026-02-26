/* ============================================
   LuvTune Clone — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ============ QUIZ STATE ============
    const quizData = {
        occasion: '',
        recipientName: '',
        relationship: '',
        genre: '',
        mood: '',
        voice: '',
        senderName: '',
        story: '',
        specialRequests: ''
    };

    let currentStep = 1;
    const totalSteps = 6;

    // ============ QUIZ NAVIGATION ============
    const quizSteps = document.querySelectorAll('.quiz-step');
    const progressBar = document.getElementById('quizProgressBar');
    const stepLabel = document.getElementById('currentStep');

    function goToStep(step) {
        if (step < 1 || step > totalSteps) return;
        
        quizSteps.forEach(s => s.classList.remove('active'));
        document.querySelector(`[data-step="${step}"]`).classList.add('active');
        
        currentStep = step;
        progressBar.style.width = `${(step / totalSteps) * 100}%`;
        stepLabel.textContent = step;

        // Update summary on last step
        if (step === totalSteps) updateSummary();

        // Scroll quiz into view
        document.getElementById('quiz').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Next/Back buttons
    document.querySelectorAll('.quiz-next').forEach(btn => {
        btn.addEventListener('click', () => {
            saveStepData();
            goToStep(currentStep + 1);
        });
    });

    document.querySelectorAll('.quiz-back').forEach(btn => {
        btn.addEventListener('click', () => goToStep(currentStep - 1));
    });

    function saveStepData() {
        quizData.recipientName = document.getElementById('recipientName')?.value || quizData.recipientName;
        quizData.relationship = document.getElementById('relationship')?.value || quizData.relationship;
        quizData.senderName = document.getElementById('senderName')?.value || quizData.senderName;
        quizData.story = document.getElementById('story')?.value || quizData.story;
        quizData.specialRequests = document.getElementById('specialRequests')?.value || quizData.specialRequests;
    }

    function updateSummary() {
        document.getElementById('sumOccasion').textContent = quizData.occasion || '—';
        document.getElementById('sumRecipient').textContent = quizData.recipientName || '—';
        document.getElementById('sumRelationship').textContent = quizData.relationship || '—';
        document.getElementById('sumGenre').textContent = quizData.genre || '—';
        document.getElementById('sumMood').textContent = quizData.mood || '—';
        document.getElementById('sumVoice').textContent = quizData.voice || '—';
    }

    // ============ SELECTION BUTTONS ============
    // Occasion
    document.querySelectorAll('.occasion-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.occasion-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            quizData.occasion = btn.dataset.value;
            // Auto advance after short delay
            setTimeout(() => goToStep(2), 400);
        });
    });

    // Genre
    document.querySelectorAll('.genre-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.genre-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            quizData.genre = btn.dataset.value;
        });
    });

    // Mood
    document.querySelectorAll('.mood-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mood-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            quizData.mood = btn.dataset.value;
        });
    });

    // Voice
    document.querySelectorAll('.voice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.voice-btn').forEach(b => b.classList.remove('selected'));
            btn.classList.add('selected');
            quizData.voice = btn.dataset.value;
        });
    });

    // ============ CHARACTER COUNT ============
    const storyField = document.getElementById('story');
    const storyCount = document.getElementById('storyCount');
    if (storyField && storyCount) {
        storyField.addEventListener('input', () => {
            storyCount.textContent = storyField.value.length;
        });
    }

    // ============ CHECKOUT BUTTON ============
    document.getElementById('checkoutBtn')?.addEventListener('click', () => {
        saveStepData();
        
        // Validate required fields
        if (!quizData.occasion || !quizData.recipientName || !quizData.genre || !quizData.mood || !quizData.voice || !quizData.story) {
            alert('Please fill in all required fields before checking out.');
            return;
        }

        // In production, this would submit to your backend / Shopify cart
        // For now, log the data and show confirmation
        console.log('Order Data:', quizData);
        
        // Redirect to Shopify checkout or payment page
        // window.location.href = '/cart/add?id=VARIANT_ID&properties[occasion]=' + encodeURIComponent(quizData.occasion) + ...
        
        alert('🎵 Order submitted! In production, this redirects to Shopify checkout.\n\nCheck console for order data.');
    });

    // ============ FAQ ACCORDION ============
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            
            // Close all others
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
            
            if (!isOpen) item.classList.add('open');
        });
    });

    // ============ SCROLL REVEAL ============
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.scroll-reveal').forEach(el => observer.observe(el));

    // ============ STAT COUNTER ANIMATION ============
    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.dataset.count);
                animateCounter(el, target);
                statObserver.unobserve(el);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(el => statObserver.observe(el));

    function animateCounter(el, target) {
        const duration = 2000;
        const start = performance.now();
        
        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            
            el.textContent = current.toLocaleString();
            
            if (progress < 1) requestAnimationFrame(update);
        }
        
        requestAnimationFrame(update);
    }

    // ============ NAVBAR SCROLL EFFECT ============
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const navbar = document.getElementById('navbar');
        const scrollY = window.scrollY;
        
        if (scrollY > 100) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.85)';
        }
        
        lastScroll = scrollY;
    });

    // ============ SMOOTH SCROLL FOR ANCHORS ============
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ============ SAMPLE PLAY BUTTONS (PLACEHOLDER) ============
    document.querySelectorAll('.sample-play').forEach(btn => {
        btn.addEventListener('click', () => {
            const waveSpans = btn.querySelectorAll('.sample-wave span');
            const isPlaying = btn.classList.contains('playing');
            
            // Stop all others
            document.querySelectorAll('.sample-play').forEach(b => {
                b.classList.remove('playing');
                b.querySelector('.play-btn').textContent = '▶';
                b.querySelectorAll('.sample-wave span').forEach(s => s.style.animation = '');
            });
            
            if (!isPlaying) {
                btn.classList.add('playing');
                btn.querySelector('.play-btn').textContent = '⏸';
                waveSpans.forEach((span, i) => {
                    span.style.animation = `waveAnim 0.8s ${i * 0.1}s ease-in-out infinite alternate`;
                });
            }
        });
    });

    // Add wave animation dynamically
    const waveStyle = document.createElement('style');
    waveStyle.textContent = `
        @keyframes waveAnim {
            from { height: 6px; opacity: 0.3; }
            to { height: 28px; opacity: 1; }
        }
    `;
    document.head.appendChild(waveStyle);

    // ============ MOBILE MENU ============
    const mobileToggle = document.getElementById('mobileToggle');
    const navLinks = document.querySelector('.nav-links');
    
    mobileToggle?.addEventListener('click', () => {
        navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '64px';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.background = 'rgba(10, 10, 15, 0.98)';
        navLinks.style.padding = '1rem 1.5rem';
        navLinks.style.borderBottom = '1px solid rgba(255,255,255,0.06)';
    });

});
