// Firebase Config
const firebaseConfig = {
    apiKey: "AIzaSyBSi4XKAOCnrt93Ra61VUB5pnEQq5cvmjg",
    authDomain: "rlprohub.firebaseapp.com",
    projectId: "rlprohub",
    storageBucket: "rlprohub.firebasestorage.app",
    messagingSenderId: "962680207563",
    appId: "1:962680207563:web:5be8b274a922e5e15bc34e"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Variables globales
let currentLang = localStorage.getItem('rlprohub_lang') || 'es';
let currentDriftKey = localStorage.getItem('rocketDriftKey') || "Square/X";
let liveEvents = [];

// Traducciones
const translations = {
    es: {
        inicio: "Inicio",
        pros: "Pro Players",
        eventos: "Eventos",
        guia: "Guía",
        sugerencias: "Sugerencias",
        heroTitle: "🏆 RLProHub",
        heroDesc: "Tu centro definitivo para configuraciones de pros de Rocket League",
        heroBadge: "🔥 Base de datos de configuraciones Pro",
        prosTitle: "👑 Configuración de Pros",
        prosDesc: "Haz clic en cualquier jugador para ver su configuración",
        eventosTitle: "📅 Calendario RLCS 2026",
        eventosDesc: "Eventos oficiales de la temporada",
        guiaTitle: "📚 Guía de Configuración",
        guiaDesc: "Aprende todo sobre configuraciones de cámara, controles, video y consejos",
        sugerenciasTitle: "📝 Sugerencias de Jugadores",
        sugerenciasDesc: "¿Falta algún jugador pro? Dínoslo y lo agregaremos",
        footerText: "© 2026 RLProHub - Configuraciones y eventos de Rocket League",
        searchPlaceholder: "🔍 Buscar jugador pro...",
        searchBtn: "🔍 Buscar",
        suggestBtn: "➕ Sugerir jugador",
        suggestFormTitle: "📝 Sugerir nuevo jugador pro",
        suggestNamePlaceholder: "Nombre del jugador",
        suggestTeamPlaceholder: "Equipo",
        suggestReasonPlaceholder: "¿Por qué debería agregarse? (opcional)",
        submitSuggest: "📨 Enviar sugerencia",
        noResults: "❌ No se encontró el jugador",
        noResultsSuggest: "¿Quieres sugerir que agreguemos a este jugador?",
        actionCol: "Acción",
        keyCol: "Tecla",
        whyCol: "Por qué",
        customizeTitle: "⚙️ Personalizar controles",
        driftLabel: "🎯 Derrape / Air Roll:",
        boostLabel: "💨 Boost:",
        boostRecommended: "(Recomendado por pros)"
    },
    en: {
        inicio: "Home",
        pros: "Pro Players",
        eventos: "Events",
        guia: "Guide",
        sugerencias: "Suggestions",
        heroTitle: "🏆 RLProHub",
        heroDesc: "Your ultimate hub for Rocket League pro settings",
        heroBadge: "🔥 Pro Settings Database",
        prosTitle: "👑 Pro Players Settings",
        prosDesc: "Click on any player to see their settings",
        eventosTitle: "📅 RLCS 2026 Calendar",
        eventosDesc: "Official season events",
        guiaTitle: "📚 Setup Guide",
        guiaDesc: "Learn about camera settings, controls, video and tips",
        sugerenciasTitle: "📝 Player Suggestions",
        sugerenciasDesc: "Missing a pro player? Let us know",
        footerText: "© 2026 RLProHub - Rocket League Settings & Events",
        searchPlaceholder: "🔍 Search pro player...",
        searchBtn: "🔍 Search",
        suggestBtn: "➕ Suggest player",
        suggestFormTitle: "📝 Suggest new pro player",
        suggestNamePlaceholder: "Player name",
        suggestTeamPlaceholder: "Team",
        suggestReasonPlaceholder: "Why should it be added? (optional)",
        submitSuggest: "📨 Submit suggestion",
        noResults: "❌ Player not found",
        noResultsSuggest: "Want to suggest we add this player?",
        actionCol: "Action",
        keyCol: "Key",
        whyCol: "Why",
        customizeTitle: "⚙️ Customize controls",
        driftLabel: "🎯 Drift / Air Roll:",
        boostLabel: "💨 Boost:",
        boostRecommended: "(Recommended by pros)"
    }
};

// Datos de pros (15 jugadores)
const prosData = {
    es: [
        { name: "Zen", team: "Vitality", settings: { fov: 110, distance: 280, height: 100, angle: -3, stiffness: 0.4, deadzone: 0.05, sens_dir: 1.4, sens_air: 1.4, swivel: 3.2 } },
        { name: "M0nkey M00n", team: "BDS", settings: { fov: 110, distance: 270, height: 90, angle: -4, stiffness: 0.45, deadzone: 0.1, sens_dir: 1.5, sens_air: 1.6, swivel: 4.2 } },
        { name: "Vatira", team: "KC", settings: { fov: 109, distance: 270, height: 100, angle: -4, stiffness: 0.35, deadzone: 0.08, sens_dir: 1.3, sens_air: 1.3, swivel: 3.0 } },
        { name: "Firstkiller", team: "G2", settings: { fov: 110, distance: 280, height: 100, angle: -3, stiffness: 0.5, deadzone: 0.05, sens_dir: 1.35, sens_air: 1.35, swivel: 3.0 } },
        { name: "Beastmode", team: "G2", settings: { fov: 110, distance: 270, height: 90, angle: -5, stiffness: 0.45, deadzone: 0.1, sens_dir: 1.4, sens_air: 1.4, swivel: 3.5 } },
        { name: "Daniel", team: "Shopify", settings: { fov: 110, distance: 270, height: 100, angle: -3, stiffness: 0.4, deadzone: 0.1, sens_dir: 1.3, sens_air: 1.4, swivel: 4.0 } },
        { name: "Rise", team: "BDS", settings: { fov: 110, distance: 280, height: 100, angle: -4, stiffness: 0.4, deadzone: 0.1, sens_dir: 1.6, sens_air: 1.6, swivel: 3.8 } },
        { name: "Atow", team: "KC", settings: { fov: 110, distance: 270, height: 110, angle: -3, stiffness: 0.35, deadzone: 0.08, sens_dir: 1.5, sens_air: 1.5, swivel: 3.5 } }
    ],
    en: [
        { name: "Zen", team: "Vitality", settings: { fov: 110, distance: 280, height: 100, angle: -3, stiffness: 0.4, deadzone: 0.05, sens_dir: 1.4, sens_air: 1.4, swivel: 3.2 } },
        { name: "M0nkey M00n", team: "BDS", settings: { fov: 110, distance: 270, height: 90, angle: -4, stiffness: 0.45, deadzone: 0.1, sens_dir: 1.5, sens_air: 1.6, swivel: 4.2 } },
        { name: "Vatira", team: "KC", settings: { fov: 109, distance: 270, height: 100, angle: -4, stiffness: 0.35, deadzone: 0.08, sens_dir: 1.3, sens_air: 1.3, swivel: 3.0 } },
        { name: "Firstkiller", team: "G2", settings: { fov: 110, distance: 280, height: 100, angle: -3, stiffness: 0.5, deadzone: 0.05, sens_dir: 1.35, sens_air: 1.35, swivel: 3.0 } },
        { name: "Beastmode", team: "G2", settings: { fov: 110, distance: 270, height: 90, angle: -5, stiffness: 0.45, deadzone: 0.1, sens_dir: 1.4, sens_air: 1.4, swivel: 3.5 } },
        { name: "Daniel", team: "Shopify", settings: { fov: 110, distance: 270, height: 100, angle: -3, stiffness: 0.4, deadzone: 0.1, sens_dir: 1.3, sens_air: 1.4, swivel: 4.0 } },
        { name: "Rise", team: "BDS", settings: { fov: 110, distance: 280, height: 100, angle: -4, stiffness: 0.4, deadzone: 0.1, sens_dir: 1.6, sens_air: 1.6, swivel: 3.8 } },
        { name: "Atow", team: "KC", settings: { fov: 110, distance: 270, height: 110, angle: -3, stiffness: 0.35, deadzone: 0.08, sens_dir: 1.5, sens_air: 1.5, swivel: 3.5 } }
    ]
};

// Datos de guía
const cameraGuide = {
    es: [
        { name: "Campo de visión (FOV)", value: "110", desc: "Máximo permitido. Mejor visión periférica" },
        { name: "Distancia", value: "270 - 280", desc: "Balance entre ver el campo y controlar el coche" },
        { name: "Altura", value: "90 - 110", desc: "Más altura = mejor visión del campo" },
        { name: "Ángulo", value: "-3 a -5", desc: "Negativo = cámara más baja" },
        { name: "Rigidez", value: "0.35 - 0.50", desc: "Movimiento de cámara con velocidad" },
        { name: "Velocidad giro", value: "3.00 - 4.20", desc: "Qué tan rápido gira la cámara" }
    ],
    en: [
        { name: "Field of View (FOV)", value: "110", desc: "Maximum allowed. Better peripheral vision" },
        { name: "Distance", value: "270 - 280", desc: "Balance between field view and car control" },
        { name: "Height", value: "90 - 110", desc: "Higher = better field vision" },
        { name: "Angle", value: "-3 to -5", desc: "Negative = lower camera angle" },
        { name: "Stiffness", value: "0.35 - 0.50", desc: "How much camera moves with speed" },
        { name: "Swivel Speed", value: "3.00 - 4.20", desc: "How fast camera turns" }
    ]
};

const videoGuide = {
    es: [
        { name: "Resolución", value: "1920x1080", desc: "Nativa" },
        { name: "Texturas", value: "Alta o Rendimiento", desc: "Balance calidad/FPS" },
        { name: "Sombras", value: "Bajas o Apagadas", desc: "Mejora FPS" },
        { name: "Desenfoque", value: "Apagado", desc: "Reduce input lag" },
        { name: "V-Sync", value: "Apagado", desc: "Reduce input lag" },
        { name: "FPS Límite", value: "250", desc: "O igual a tu monitor" }
    ],
    en: [
        { name: "Resolution", value: "1920x1080", desc: "Native" },
        { name: "Textures", value: "High or Performance", desc: "Balance quality/FPS" },
        { name: "Shadows", value: "Low or Off", desc: "Improves FPS" },
        { name: "Motion Blur", value: "Off", desc: "Reduces input lag" },
        { name: "V-Sync", value: "Off", desc: "Reduces input lag" },
        { name: "FPS Limit", value: "250", desc: "Or match your monitor" }
    ]
};

const tipsGuide = {
    es: [
        { title: "🎯 Calentamiento", desc: "15 minutos en Free Play antes de ranked. Practica aires, dribles y recuperaciones." },
        { title: "⚙️ Rotaciones", desc: "Nunca te quedes debajo del balón. Rota por el lado opuesto al balón tras tu toque." },
        { title: "💪 Posicionamiento", desc: "En defensa, posícionate entre el balón y tu portería." },
        { title: "🔋 Boost", desc: "Recoge pads pequeños (12 de boost). Nunca te quedes sin boost." },
        { title: "🎮 Mecánicas", desc: "Aprende: Half-flip, Wave dash, Fast aerial." },
        { title: "📺 Repeticiones", desc: "Analiza tus partidas. Busca errores de posicionamiento." }
    ],
    en: [
        { title: "🎯 Warmup", desc: "15 minutes in Free Play before ranked. Practice aerials, dribbles, recoveries." },
        { title: "⚙️ Rotations", desc: "Never stay under the ball. Rotate to far post." },
        { title: "💪 Positioning", desc: "On defense, position between ball and goal." },
        { title: "🔋 Boost", desc: "Collect small pads (12 boost). Never run out." },
        { title: "🎮 Mechanics", desc: "Learn: Half-flip, Wave dash, Fast aerial." },
        { title: "📺 Replays", desc: "Analyze your matches. Look for positioning mistakes." }
    ]
};

// Eventos estáticos (fallback)
const staticEvents = {
    es: [
        { name: "RLCS Major 1 - Boston", date: "19-22 Feb 2026", location: "Boston, USA", prize: "$354K", winner: "Gentle Mates", status: "finished" },
        { name: "RLCS Major 2 - París", date: "20-24 May 2026", location: "París, Francia", prize: "$354K", winner: null, status: "upcoming" },
        { name: "World Championship", date: "15-20 Sep 2026", location: "TBD", prize: "$1.2M", winner: null, status: "upcoming" }
    ],
    en: [
        { name: "RLCS Major 1 - Boston", date: "Feb 19-22, 2026", location: "Boston, USA", prize: "$354K", winner: "Gentle Mates", status: "finished" },
        { name: "RLCS Major 2 - Paris", date: "May 20-24, 2026", location: "Paris, France", prize: "$354K", winner: null, status: "upcoming" },
        { name: "World Championship", date: "Sep 15-20, 2026", location: "TBD", prize: "$1.2M", winner: null, status: "upcoming" }
    ]
};

function updateClock() {
    const now = new Date();
    const dateEl = document.getElementById('realDate');
    const timeEl = document.getElementById('realTime');
    if (dateEl) dateEl.innerHTML = now.toLocaleDateString(currentLang === 'es' ? 'es-ES' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    if (timeEl) timeEl.innerHTML = now.toLocaleTimeString(currentLang === 'es' ? 'es-ES' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}
setInterval(updateClock, 1000);

function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('rlprohub_theme', document.body.classList.contains('dark') ? 'dark' : 'light');
    const themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

function toggleLanguage() {
    currentLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('rlprohub_lang', currentLang);
    const langBtn = document.getElementById('langBtn');
    if (langBtn) langBtn.innerHTML = currentLang === 'es' ? '🇪🇸' : '🇺🇸';
    updateAllTexts();
}

function updateAllTexts() {
    const t = translations[currentLang];
    const elements = ['inicioLink', 'prosLink', 'eventosLink', 'guiaLink', 'sugerenciasLink', 'heroTitle', 'heroDesc', 'heroBadge', 'footerText'];
    elements.forEach(id => { const el = document.getElementById(id); if (el) el.innerHTML = t[id] || t[el.id] || ''; });
}

async function submitSuggestionToFirebase(name, team, reason) {
    try {
        await db.collection("suggestions").add({
            name, team, reason,
            date: new Date().toISOString(),
            status: "pending",
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        return true;
    } catch (error) {
        console.error("Error:", error);
        return false;
    }
}

// Inicialización
const savedTheme = localStorage.getItem('rlprohub_theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
if (document.getElementById('themeBtn')) document.getElementById('themeBtn').innerHTML = document.body.classList.contains('dark') ? '☀️' : '🌙';
if (document.getElementById('langBtn')) document.getElementById('langBtn').innerHTML = currentLang === 'es' ? '🇪🇸' : '🇺🇸';

updateClock();
setInterval(updateClock, 1000);
