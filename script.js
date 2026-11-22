/**
 * Happy Birthday Karti - Main Interactive Script
 * Handles all animations, games, audio triggers, magic orb, and customizer
 */

// State Management & Migration
let initGf = localStorage.getItem('bday_gfName');
if (!initGf || initGf.toLowerCase() === 'trisha') {
    initGf = 'Karti';
    localStorage.setItem('bday_gfName', 'Karti');
}

let initBf = localStorage.getItem('bday_bfName');
if (!initBf || initBf.toLowerCase() === 'rexon') {
    initBf = 'Tarun';
    localStorage.setItem('bday_bfName', 'Tarun');
}

const appState = {
    gfName: initGf,
    bfName: initBf,
    bdayDate: localStorage.getItem('bday_date') || '23 November',
    letterMsg: localStorage.getItem('bday_letter') || '',
    savedCoupons: JSON.parse(localStorage.getItem('bday_coupons') || '[]'),
    soundEnabled: true,
    musicEnabled: false
};

// ==========================================================================
// 1. INITIALIZATION & PERSONALIZATION SYNC
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
    applyPersonalization();
    initParticleCanvas();
    initMagicStardustOrb();
    initHeroInteractions();
    initCakeCeremony();
    initArcadeNavigation();
    initCatchGame();
    initMemoryGame();
    initBalloonGame();
    initWheelGame();
    initCupidGame();
    initReasonsCarousel();
    initModals();
    initPersonalizationForm();
    renderSavedCoupons();
    initAudioControls();
});

// Sync state to all DOM elements
function applyPersonalization() {
    const { gfName, bfName, bdayDate, letterMsg } = appState;

    setText('disp-btn-name', `Click Here ${gfName}`);
    setText('disp-btn-promises', `${bfName}'s Promises`);
    setText('disp-env-name', gfName);
    setText('disp-seal-letter', gfName.charAt(0).toUpperCase());
    setText('disp-dear-name', `✨ ${gfName}'s Wish Orb ✨`);
    setText('disp-cake-name', gfName);
    setText('disp-surprise-name', gfName);
    setText('disp-letter-recipient', gfName);
    setText('disp-letter-sender', `${bfName} ❤️`);
    setText('disp-footer-gf', gfName);
    setText('disp-footer-bf', bfName);
    document.title = `Happy Birthday ${gfName}! 💖`;

    setText('disp-date', bdayDate);
    setText('disp-letter-date', `${bdayDate}, 2026`);

    if (letterMsg && letterMsg.trim().length > 0) {
        const bodyEl = document.getElementById('disp-letter-body');
        if (bodyEl) {
            bodyEl.innerHTML = letterMsg.split('\n\n').map(p => `<p>${escapeHtml(p)}</p>`).join('');
        }
    }
}

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ==========================================================================
// 2. BACKGROUND AMBIENT PARTICLES
// ==========================================================================
function initParticleCanvas() {
    const canvas = document.getElementById('sparkle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const count = Math.min(Math.floor(width / 35), 35);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 14 + 10,
            speedY: Math.random() * 0.6 + 0.3,
            speedX: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.2,
            type: Math.random() > 0.4 ? 'heart' : 'sparkle',
            color: ['#ff8fa3', '#ffccd5', '#ffb3c6', '#fed976'][Math.floor(Math.random() * 4)]
        });
    }

    function render() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y -= p.speedY;
            p.x += p.speedX;

            if (p.y < -30) {
                p.y = height + 20;
                p.x = Math.random() * width;
            }

            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.font = `${p.size}px sans-serif`;
            ctx.fillStyle = p.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.type === 'heart' ? '💖' : '✨', p.x, p.y);
            ctx.restore();
        });

        requestAnimationFrame(render);
    }

    render();
}

// ==========================================================================
// 3. CREATIVE CENTERPIECE: MAGIC BIRTHDAY STARDUST SNOWGLOBE ORB
// ==========================================================================
function initMagicStardustOrb() {
    const canvas = document.getElementById('orb-canvas');
    const sphere = document.getElementById('magic-orb');
    const wishPopup = document.getElementById('orb-wish-popup');
    const wishText = document.getElementById('orb-wish-text');

    if (!canvas || !sphere) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width = 280;
    const h = canvas.height = 280;
    const cx = w / 2;
    const cy = h / 2;

    const magicalWishes = [
        `"You are ${appState.bfName}'s greatest wish come true! 💖"`,
        `"May this year bring ${appState.gfName} endless joy and success! ✨"`,
        `"Prophecy: You are destined for unlimited pampering today! 👑"`,
        `"Stardust Blessing: Your smile will illuminate the entire world! 🌟"`,
        `"${appState.bfName} loves you to the ends of the universe and back! 💕"`,
        `"May every single candle you blow grant your sweetest dream! 🎂"`,
        `"A lifetime of laughter, cute dates, and warm hugs awaits you! 🌸"`,
        `"You are 100% certified the most adorable girl on Earth! 🥰"`
    ];

    // Swirling stardust stars inside the globe
    const stars = [];
    for (let i = 0; i < 65; i++) {
        stars.push({
            r: Math.random() * 95 + 10,
            angle: Math.random() * Math.PI * 2,
            speed: (Math.random() * 0.02 + 0.008) * (Math.random() > 0.5 ? 1 : -1),
            size: Math.random() * 3 + 1.2,
            color: ['#ffffff', '#ffd166', '#ff9ebb', '#a0c4ff', '#ffcbf2'][Math.floor(Math.random() * 5)],
            pulse: Math.random() * Math.PI,
            pulseSpeed: Math.random() * 0.05 + 0.02
        });
    }

    let shakeEnergy = 0;

    function renderOrb() {
        ctx.clearRect(0, 0, w, h);

        // Circular clipping
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, 130, 0, Math.PI * 2);
        ctx.clip();

        // Deep cosmos gradient
        const bgGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, 130);
        bgGrad.addColorStop(0, '#2e143f');
        bgGrad.addColorStop(0.6, '#180a25');
        bgGrad.addColorStop(1, '#0b0312');
        ctx.fillStyle = bgGrad;
        ctx.fillRect(0, 0, w, h);

        // Pulsing central aura
        const aura = ctx.createRadialGradient(cx, cy, 0, cx, cy, 75);
        aura.addColorStop(0, 'rgba(255, 101, 132, 0.45)');
        aura.addColorStop(0.7, 'rgba(255, 190, 11, 0.15)');
        aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = aura;
        ctx.beginPath();
        ctx.arc(cx, cy, 75, 0, Math.PI * 2);
        ctx.fill();

        // Central Heart Glow
        ctx.save();
        const heartPulse = 1 + Math.sin(Date.now() * 0.004) * 0.08 + (shakeEnergy * 0.02);
        ctx.translate(cx, cy - 6);
        ctx.scale(heartPulse, heartPulse);
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', 0, 0);
        ctx.restore();

        // Stars & swirling stardust
        stars.forEach(s => {
            const currentSpeed = s.speed * (1 + shakeEnergy * 3.5);
            s.angle += currentSpeed;
            s.pulse += s.pulseSpeed;

            const x = cx + Math.cos(s.angle) * s.r;
            const y = cy + Math.sin(s.angle) * s.r;

            ctx.save();
            ctx.globalAlpha = Math.min(1, Math.max(0.2, 0.5 + Math.sin(s.pulse) * 0.5));
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(x, y, s.size * (1 + shakeEnergy * 0.2), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });

        if (shakeEnergy > 0) {
            shakeEnergy *= 0.94;
            if (shakeEnergy < 0.02) shakeEnergy = 0;
        }

        ctx.restore();
        requestAnimationFrame(renderOrb);
    }

    renderOrb();

    // Click to Shake Orb Event
    sphere.addEventListener('click', (e) => {
        sound.playSparkle();
        shakeEnergy = 5.0;

        // Shake animation
        sphere.classList.add('shaking');
        setTimeout(() => sphere.classList.remove('shaking'), 650);

        fireConfettiBurst(e.clientX, e.clientY);

        // Show randomized wish prophecy
        const randomWish = magicalWishes[Math.floor(Math.random() * magicalWishes.length)];
        wishText.textContent = randomWish;
        wishPopup.classList.remove('hidden');

        wishPopup.style.animation = 'none';
        void wishPopup.offsetHeight;
        wishPopup.style.animation = 'popIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
}

// ==========================================================================
// 4. HERO INTERACTIVITY & BUTTON TRIGGERS
// ==========================================================================
function initHeroInteractions() {
    // Clickable Balloons on Hero
    ['balloon-hero-1', 'balloon-hero-2'].forEach(id => {
        const balloon = document.getElementById(id);
        if (!balloon) return;
        balloon.addEventListener('click', (e) => {
            sound.playBalloonPop();
            fireConfettiBurst(e.clientX, e.clientY);
            balloon.style.transform = 'scale(0.1)';
            balloon.style.opacity = '0';
            setTimeout(() => {
                balloon.style.transform = '';
                balloon.style.opacity = '1';
            }, 3000);
        });
    });

    // Retro Smiley Face Sticker
    const smiley = document.getElementById('smiley-face');
    if (smiley) {
        smiley.addEventListener('click', (e) => {
            sound.playPop(600);
            smiley.style.transform = 'scale(1.3) rotate(25deg)';
            fireConfettiBurst(e.clientX, e.clientY, ['#ff6584', '#ffbe0b']);
            setTimeout(() => smiley.style.transform = '', 400);
        });
    }

    // Top Stamp Badge
    const stamp = document.getElementById('bday-stamp');
    if (stamp) {
        stamp.addEventListener('click', (e) => {
            sound.playSparkle();
            fireConfettiBurst(e.clientX, e.clientY);
        });
    }

    // Date Badge
    const dateBadge = document.getElementById('date-badge');
    if (dateBadge) {
        dateBadge.addEventListener('click', (e) => {
            sound.playPop(520);
            fireConfettiBurst(e.clientX, e.clientY);
        });
    }

    // Button 1: "💖 Click Here Karti" -> Opens Birthday Surprise Modal
    const btnClickHere = document.getElementById('btn-click-here');
    if (btnClickHere) {
        btnClickHere.addEventListener('click', () => {
            sound.playSparkle();
            fireConfettiShower();
            openModal('modal-surprise');
        });
    }

    // Button 2: "⭐ Tarun's Promises" -> Opens Tarun's 10 Romantic Promises Modal!
    const btnTarunPromises = document.getElementById('btn-tarun-promises');
    if (btnTarunPromises) {
        btnTarunPromises.addEventListener('click', () => {
            sound.playSparkle();
            fireConfettiShower();
            openModal('modal-promises');
        });
    }

    // Envelope: "TO Karti" -> Opens the Handwritten Birthday Love Letter!
    const envelope = document.getElementById('hero-envelope');
    if (envelope) {
        envelope.addEventListener('click', () => {
            sound.playCardFlip();
            openModal('modal-letter');
        });
    }
}

// Confetti Helpers
function fireConfettiBurst(x, y, colors) {
    if (typeof confetti === 'function') {
        const originX = x ? x / window.innerWidth : 0.5;
        const originY = y ? y / window.innerHeight : 0.5;
        confetti({
            particleCount: 35,
            spread: 60,
            origin: { x: originX, y: originY },
            colors: colors || ['#ff6584', '#ff8fab', '#ffd166', '#ffffff']
        });
    }
}

function fireConfettiShower() {
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 100,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
}

// ==========================================================================
// 5. INTERACTIVE BIRTHDAY CAKE CEREMONY
// ==========================================================================
function initCakeCeremony() {
    const blowBtn = document.getElementById('btn-blow-candles');
    const relightBtn = document.getElementById('btn-relight-candles');
    const wishBox = document.getElementById('wish-success-box');
    const candles = document.querySelectorAll('.interactive-cake .candle');

    if (!blowBtn) return;

    blowBtn.addEventListener('click', () => {
        sound.playPop(300);
        setTimeout(() => sound.playVictory(), 200);

        candles.forEach((c, idx) => {
            setTimeout(() => {
                c.classList.remove('lit');
                c.classList.add('extinguished');
            }, idx * 120);
        });

        setTimeout(() => {
            blowBtn.classList.add('hidden');
            relightBtn.classList.remove('hidden');
            wishBox.classList.remove('hidden');

            if (typeof confetti === 'function') {
                const end = Date.now() + 2500;
                (function frame() {
                    confetti({ particleCount: 5, angle: 60, spread: 55, origin: { x: 0 } });
                    confetti({ particleCount: 5, angle: 120, spread: 55, origin: { x: 1 } });
                    if (Date.now() < end) requestAnimationFrame(frame);
                }());
            }
        }, 700);
    });

    if (relightBtn) {
        relightBtn.addEventListener('click', () => {
            sound.playSparkle();
            candles.forEach(c => {
                c.classList.remove('extinguished');
                c.classList.add('lit');
            });
            blowBtn.classList.remove('hidden');
            relightBtn.classList.add('hidden');
            wishBox.classList.add('hidden');
        });
    }
}

// ==========================================================================
// 6. ARCADE NAVIGATION TABS
// ==========================================================================
function initArcadeNavigation() {
    const tabBtns = document.querySelectorAll('.arcade-tab-btn');
    const panels = document.querySelectorAll('.arcade-game-panel');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            sound.playPop(480);
            const targetId = btn.getAttribute('data-game');

            tabBtns.forEach(b => b.classList.remove('active'));
            panels.forEach(p => p.classList.remove('active'));

            btn.classList.add('active');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.classList.add('active');
            }
        });
    });
}

// ==========================================================================
// 7. GAME 1: CATCH THE LOVE & GIFTS
// ==========================================================================
let catchGame = null;

function initCatchGame() {
    const canvas = document.getElementById('catch-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const overlay = document.getElementById('catch-overlay');
    const overlayTitle = document.getElementById('catch-overlay-title');
    const overlayDesc = document.getElementById('catch-overlay-desc');
    const startBtn = document.getElementById('btn-start-catch');
    const scoreDisp = document.getElementById('catch-score');
    const bestDisp = document.getElementById('catch-best');
    const livesDisp = document.getElementById('catch-lives');

    let bestScore = parseInt(localStorage.getItem('catch_best') || '0', 10);
    bestDisp.textContent = bestScore;

    catchGame = {
        running: false,
        score: 0,
        lives: 3,
        basket: { x: 260, y: 350, width: 80, height: 35, speed: 7 },
        items: [],
        spawnTimer: 0,
        keys: { left: false, right: false }
    };

    const goodEmojis = [
        { char: '🎂', points: 20 },
        { char: '🎁', points: 15 },
        { char: '💖', points: 10 },
        { char: '⭐', points: 30 },
        { char: '🌹', points: 15 }
    ];

    const badEmoji = { char: '⛈️', points: -1 };

    function spawnItem() {
        const isBad = Math.random() < 0.22;
        const selected = isBad ? badEmoji : goodEmojis[Math.floor(Math.random() * goodEmojis.length)];
        catchGame.items.push({
            x: Math.random() * (canvas.width - 40) + 20,
            y: -20,
            speed: Math.random() * 2 + 2 + Math.min(catchGame.score / 60, 3.5),
            char: selected.char,
            points: selected.points,
            size: 28
        });
    }

    function update() {
        if (!catchGame.running) return;

        if (catchGame.keys.left && catchGame.basket.x > 0) {
            catchGame.basket.x -= catchGame.basket.speed;
        }
        if (catchGame.keys.right && catchGame.basket.x < canvas.width - catchGame.basket.width) {
            catchGame.basket.x += catchGame.basket.speed;
        }

        catchGame.spawnTimer++;
        if (catchGame.spawnTimer > 35) {
            spawnItem();
            catchGame.spawnTimer = 0;
        }

        for (let i = catchGame.items.length - 1; i >= 0; i--) {
            const item = catchGame.items[i];
            item.y += item.speed;

            if (
                item.y + item.size >= catchGame.basket.y &&
                item.y <= catchGame.basket.y + catchGame.basket.height &&
                item.x + item.size >= catchGame.basket.x &&
                item.x <= catchGame.basket.x + catchGame.basket.width
            ) {
                if (item.points > 0) {
                    sound.playCatch();
                    catchGame.score += item.points;
                    scoreDisp.textContent = catchGame.score;
                    checkMilestoneCoupons(catchGame.score);
                } else {
                    sound.playBalloonPop();
                    catchGame.lives--;
                    updateLivesDisplay();
                    if (catchGame.lives <= 0) {
                        endGame();
                        return;
                    }
                }
                catchGame.items.splice(i, 1);
                continue;
            }

            if (item.y > canvas.height + 30) {
                catchGame.items.splice(i, 1);
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = '#fddbe4';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 30) {
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        const b = catchGame.basket;
        ctx.save();
        ctx.fillStyle = '#ff6584';
        ctx.strokeStyle = '#2c252a';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, [8, 8, 16, 16]);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('🧺 LOVE', b.x + b.width / 2, b.y + b.height / 2);
        ctx.restore();

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        catchGame.items.forEach(item => {
            ctx.font = `${item.size}px sans-serif`;
            ctx.fillText(item.char, item.x, item.y);
        });
    }

    function updateLivesDisplay() {
        let hearts = '';
        for (let i = 0; i < catchGame.lives; i++) hearts += '❤️';
        for (let i = catchGame.lives; i < 3; i++) hearts += '🖤';
        livesDisp.textContent = hearts;
    }

    function startGame() {
        catchGame.score = 0;
        catchGame.lives = 3;
        catchGame.items = [];
        catchGame.basket.x = canvas.width / 2 - catchGame.basket.width / 2;
        catchGame.running = true;
        scoreDisp.textContent = '0';
        updateLivesDisplay();
        overlay.classList.add('hidden');
        update();
    }

    function endGame() {
        catchGame.running = false;
        sound.playVictory();
        if (catchGame.score > bestScore) {
            bestScore = catchGame.score;
            localStorage.setItem('catch_best', bestScore);
            bestDisp.textContent = bestScore;
        }

        overlayTitle.textContent = 'Game Over! Great Catch! 🎉';
        overlayDesc.textContent = `You scored ${catchGame.score} points for ${appState.gfName}! Check out the unlocked love coupons below!`;
        startBtn.textContent = 'Play Again 🔄';
        overlay.classList.remove('hidden');
        fireConfettiShower();
    }

    startBtn.addEventListener('click', startGame);

    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * canvas.width;
        catchGame.basket.x = Math.max(0, Math.min(canvas.width - catchGame.basket.width, mouseX - catchGame.basket.width / 2));
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault();
        const rect = canvas.getBoundingClientRect();
        const touchX = ((e.touches[0].clientX - rect.left) / rect.width) * canvas.width;
        catchGame.basket.x = Math.max(0, Math.min(canvas.width - catchGame.basket.width, touchX - catchGame.basket.width / 2));
    }, { passive: false });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') catchGame.keys.left = true;
        if (e.key === 'ArrowRight' || e.key === 'd') catchGame.keys.right = true;
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'a') catchGame.keys.left = false;
        if (e.key === 'ArrowRight' || e.key === 'd') catchGame.keys.right = false;
    });

    const moveLeftBtn = document.getElementById('btn-move-left');
    const moveRightBtn = document.getElementById('btn-move-right');

    if (moveLeftBtn) {
        moveLeftBtn.addEventListener('mousedown', () => catchGame.keys.left = true);
        moveLeftBtn.addEventListener('mouseup', () => catchGame.keys.left = false);
        moveLeftBtn.addEventListener('touchstart', (e) => { e.preventDefault(); catchGame.keys.left = true; });
        moveLeftBtn.addEventListener('touchend', (e) => { e.preventDefault(); catchGame.keys.left = false; });
    }

    if (moveRightBtn) {
        moveRightBtn.addEventListener('mousedown', () => catchGame.keys.right = true);
        moveRightBtn.addEventListener('mouseup', () => catchGame.keys.right = false);
        moveRightBtn.addEventListener('touchstart', (e) => { e.preventDefault(); catchGame.keys.right = true; });
        moveRightBtn.addEventListener('touchend', (e) => { e.preventDefault(); catchGame.keys.right = false; });
    }

    draw();
}

function checkMilestoneCoupons(score) {
    if (score >= 50) unlockMilestoneCoupon(1, '🎟️ Unlimited Warm Hugs & Forehead Kisses');
    if (score >= 100) unlockMilestoneCoupon(2, '🎟️ Favorite Meal Date of Your Choice');
    if (score >= 150) unlockMilestoneCoupon(3, '🎟️ 1 Day Princess Treatment');
}

function unlockMilestoneCoupon(num, title) {
    const chip = document.getElementById(`coupon-${num}`);
    if (chip && chip.classList.contains('locked')) {
        chip.classList.remove('locked');
        chip.classList.add('unlocked');
        const icon = chip.querySelector('.c-icon');
        if (icon) icon.textContent = '🎉';
        sound.playSparkle();
        addSavedCoupon(title);
    }
}

// ==========================================================================
// 8. GAME 2: MEMORY MATCH (LOVE EDITION)
// ==========================================================================
function initMemoryGame() {
    const board = document.getElementById('memory-board');
    const movesDisp = document.getElementById('memory-moves');
    const matchedDisp = document.getElementById('memory-matched');
    const restartBtn = document.getElementById('btn-restart-memory');
    const winBox = document.getElementById('memory-win-box');

    if (!board) return;

    const icons = ['🎂', '🎁', '💖', '🧸', '🌹', '💌', '👑', '🍫'];
    let cards = [...icons, ...icons];
    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let isLocked = false;

    function shuffle(arr) {
        return arr.sort(() => Math.random() - 0.5);
    }

    function createBoard() {
        board.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        isLocked = false;
        movesDisp.textContent = '0';
        matchedDisp.textContent = '0 / 8';
        if (winBox) winBox.classList.add('hidden');

        const shuffled = shuffle([...cards]);

        shuffled.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('memory-card');
            card.dataset.icon = icon;
            card.dataset.index = index;

            card.innerHTML = `
                <div class="memory-card-inner">
                    <div class="memory-face memory-front">?</div>
                    <div class="memory-face memory-back">${icon}</div>
                </div>
            `;

            card.addEventListener('click', () => handleCardClick(card));
            board.appendChild(card);
        });
    }

    function handleCardClick(card) {
        if (isLocked || card.classList.contains('flipped') || card.classList.contains('matched')) {
            return;
        }

        sound.playCardFlip();
        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            moves++;
            movesDisp.textContent = moves;
            checkMatch();
        }
    }

    function checkMatch() {
        isLocked = true;
        const [c1, c2] = flippedCards;

        if (c1.dataset.icon === c2.dataset.icon) {
            setTimeout(() => {
                sound.playSparkle();
                c1.classList.add('matched');
                c2.classList.add('matched');
                matchedPairs++;
                matchedDisp.textContent = `${matchedPairs} / 8`;
                flippedCards = [];
                isLocked = false;

                if (matchedPairs === 8) {
                    handleMemoryWin();
                }
            }, 300);
        } else {
            setTimeout(() => {
                c1.classList.remove('flipped');
                c2.classList.remove('flipped');
                flippedCards = [];
                isLocked = false;
            }, 850);
        }
    }

    function handleMemoryWin() {
        sound.playVictory();
        if (winBox) winBox.classList.remove('hidden');
        fireConfettiShower();
        addSavedCoupon('🎟️ Perfect Match Certificate: Soulmates Forever');
    }

    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            sound.playPop(440);
            createBoard();
        });
    }

    createBoard();
}

// ==========================================================================
// 9. GAME 3: POP BALLOONS & REVEAL COMPLIMENTS
// ==========================================================================
function initBalloonGame() {
    const stage = document.getElementById('balloon-stage');
    const poppedCountDisp = document.getElementById('balloons-popped-count');
    const spawnMoreBtn = document.getElementById('btn-spawn-more-balloons');
    const complimentText = document.getElementById('active-compliment-text');

    if (!stage) return;

    let poppedCount = 0;

    const compliments = [
        "Your smile is the prettiest thing in the entire universe! ✨",
        "Every day with you is my absolute favorite day! 💕",
        "Your laugh is my favorite song in the whole world! 🎶",
        "You are so thoughtful, caring, and undeniably gorgeous! 🌸",
        "Thank you for being my happiest place and my biggest blessing! 🥰",
        "I fall more in love with you with each passing second! 💖",
        `You are ${appState.bfName}'s favorite person forever and always! 👑`,
        "You make this entire world a brighter, sweeter place! ☀️"
    ];

    const colors = [
        { bg: '#ff8fab', border: '#e04a6b' },
        { bg: '#ffa3b8', border: '#c9184a' },
        { bg: '#ffcbf2', border: '#b5179e' },
        { bg: '#fed976', border: '#e69500' },
        { bg: '#a0c4ff', border: '#3a86ff' },
        { bg: '#caffbf', border: '#38b000' }
    ];

    function spawnBalloon() {
        const balloon = document.createElement('div');
        balloon.classList.add('popping-balloon');

        const color = colors[Math.floor(Math.random() * colors.length)];
        const emojis = ['🎈', '💖', '✨', '🌸', '🎂'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];

        balloon.innerHTML = `
            <div class="p-balloon-body" style="background:${color.bg}; border-color:${color.border};">
                ${emoji}
            </div>
            <div class="p-balloon-string"></div>
        `;

        const stageWidth = stage.clientWidth - 70;
        const startX = Math.random() * stageWidth + 10;
        balloon.style.left = `${startX}px`;
        balloon.style.bottom = '-90px';

        const speed = Math.random() * 2 + 1.2;
        let posY = -90;

        stage.appendChild(balloon);

        balloon.addEventListener('click', (e) => {
            sound.playBalloonPop();
            poppedCount++;
            poppedCountDisp.textContent = poppedCount;

            const randomMsg = compliments[Math.floor(Math.random() * compliments.length)];
            complimentText.textContent = `"${randomMsg}"`;
            complimentText.parentElement.style.animation = 'none';
            void complimentText.parentElement.offsetHeight;
            complimentText.parentElement.style.animation = 'popIn 0.3s ease';

            fireConfettiBurst(e.clientX, e.clientY);
            balloon.remove();
        });

        function floatUp() {
            if (!balloon.parentElement) return;
            posY += speed;
            balloon.style.bottom = `${posY}px`;

            if (posY > stage.clientHeight + 80) {
                balloon.remove();
            } else {
                requestAnimationFrame(floatUp);
            }
        }

        requestAnimationFrame(floatUp);
    }

    for (let i = 0; i < 6; i++) {
        setTimeout(spawnBalloon, i * 400);
    }

    setInterval(() => {
        if (stage.querySelectorAll('.popping-balloon').length < 8) {
            spawnBalloon();
        }
    }, 1800);

    if (spawnMoreBtn) {
        spawnMoreBtn.addEventListener('click', () => {
            sound.playPop(520);
            for (let i = 0; i < 5; i++) {
                setTimeout(spawnBalloon, i * 200);
            }
        });
    }
}

// ==========================================================================
// 10. GAME 4: EXPANDED 12-ITEM LUCKY BIRTHDAY SPIN WHEEL
// ==========================================================================
function initWheelGame() {
    const canvas = document.getElementById('wheel-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const spinBtn = document.getElementById('btn-spin-wheel');
    const prizeBox = document.getElementById('wheel-prize-result');
    const prizeTitle = document.getElementById('wheel-prize-title');
    const claimBtn = document.getElementById('btn-claim-prize');

    // Expanded to 12 items!
    const prizes = [
        "🍕 Candlelight Dinner",
        `💆 30-Min Massage from ${appState.bfName}`,
        "🎬 Movie Night + Snacks",
        "🛍️ Shopping Spree Treat",
        "🍦 Late Night Ice Cream",
        `👑 ${appState.bfName} Says YES For 1 Day`,
        "☕ Breakfast in Bed + Coffee",
        "🎁 Mystery Birthday Surprise",
        "🚗 Long Drive + Favorite Songs",
        `🥞 ${appState.bfName} Cooks Your Fav Meal`,
        "🧸 Warm Hugs & 100 Kisses",
        "🎟️ 1 Wildcard Wish: Anything!"
    ];

    const sliceColors = [
        '#ff8fab', '#ffd166', '#a0c4ff', '#ffb3c6',
        '#caffbf', '#ffd6a5', '#bdb2ff', '#ffc6ff',
        '#ff99c8', '#fcf6bd', '#d0f4de', '#e4c1f9'
    ];

    const numSlices = prizes.length;
    const sliceAngle = (2 * Math.PI) / numSlices;
    let currentAngle = 0;
    let isSpinning = false;
    let wonPrize = '';

    function drawWheel() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = centerX - 10;

        for (let i = 0; i < numSlices; i++) {
            const angle = currentAngle + i * sliceAngle;

            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, angle, angle + sliceAngle);
            ctx.closePath();
            ctx.fillStyle = sliceColors[i];
            ctx.fill();
            ctx.strokeStyle = '#2c252a';
            ctx.lineWidth = 3;
            ctx.stroke();

            // Text rendering
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(angle + sliceAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#2c252a';
            ctx.font = 'bold 11px Fredoka, sans-serif';
            ctx.fillText(prizes[i], radius - 12, 4);
            ctx.restore();
        }

        // Center hub pin
        ctx.beginPath();
        ctx.arc(centerX, centerY, 26, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff6584';
        ctx.fill();
        ctx.strokeStyle = '#2c252a';
        ctx.lineWidth = 3.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 15px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', centerX, centerY);
    }

    function spin() {
        if (isSpinning) return;
        isSpinning = true;
        prizeBox.classList.add('hidden');

        sound.playPop(520);

        const totalRotations = Math.PI * 2 * (6 + Math.floor(Math.random() * 5));
        const randomExtra = Math.random() * Math.PI * 2;
        const targetAngle = currentAngle + totalRotations + randomExtra;

        const duration = 4800;
        const start = performance.now();
        const initialAngle = currentAngle;

        let lastTickSegment = -1;

        function animate(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const easeOut = 1 - Math.pow(1 - progress, 3);

            currentAngle = initialAngle + (targetAngle - initialAngle) * easeOut;
            drawWheel();

            const normalizedAngle = (currentAngle % (Math.PI * 2));
            const currentSegment = Math.floor(normalizedAngle / sliceAngle);
            if (currentSegment !== lastTickSegment) {
                sound.playTick();
                lastTickSegment = currentSegment;
            }

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                isSpinning = false;
                calculateWinner();
            }
        }

        requestAnimationFrame(animate);
    }

    function calculateWinner() {
        const adjustedAngle = (3 * Math.PI / 2 - currentAngle) % (Math.PI * 2);
        const positiveAngle = adjustedAngle < 0 ? adjustedAngle + Math.PI * 2 : adjustedAngle;
        const winningIndex = Math.floor(positiveAngle / sliceAngle) % numSlices;

        wonPrize = prizes[winningIndex];
        sound.playVictory();
        prizeTitle.textContent = `You Won: ${wonPrize}!`;
        prizeBox.classList.remove('hidden');
        fireConfettiShower();
    }

    spinBtn.addEventListener('click', spin);

    if (claimBtn) {
        claimBtn.addEventListener('click', () => {
            sound.playSparkle();
            addSavedCoupon(`🎟️ ${wonPrize}`);
            claimBtn.textContent = 'Coupon Saved! ✅';
            setTimeout(() => {
                claimBtn.textContent = 'Collect Coupon 🎟️';
            }, 2500);
        });
    }

    drawWheel();
}

// ==========================================================================
// 11. GAME 5: CUPID KARTI'S BIRTHDAY FLIGHT (NEW FLYING GAME!)
// ==========================================================================
let cupidGame = null;

function initCupidGame() {
    const canvas = document.getElementById('cupid-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const overlay = document.getElementById('cupid-overlay');
    const overlayTitle = document.getElementById('cupid-overlay-title');
    const overlayDesc = document.getElementById('cupid-overlay-desc');
    const startBtn = document.getElementById('btn-start-cupid');
    const flapBtn = document.getElementById('btn-cupid-flap');
    const scoreDisp = document.getElementById('cupid-score');
    const bestDisp = document.getElementById('cupid-best');
    const trophyChip = document.getElementById('cupid-trophy-chip');

    let bestScore = parseInt(localStorage.getItem('cupid_best') || '0', 10);
    bestDisp.textContent = bestScore;

    cupidGame = {
        running: false,
        score: 0,
        player: { x: 90, y: 180, vy: 0, radius: 18, gravity: 0.38, jump: -6.5 },
        pipes: [],
        items: [],
        pipeTimer: 0,
        itemTimer: 0
    };

    function flap() {
        if (!cupidGame.running) return;
        sound.playPop(580);
        cupidGame.player.vy = cupidGame.player.jump;
    }

    function spawnPipe() {
        const gap = 130;
        const minHeight = 50;
        const topHeight = Math.random() * (canvas.height - gap - minHeight * 2) + minHeight;
        cupidGame.pipes.push({
            x: canvas.width + 10,
            width: 46,
            top: topHeight,
            bottom: canvas.height - topHeight - gap,
            passed: false
        });
    }

    function spawnCollectible() {
        const goodies = [
            { char: '🍓', pts: 10 },
            { char: '🎂', pts: 20 },
            { char: '⭐', pts: 30 }
        ];
        const g = goodies[Math.floor(Math.random() * goodies.length)];
        cupidGame.items.push({
            x: canvas.width + 20,
            y: Math.random() * (canvas.height - 120) + 60,
            char: g.char,
            pts: g.pts,
            size: 24
        });
    }

    function update() {
        if (!cupidGame.running) return;

        const p = cupidGame.player;
        p.vy += p.gravity;
        p.y += p.vy;

        // Ground / ceiling collision
        if (p.y + p.radius >= canvas.height || p.y - p.radius <= 0) {
            endCupidGame();
            return;
        }

        // Spawn pipes
        cupidGame.pipeTimer++;
        if (cupidGame.pipeTimer > 105) {
            spawnPipe();
            cupidGame.pipeTimer = 0;
        }

        // Spawn items
        cupidGame.itemTimer++;
        if (cupidGame.itemTimer > 80) {
            spawnCollectible();
            cupidGame.itemTimer = 0;
        }

        // Update pipes
        for (let i = cupidGame.pipes.length - 1; i >= 0; i--) {
            const pipe = cupidGame.pipes[i];
            pipe.x -= 2.4;

            // Score passed
            if (!pipe.passed && pipe.x + pipe.width < p.x) {
                pipe.passed = true;
                cupidGame.score += 5;
                scoreDisp.textContent = cupidGame.score;
                checkCupidMilestone(cupidGame.score);
            }

            // Collision with pipe
            if (
                p.x + p.radius > pipe.x &&
                p.x - p.radius < pipe.x + pipe.width &&
                (p.y - p.radius < pipe.top || p.y + p.radius > canvas.height - pipe.bottom)
            ) {
                endCupidGame();
                return;
            }

            if (pipe.x + pipe.width < -10) {
                cupidGame.pipes.splice(i, 1);
            }
        }

        // Update items
        for (let i = cupidGame.items.length - 1; i >= 0; i--) {
            const item = cupidGame.items[i];
            item.x -= 2.6;

            // Collect item
            const dx = p.x - item.x;
            const dy = p.y - item.y;
            if (Math.hypot(dx, dy) < p.radius + 14) {
                sound.playCatch();
                cupidGame.score += item.pts;
                scoreDisp.textContent = cupidGame.score;
                checkCupidMilestone(cupidGame.score);
                cupidGame.items.splice(i, 1);
                continue;
            }

            if (item.x < -20) {
                cupidGame.items.splice(i, 1);
            }
        }

        draw();
        requestAnimationFrame(update);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Sky background with soft clouds
        const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        skyGrad.addColorStop(0, '#ffeef2');
        skyGrad.addColorStop(1, '#ffd8e4');
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw Pipes (Pastel candy pillars)
        cupidGame.pipes.forEach(pipe => {
            ctx.fillStyle = '#ff8fab';
            ctx.strokeStyle = '#2c252a';
            ctx.lineWidth = 3;

            // Top pipe
            ctx.beginPath();
            ctx.roundRect(pipe.x, 0, pipe.width, pipe.top, [0, 0, 10, 10]);
            ctx.fill();
            ctx.stroke();

            // Bottom pipe
            ctx.beginPath();
            ctx.roundRect(pipe.x, canvas.height - pipe.bottom, pipe.width, pipe.bottom, [10, 10, 0, 0]);
            ctx.fill();
            ctx.stroke();
        });

        // Draw Collectible items
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        cupidGame.items.forEach(item => {
            ctx.font = `${item.size}px sans-serif`;
            ctx.fillText(item.char, item.x, item.y);
        });

        // Draw Cupid Player (Cute Heart with Wings)
        const p = cupidGame.player;
        ctx.save();
        ctx.translate(p.x, p.y);
        // Tilt with velocity
        ctx.rotate(Math.min(Math.PI / 4, Math.max(-Math.PI / 4, p.vy * 0.08)));

        // Fluttering Wings
        const wingFlap = Math.sin(Date.now() * 0.02) * 6;
        ctx.fillStyle = '#ffffff';
        ctx.strokeStyle = '#2c252a';
        ctx.lineWidth = 2;

        // Left wing
        ctx.beginPath();
        ctx.ellipse(-14, -6 + wingFlap, 12, 6, -0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Right wing
        ctx.beginPath();
        ctx.ellipse(14, -6 - wingFlap, 12, 6, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cupid Heart Body
        ctx.font = '28px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('💖', 0, 0);

        ctx.restore();
    }

    function checkCupidMilestone(score) {
        if (score >= 50 && trophyChip && trophyChip.classList.contains('locked')) {
            trophyChip.classList.remove('locked');
            trophyChip.classList.add('unlocked');
            const icon = trophyChip.querySelector('.c-icon');
            if (icon) icon.textContent = '🏆';
            sound.playVictory();
            addSavedCoupon('🎟️ Certified Master Cupid: Unconditional Love Trophy');
        }
    }

    function startCupidGame() {
        cupidGame.score = 0;
        cupidGame.player.y = 180;
        cupidGame.player.vy = 0;
        cupidGame.pipes = [];
        cupidGame.items = [];
        cupidGame.pipeTimer = 0;
        cupidGame.itemTimer = 0;
        cupidGame.running = true;
        scoreDisp.textContent = '0';
        overlay.classList.add('hidden');
        update();
    }

    function endCupidGame() {
        cupidGame.running = false;
        sound.playBalloonPop();
        if (cupidGame.score > bestScore) {
            bestScore = cupidGame.score;
            localStorage.setItem('cupid_best', bestScore);
            bestDisp.textContent = bestScore;
        }

        overlayTitle.textContent = 'Flight Over! Great Job! 🏹';
        overlayDesc.textContent = `You scored ${cupidGame.score} points! Can you beat your high score?`;
        startBtn.textContent = 'Fly Again 🔄';
        overlay.classList.remove('hidden');
    }

    startBtn.addEventListener('click', startCupidGame);
    canvas.addEventListener('click', flap);
    canvas.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
    if (flapBtn) {
        flapBtn.addEventListener('click', flap);
        flapBtn.addEventListener('touchstart', (e) => { e.preventDefault(); flap(); }, { passive: false });
    }

    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && cupidGame.running) {
            e.preventDefault();
            flap();
        }
    });

    draw();
}

// ==========================================================================
// 12. REASONS WHY I LOVE YOU CAROUSEL
// ==========================================================================
function initReasonsCarousel() {
    const quoteEl = document.getElementById('active-reason-quote');
    const nextBtn = document.getElementById('btn-next-reason');

    if (!quoteEl || !nextBtn) return;

    const reasons = [
        "Your sweet laughter is literally the best sound in the entire world, and seeing you smile makes every ordinary day magical.",
        "How you care so deeply about the people around you with the purest heart.",
        "The way your eyes sparkle whenever you talk about something you truly love.",
        "How effortlessly you make me feel understood, loved, and safe.",
        "Your cute little habits that never fail to brighten my mood.",
        "Because having you in my life is the greatest gift I could ever ask for.",
        "Because no matter what happens, you are my home and my forever person."
    ];

    let index = 0;

    nextBtn.addEventListener('click', () => {
        sound.playSparkle();
        index = (index + 1) % reasons.length;
        quoteEl.style.opacity = '0';
        quoteEl.style.transform = 'translateY(10px)';

        setTimeout(() => {
            quoteEl.textContent = `"${reasons[index]}"`;
            quoteEl.style.transition = 'all 0.3s ease';
            quoteEl.style.opacity = '1';
            quoteEl.style.transform = 'translateY(0)';
        }, 200);
    });
}

// ==========================================================================
// 13. SAVED COUPONS / WALLET SYSTEM
// ==========================================================================
function addSavedCoupon(couponTitle) {
    if (!appState.savedCoupons.includes(couponTitle)) {
        appState.savedCoupons.push(couponTitle);
        localStorage.setItem('bday_coupons', JSON.stringify(appState.savedCoupons));
        renderSavedCoupons();
    }
}

function renderSavedCoupons() {
    const list = document.getElementById('vault-coupons-list');
    if (!list) return;

    if (appState.savedCoupons.length === 0) {
        list.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; color: #88727d; padding: 20px;">
                Play the mini-games above to unlock your birthday love coupons! 🎁
            </div>
        `;
        return;
    }

    list.innerHTML = appState.savedCoupons.map((c, i) => `
        <div class="saved-coupon-card">
            <div>
                <div class="coupon-title">${escapeHtml(c)}</div>
                <div class="coupon-redeem">Redeemable anytime with ${escapeHtml(appState.bfName)}</div>
            </div>
            <div style="text-align: right; margin-top: 10px;">
                <span style="font-size: 0.75rem; background: #e8f5e9; color: #2e7d32; padding: 3px 8px; border-radius: 999px; font-weight: bold;">
                    VALID FOREVER ✔️
                </span>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// 14. MODALS (SURPRISE, PROMISES, LETTER, CUSTOMIZE)
// ==========================================================================
function initModals() {
    ['btn-close-surprise', 'btn-close-promises', 'btn-close-letter', 'btn-close-customize'].forEach(id => {
        const btn = document.getElementById(id);
        if (!btn) return;
        btn.addEventListener('click', () => {
            sound.playPop(350);
            closeAllModals();
        });
    });

    document.querySelectorAll('.custom-modal-backdrop').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeAllModals();
        });
    });

    const surpriseConfettiBtn = document.getElementById('btn-surprise-confetti');
    if (surpriseConfettiBtn) {
        surpriseConfettiBtn.addEventListener('click', () => {
            sound.playSparkle();
            fireConfettiShower();
        });
    }

    const surpriseToGames = document.getElementById('btn-surprise-to-games');
    if (surpriseToGames) {
        surpriseToGames.addEventListener('click', () => closeAllModals());
    }

    // Seal Promises Button
    const sealPromisesBtn = document.getElementById('btn-seal-promises');
    if (sealPromisesBtn) {
        sealPromisesBtn.addEventListener('click', (e) => {
            sound.playVictory();
            fireConfettiBurst(e.clientX, e.clientY);
            sealPromisesBtn.textContent = 'Promises Sealed In Love! 💖💍';
            addSavedCoupon('🎟️ Tarun’s 10 Sacred Promises Bond');
            setTimeout(() => {
                closeAllModals();
                sealPromisesBtn.textContent = "I Accept Tarun's Promises! 💖";
            }, 1800);
        });
    }

    // Letter Modal Send Kiss Back
    const letterKissBtn = document.getElementById('btn-letter-kiss');
    if (letterKissBtn) {
        letterKissBtn.addEventListener('click', (e) => {
            sound.playSparkle();
            fireConfettiBurst(e.clientX, e.clientY, ['#ff4081', '#f50057', '#ff80ab']);
            letterKissBtn.textContent = `Kiss Sent to ${appState.bfName}! 💋💖`;
            setTimeout(() => {
                letterKissBtn.textContent = 'Send a Kiss Back 💋';
            }, 3000);
        });
    }

    const customizeNavBtn = document.getElementById('btn-customize');
    if (customizeNavBtn) {
        customizeNavBtn.addEventListener('click', () => {
            sound.playPop(520);
            openModal('modal-customize');
        });
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
}

function closeAllModals() {
    document.querySelectorAll('.custom-modal-backdrop').forEach(m => m.classList.remove('active'));
}

// ==========================================================================
// 15. PERSONALIZATION / CUSTOMIZATION SETTINGS
// ==========================================================================
function initPersonalizationForm() {
    const form = document.getElementById('customize-form');
    const gfInput = document.getElementById('input-gf-name');
    const bfInput = document.getElementById('input-bf-name');
    const dateInput = document.getElementById('input-bday-date');
    const letterInput = document.getElementById('input-letter-msg');
    const resetBtn = document.getElementById('btn-reset-settings');

    if (!form) return;

    gfInput.value = appState.gfName;
    bfInput.value = appState.bfName;
    dateInput.value = appState.bdayDate;
    if (appState.letterMsg) letterInput.value = appState.letterMsg;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        sound.playSparkle();

        appState.gfName = gfInput.value.trim() || 'Karti';
        appState.bfName = bfInput.value.trim() || 'Tarun';
        appState.bdayDate = dateInput.value.trim() || '19 November';
        appState.letterMsg = letterInput.value.trim();

        localStorage.setItem('bday_gfName', appState.gfName);
        localStorage.setItem('bday_bfName', appState.bfName);
        localStorage.setItem('bday_date', appState.bdayDate);
        localStorage.setItem('bday_letter', appState.letterMsg);

        applyPersonalization();
        closeAllModals();
        fireConfettiShower();
    });

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            sound.playPop(400);
            if (confirm('Reset names, dates, and settings back to defaults?')) {
                localStorage.clear();
                appState.gfName = 'Karti';
                appState.bfName = 'Tarun';
                appState.bdayDate = '23 November';
                appState.letterMsg = '';
                appState.savedCoupons = [];
                applyPersonalization();
                renderSavedCoupons();
                closeAllModals();
            }
        });
    }
}

// ==========================================================================
// 16. AUDIO ENGINE CONTROLS
// ==========================================================================
function initAudioControls() {
    const musicBtn = document.getElementById('btn-music');
    const soundBtn = document.getElementById('btn-sound');

    if (musicBtn) {
        musicBtn.addEventListener('click', () => {
            const isPlaying = sound.toggleBGM();
            const textSpan = musicBtn.querySelector('.btn-text');
            if (textSpan) {
                textSpan.textContent = `Music: ${isPlaying ? 'ON 🎶' : 'OFF'}`;
            }
            musicBtn.classList.toggle('highlight', isPlaying);
        });
    }

    if (soundBtn) {
        soundBtn.addEventListener('click', () => {
            const isMuted = sound.toggleMute();
            const textSpan = soundBtn.querySelector('.btn-text');
            if (textSpan) {
                textSpan.textContent = `Sound: ${isMuted ? 'OFF 🔇' : 'ON'}`;
            }
        });
    }
}
