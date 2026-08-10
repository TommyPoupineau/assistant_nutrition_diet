// ENREGISTREMENT DU SERVICE WORKER AVEC MISE À JOUR AUTO
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      // Vérifie s'il y a une nouvelle version sur le serveur
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // Nouvelle version détectée -> on force le rechargement de la page
            window.location.reload();
          }
        };
      };
    });
  });
}

// DONNÉES DE PLANIFICATION QUOTIDIENNE (QUOI FAIRE & QUAND)
const scheduleData = [
  { time: "07:30", desc: "Hydratation (500ml d'eau) + Réveil corporel & Étirements légers." },
  { time: "08:00", desc: "Petit-Déjeuner : Overnight Oats, Omelette ou Bowl Skyr." },
  { time: "09:00", desc: "Début de la session Dev. Remplis ta gourde de 1.5L d'eau sur ton bureau." },
  { time: "10:00", desc: "Pause Active 5 min : 10 squats + étirement des hanches (Règle 50/5)." },
  { time: "11:00", desc: "Pause Active 5 min : Marche rapide dans le logement." },
  { time: "12:30", desc: "Déjeuner hors de l'écran (Ex: Salade Thon, Bowl Saumon ou Wrap Poulet)." },
  { time: "14:00", desc: "Reprise du travail + Pause Active 5 min." },
  { time: "16:00", desc: "Collation : Shaker Protéiné, Pomme/Beurre d'amande ou Fromage Blanc." },
  { time: "18:00", desc: "Séance de Sport à la maison (35-45 min)." },
  { time: "20:00", desc: "Dîner : Saumon/Brocolis, Chili Dinde ou Cabillaud Croûte de Graines." },
  { time: "22:30", desc: "Coupure des écrans / Filtre lumière bleue. Préparation au sommeil." }
];

// DONNÉES DES RECETTES DÉTAILLÉES ÉTAPE PAR ÉTAPE (23 RECETTES)
const recipesData = [
  // --- PETITS-DÉJEUNERS ---
  {
    id: 1,
    category: "pdej",
    title: "Overnight Oats Super-Graines",
    prepTime: "5 min (la veille)",
    proteins: "28g",
    fibers: "12g",
    omega3: "Très Élevé",
    ingredients: ["50g flocons d'avoine", "200g fromage blanc 0%", "15g graines de chia", "10g graines de lin moulues", "Poignée de myrtilles"],
    steps: [
      "Dans un bocal ou un récipient hermétique, verse les 50g de flocons d'avoine.",
      "Ajoute les 15g de graines de chia et les 10g de graines de lin préalablement moulues (essentiel pour assimiler les Oméga-3).",
      "Incorpore les 200g de fromage blanc 0% et mélange le tout vigoureusement.",
      "Ajoute un filet d'eau si la consistance est trop dense pour détendre le mélange.",
      "Dépose les myrtilles sur le dessus, ferme le récipient et réserve au réfrigérateur toute la nuit."
    ]
  },
  {
    id: 2,
    category: "pdej",
    title: "Omelette Épinards & Pain au Levain",
    prepTime: "8 min",
    proteins: "26g",
    fibers: "6g",
    omega3: "Élevé (Œufs Bleu-Blanc-Cœur)",
    ingredients: ["3 œufs entiers", "1 poignée d'épinards frais", "2 tranches de pain complet au levain", "1 c.à.s d'huile d'olive"],
    steps: [
      "Casse et bats les 3 œufs dans un bol avec une pincée de sel et de poivre.",
      "Fais chauffer l'huile d'olive dans une poêle à feu moyen.",
      "Jette la poignée d'épinards frais dans la poêle et fais-les tomber pendant 1 minute.",
      "Verse les œufs battus par-dessus les épinards. Laisse cuire 3 à 4 minutes.",
      "Fais griller les 2 tranches de pain complet au levain et sers l'omelette bien chaude dessus."
    ]
  },
  {
    id: 3,
    category: "pdej",
    title: "Bowl Froment, Skyr & Noix de Grenoble",
    prepTime: "3 min",
    proteins: "32g",
    fibers: "5g",
    omega3: "Très Élevé",
    ingredients: ["250g de Skyr ou Kéfir", "1 scoop de protéine en poudre (vanille)", "20g de cerneaux de noix", "1/2 banane"],
    steps: [
      "Dans un grand bol, mélange le Skyr avec la protéine en poudre jusqu'à obtenir une texture lisse.",
      "Écrase légèrement les cerneaux de noix de Grenoble entre tes mains et parsème-les sur le dessus.",
      "Découpe la demi-banane en rondelles et ajoute-les pour apporter des glucides à digestion progressive."
    ]
  },
  {
    id: 4,
    category: "pdej",
    title: "Pancakes Protéinés Avoine & Graines de Chia",
    prepTime: "10 min",
    proteins: "30g",
    fibers: "8g",
    omega3: "Moyen",
    ingredients: ["60g flocons d'avoine mixés", "2 œufs entiers", "100g de fromage blanc 0%", "10g graines de chia", "1 c.à.c de levure chimique"],
    steps: [
      "Mixe les flocons d'avoine pour obtenir une texture de farine.",
      "Dans un cul-de-poule, mélange la farine d'avoine, les 2 œufs, le fromage blanc, les graines de chia et la levure.",
      "Laisse reposer la pâte 2 minutes pour que les graines de chia gélifient légèrement.",
      "Dans une poêle chaude légèrement huilée, verse de petites louches de pâte.",
      "Fais cuire 2 minutes de chaque côté jusqu'à coloration dorée."
    ]
  },
  {
    id: 16,
    category: "pdej",
    title: "Toast Avocat, Œuf Poché & Saumon Fumé",
    prepTime: "8 min",
    proteins: "27g",
    fibers: "7g",
    omega3: "Excellence EPA/DHA",
    ingredients: ["2 tranches de pain seigle/complet", "1/2 avocat", "1 œuf entier", "50g de saumon fumé", "Jus de citron & Graines de sésame"],
    steps: [
      "Fais griller les tranches de pain de seigle.",
      "Écrase le demi-avocat à la fourchette avec un filet de citron, du sel et du poivre, puis étale sur les toasts.",
      "Dépose le saumon fumé sur l'avocat.",
      "Fais pocher ou cuire au plat l'œuf et dépose-le au-dessus.",
      "Saupoudre de graines de sésame."
    ]
  },
  {
    id: 17,
    category: "pdej",
    title: "Smoothie Bowl Protéiné Framboise & Lin",
    prepTime: "5 min",
    proteins: "29g",
    fibers: "10g",
    omega3: "Très Élevé",
    ingredients: ["200g de fromage blanc 0%", "100g de framboises surgelées", "1 scoop de protéine vanille", "15g graines de lin moulues", "10g amandes effilées"],
    steps: [
      "Mixe le fromage blanc, les framboises encore surgelées et la protéine jusqu'à consistance onctueuse et très fraîche.",
      "Verse dans un bowl.",
      "Ajoute les graines de lin moulues et les amandes effilées sur le dessus pour le croquant."
    ]
  },

  // --- DÉJEUNERS ---
  {
    id: 5,
    category: "dejeuner",
    title: "Salade Express Thon, Cannellini & Colza",
    prepTime: "5 min",
    proteins: "38g",
    fibers: "11g",
    omega3: "Très Élevé",
    ingredients: ["1 boîte de thon au naturel (120g)", "150g haricots blancs (cannellini)", "Tomates concassées", "1.5 c.à.s d'huile de colza", "Jus de citron"],
    steps: [
      "Égoutte et rince les haricots blancs (cannellini) sous l'eau froide.",
      "Dans un grand bol, émiette le thon au naturel.",
      "Ajoute les haricots blancs et 3 cuillères à soupe de tomates concassées.",
      "Assaisonne avec la cuillère et demi d'huile de colza (cru, ne pas chauffer).",
      "Arrose d'un filet de jus de citron, sale, poivre et mélange énergiquement."
    ]
  },
  {
    id: 6,
    category: "dejeuner",
    title: "Bowl Saumon Fumé, Quinoa & Avocat",
    prepTime: "10 min",
    proteins: "35g",
    fibers: "9g",
    omega3: "Excellence EPA/DHA",
    ingredients: ["100g de saumon fumé", "120g de quinoa cuit", "1/2 avocat", "Concombre en dés", "Graines de sésame"],
    steps: [
      "Dispose le quinoa cuit (préalablement préparé lors de ton batchcooking) au fond d'un bowl.",
      "Découpe le saumon fumé et le demi-avocat en tranches épaisses.",
      "Ajoute le concombre coupé en petits dés pour apporter du croquant.",
      "Parsème de graines de sésame et assaisonne d'un filet d'huile de colza ou de soja."
    ]
  },
  {
    id: 7,
    category: "dejeuner",
    title: "Wrap Intégral Poulet, Houmous & Crudités",
    prepTime: "7 min",
    proteins: "36g",
    fibers: "10g",
    omega3: "Modéré",
    ingredients: ["1 grande tortilla intégrale", "130g d'aiguillettes de poulet", "2 c.à.s de houmous", "Carottes râpées", "Jeunes pousses d'épinard"],
    steps: [
      "Fais poêler les aiguillettes de poulet 4 à 5 minutes avec un filet d'huile d'olive.",
      "Étale les 2 cuillères à soupe de houmous sur toute la surface de la tortilla intégrale.",
      "Dépose les jeunes pousses d'épinard et les carottes râpées.",
      "Dispose le poulet tiède au centre, rabats les côtés et enroule le wrap fermement."
    ]
  },
  {
    id: 8,
    category: "dejeuner",
    title: "Pâtes Complètes au Maquereau & Courgettes",
    prepTime: "12 min",
    proteins: "34g",
    fibers: "8g",
    omega3: "Très Élevé",
    ingredients: ["60g (cru) pâtes complètes", "1 boîte de maquereau au naturel", "1 courgette", "1 gousse d'ail", "1 c.à.s d'huile d'olive"],
    steps: [
      "Fais cuire les pâtes complètes dans l'eau bouillante salée selon le temps indiqué sur le paquet.",
      "Pendant ce temps, découpe la courgette en fines rondelles et hache la gousse d'ail.",
      "Fais revenir la courgette et l'ail dans une poêle avec l'huile d'olive pendant 6 à 8 minutes.",
      "Égoutte les pâtes, mélange-les aux courgettes et ajoute les filets de maquereau émiettés."
    ]
  },
  {
    id: 18,
    category: "dejeuner",
    title: "Salade TIÈDE de Lentilles, Sardines & Échalotes",
    prepTime: "6 min",
    proteins: "35g",
    fibers: "12g",
    omega3: "Excellence EPA/DHA",
    ingredients: ["200g de lentilles cuites", "1 boîte de sardines au naturel ou huile d'olive", "1 échalote hachée", "1 c.à.s moutarde à l'ancienne", "1 c.à.s huile de colza"],
    steps: [
      "Réchauffe très légèrement les lentilles au micro-ondes (1 min).",
      "Dans un bol, mélange la moutarde, l'huile de colza et l'échalote finement hachée.",
      "Incorpore les lentilles tièdes et mélange pour qu'elles s'imprégnent de la vinaigrette.",
      "Dépose les sardines par-dessus sans trop les émietter."
    ]
  },
  {
    id: 19,
    category: "dejeuner",
    title: "Bowl Crevettes, Riz Noir & Poivrons Saautés",
    prepTime: "12 min",
    proteins: "33g",
    fibers: "6g",
    omega3: "Élevé",
    ingredients: ["150g de crevettes décortiquées", "120g de riz noir cuit", "1 poivron rouge coupé en dés", "1 c.à.s d'huile de sésame", "Sauce soja réduite en sel"],
    steps: [
      "Fais sauter les dés de poivron dans une poêle avec l'huile de sésame pendant 5 minutes.",
      "Ajoute les crevettes et fais cuire 3 à 4 minutes supplémentaires.",
      "Déglace avec un trait de sauce soja.",
      "Sers chaud sur le lit de riz noir."
    ]
  },

  // --- DÎNERS ---
  {
    id: 9,
    category: "diner",
    title: "Pavé de Saumon, Brocolis & Lentilles",
    prepTime: "20 min",
    proteins: "42g",
    fibers: "14g",
    omega3: "Excellence EPA/DHA",
    ingredients: ["140g pavé de saumon", "150g brocolis", "100g lentilles vertes cuites", "Ail, sel, poivre"],
    steps: [
      "Préchauffe ton four à 180°C.",
      "Coupe le brocolis en fleurettes et fais-les cuire à la vapeur pendant 10 minutes.",
      "Dépose le pavé de saumon sur une plaque couverte de papier cuisson, sale, poivre et enfourne pendant 12 minutes.",
      "Réchauffe les lentilles vertes dans une petite casserole à feu doux.",
      "Assemble dans ton assiette : le saumon, les brocolis arrosés d'un trait d'huile d'olive et les lentilles."
    ]
  },
  {
    id: 10,
    category: "diner",
    title: "Chili Express Dinde & Haricots Rouges",
    prepTime: "15 min",
    proteins: "40g",
    fibers: "12g",
    omega3: "Moyen",
    ingredients: ["150g haché de dinde 5%", "150g haricots rouges cuits", "200g purée de tomates", "Épices chili", "1 c.à.s huile d'olive"],
    steps: [
      "Fais revenir le haché de dinde dans une poêle avec l'huile d'olive à feu vif pendant 4 minutes.",
      "Saupoudre généreusement d'épices chili, de sel et de poivre.",
      "Ajoute les haricots rouges rincés et égouttés, puis verse la purée de tomates.",
      "Laisse mijoter à feu doux pendant 8 à 10 minutes pour concentrer les saveurs."
    ]
  },
  {
    id: 11,
    category: "diner",
    title: "Sauté de Bœuf Maigre aux Poivrons & Riz Complet",
    prepTime: "15 min",
    proteins: "38g",
    fibers: "7g",
    omega3: "Faible",
    ingredients: ["150g pavé de bœuf 5% ou Tofu ferme", "1 poivron rouge", "1/2 oignon", "100g riz complet cuit", "1 c.à.s sauce soja"],
    steps: [
      "Émince le bœuf (ou le tofu) en fines lanières, ainsi que le poivron et l'oignon.",
      "Dans une poêle très chaude ou un wok, fais sauter l'oignon et le poivron avec un filet d'huile pendant 5 minutes.",
      "Ajoute les lanières de bœuf et la sauce soja. Fais sauter 3 minutes à feu vif.",
      "Sers immédiatement accompagné du riz complet chaud."
    ]
  },
  {
    id: 12,
    category: "diner",
    title: "Cabillaud en Croûte de Graines & Épinards",
    prepTime: "15 min",
    proteins: "36g",
    fibers: "6g",
    omega3: "Très Élevé",
    ingredients: ["160g filet de cabillaud", "15g mélange graines (lin, chia, sésame)", "250g épinards frais", "1 c.à.s huile d'olive"],
    steps: [
      "Écrase légèrement les graines de lin et chia pour libérer leurs nutriments.",
      "Presse le filet de cabillaud dans le mélange de graines pour former une croûte sur le dessus.",
      "Fais cuire le cabillaud au four à 180°C pendant 12 minutes.",
      "Pendant ce temps, fais tomber les épinards frais dans une poêle avec l'huile d'olive et de l'ail haché."
    ]
  },
  {
    id: 20,
    category: "diner",
    title: "Curry de Tofu/Poulet, Choux Fleurs & Lait de Coco Léger",
    prepTime: "18 min",
    proteins: "35g",
    fibers: "9g",
    omega3: "Moyen",
    ingredients: ["150g filet de poulet ou Tofu", "200g chou-fleur en petits morceaux", "100ml lait de coco léger", "1 c.à.s de pâte de curry jaune", "1 c.à.s huile de colza"],
    steps: [
      "Découpe le poulet/tofu en dés et fais-les dorer dans l'huile de colza pendant 4 minutes.",
      "Ajoute les morceaux de chou-fleur et la pâte de curry.",
      "Verse le lait de coco léger et 50ml d'eau.",
      "Laisse mijoter à couvert pendant 10 minutes jusqu'à ce que le chou-fleur soit tendre."
    ]
  },
  {
    id: 21,
    category: "diner",
    title: "Omelette Fluffy aux Crevettes & Herbes Fraîches",
    prepTime: "10 min",
    proteins: "34g",
    fibers: "4g",
    omega3: "Élevé",
    ingredients: ["3 œufs entiers", "100g de crevettes cuites", "Aneth et ciboulette", "1/2 courgette râpée", "1 c.à.s d'huile d'olive"],
    steps: [
      "Bats les œufs avec les herbes ciselées, le sel et le poivre.",
      "Fais revenir la courgette râpée dans la poêle avec l'huile d'olive pendant 3 minutes.",
      "Ajoute les crevettes, puis verse les œufs battus.",
      "Laisse cuire à feu doux pendant 4 à 5 minutes pour garder l'omelette baveuse et légère."
    ]
  },

  // --- COLLATION / SNACKS ---
  {
    id: 13,
    category: "snack",
    title: "Shaker Protéiné & Noix de Grenoble",
    prepTime: "2 min",
    proteins: "25g",
    fibers: "3g",
    omega3: "Élevé",
    ingredients: ["30g de Whey ou protéine végétale", "200ml d'eau ou lait d'amande", "20g de cerneaux de noix"],
    steps: [
      "Mets 30g de poudre de protéine dans ton shaker.",
      "Ajoute 200ml d'eau ou de lait d'amande sans sucre.",
      "Mélange vigoureusement pendant 15 secondes.",
      "Consomme immédiatement accompagné des 20g de cerneaux de noix de Grenoble."
    ]
  },
  {
    id: 14,
    category: "snack",
    title: "Pomme Crue & Beurre de Cacahuète Pur",
    prepTime: "2 min",
    proteins: "8g",
    fibers: "6g",
    omega3: "Faible",
    ingredients: ["1 grande pomme", "20g de beurre de cacahuète/amande 100% pur"],
    steps: [
      "Lave et coupe la pomme en tranches régulières.",
      "Tartine chaque tranche d'une fine couche de beurre de cacahuète pur (sans huile de palme ni sucre ajouté).",
      "Déguste lentement pour maximiser la satiété grâce à la pectine et aux bons lipides."
    ]
  },
  {
    id: 15,
    category: "snack",
    title: "Fromage Blanc 0% & Graines de Lin Moulues",
    prepTime: "2 min",
    proteins: "20g",
    fibers: "4g",
    omega3: "Élevé",
    ingredients: ["200g fromage blanc 0%", "10g graines de lin moulues", "Un trait de stévia ou vanille liquide"],
    steps: [
      "Verse le fromage blanc 0% dans un ramequin.",
      "Mouds les graines de lin au dernier moment pour préserver la qualité des oméga-3.",
      "Incorpore les graines et un trait d'arôme vanille ou stévia, puis mélange bien."
    ]
  },
  {
    id: 22,
    category: "snack",
    title: "Muffin Mug Protéiné Minute (Micro-Ondes)",
    prepTime: "3 min",
    proteins: "22g",
    fibers: "5g",
    omega3: "Moyen",
    ingredients: ["1 œuf", "25g de protéine en poudre (Chocolat ou Vanille)", "10g de farine d'avoine", "2 c.à.s de lait", "1/2 c.à.c de levure"],
    steps: [
      "Dans une grande tasse (mug), fouette l'œuf avec le lait.",
      "Ajoute la protéine, la farine d'avoine et la levure.",
      "Mélange bien à la fourchette jusqu'à consistance homogène.",
      "Cuis au micro-ondes pendant 50 à 60 secondes (600W-800W). Laisse tiédir avant de déguster !"
    ]
  },
  {
    id: 23,
    category: "snack",
    title: "Rondelles de Concombre & Tzatziki Protéiné",
    prepTime: "4 min",
    proteins: "15g",
    fibers: "3g",
    omega3: "Faible",
    ingredients: ["1/2 concombre", "150g de Skyr", "1 c.à.c d'huile d'olive", "Jus de citron, ail en poudre, menthe"],
    steps: [
      "Dans un ramequin, mélange le Skyr avec l'huile d'olive, l'ail en poudre, la menthe ciselée et un trait de citron.",
      "Tranche le demi-concombre en rondelles épaisses.",
      "Utilise les rondelles de concombre comme toasts pour tremper dans le tzatziki maison."
    ]
  }
];

// PROGRAMMES D'ENTRAÎNEMENT
const workoutData = {
  A: {
    title: "Séance A : Posture & Force",
    desc: "3 à 4 tours | 60 à 90 secondes de repos entre exercices",
    exercises: [
      { name: "1. Goblet Squat (avec haltère)", reps: "10-12 reps", note: "Dos droit, descend sous les genoux." },
      { name: "2. Oiseau / Rear Delt Fly (haltères)", reps: "12-15 reps", note: "Poids légers. Cible le haut du dos pour la posture." },
      { name: "3. Floor Press au sol (haltères)", reps: "10-12 reps", note: "Allongé sur le dos, développe les haltères vers le haut." },
      { name: "4. Rowing Buste Penché", reps: "10-12 reps / côté", note: "Tire les coudes vers les hanches pour cibler les dorsaux." },
      { name: "5. Planche avec touche d'épaule", reps: "40 secondes", note: "Bassin fixe, ne pas dandiner les hanches." }
    ]
  },
  B: {
    title: "Séance B : HIIT & Circuit Métabolique",
    desc: "4 à 5 tours | 40 sec d'effort / 20 sec de repos par exercice",
    exercises: [
      { name: "1. Fentes Arrière Alternées", reps: "40 sec", note: "Doux pour les genoux, monte le rythme cardiaque." },
      { name: "2. Renegade Row (Position pompe)", reps: "40 sec", note: "Gainage actif + tirage du dos." },
      { name: "3. Thrusters (Squat + Développé Épaules)", reps: "40 sec", note: "Dépense calorique maximale !" },
      { name: "4. Bird-Dog Dynamique", reps: "40 sec", note: "Renforce la sangle abdominale et le bas du dos." },
      { name: "5. Mountain Climbers contrôlés", reps: "40 sec", note: "Rythme régulier sans traumatiser les articulations." }
    ]
  }
};

// INITIALISATION AU CHARGEMENT DU DOM
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  renderRecipes('all');
  renderWorkout('A');
  setupNavigation();
  setupNotifications();
});

// GESTION DES ONGLETS
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabPanes = document.querySelectorAll('.tab-pane');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const tabId = item.getAttribute('data-tab');
      
      navItems.forEach(nav => nav.classList.remove('active'));
      tabPanes.forEach(pane => pane.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(tabId).classList.add('active');
    });
  });

  // Gestion des filtres de recettes
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecipes(btn.getAttribute('data-filter'));
    });
  });

  // Modal Close
  document.querySelector('.close-modal').onclick = () => {
    document.getElementById('recipe-modal').style.display = 'none';
  };
}

// RENDU DE LA TIMELINE
function renderTimeline() {
  const container = document.getElementById('daily-timeline');
  container.innerHTML = scheduleData.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-desc">${item.desc}</div>
    </div>
  `).join('');
}

// RENDU DES RECETTES
function renderRecipes(filter) {
  const container = document.getElementById('recipes-list');
  const filtered = filter === 'all' ? recipesData : recipesData.filter(r => r.category === filter);

  container.innerHTML = filtered.map(recipe => `
    <div class="recipe-card" onclick="openRecipeModal(${recipe.id})">
      <div class="recipe-header">
        <div class="recipe-title">${recipe.title}</div>
        <div class="recipe-time">${recipe.prepTime}</div>
      </div>
      <div class="recipe-badges">
        <span class="badge badge-prot">Prot: ${recipe.proteins}</span>
        <span class="badge">Fibres: ${recipe.fibers}</span>
        <span class="badge badge-omega">Oméga-3: ${recipe.omega3}</span>
      </div>
    </div>
  `).join('');
}

// OUVERTURE DE LA MODAL RECETTE
function openRecipeModal(id) {
  const recipe = recipesData.find(r => r.id === id);
  if (!recipe) return;

  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h2 style="color: var(--accent); margin-bottom: 0.5rem;">${recipe.title}</h2>
    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 1rem;">Temps : ${recipe.prepTime}</p>
    
    <h3 style="margin-top: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem;">Ingrédients</h3>
    <ul style="margin: 0.5rem 0 1rem 1.5rem; line-height: 1.6;">
      ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join('')}
    </ul>

    <h3 style="margin-top: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem;">Préparation Étape par Étape</h3>
    <ol style="margin: 0.5rem 0 1rem 1.5rem; line-height: 1.6;">
      ${recipe.steps.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
    </ol>
  `;

  document.getElementById('recipe-modal').style.display = 'flex';
}

// RENDU DES SÉANCES
function switchWorkout(type) {
  document.querySelectorAll('.workout-tab-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderWorkout(type);
}

function renderWorkout(type) {
  const data = workoutData[type];
  const container = document.getElementById('workout-details');

  container.innerHTML = `
    <h3 style="color: var(--accent);">${data.title}</h3>
    <p style="color: var(--text-muted); font-size: 0.85rem; margin-bottom: 1rem;">${data.desc}</p>
    <div>
      ${data.exercises.map(ex => `
        <div class="exercise-item">
          <strong>${ex.name}</strong> - <span style="color: var(--accent);">${ex.reps}</span>
          <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 0.2rem;">${ex.note}</p>
        </div>
      `).join('')}
    </div>
  `;
}

// GESTION DES NOTIFICATIONS NATIVES SMARTPHONE
function setupNotifications() {
  const btn = document.getElementById('btn-notification');
  btn.addEventListener('click', () => {
    if (!("Notification" in window)) {
      alert("Ce navigateur ne supporte pas les notifications.");
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("Notifications activées ! L'application te rappellera de bouger toutes les heures.");
        scheduleLocalNotifications();
      } else {
        alert("Permission refusée pour les notifications.");
      }
    });
  });
}

function scheduleLocalNotifications() {
  setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification("DevFit - Pause Active 50/5 !", {
        body: "Développeur, lève-toi ! Fais 10 squats et bois une gorgée d'eau.",
        icon: "https://via.placeholder.com/128"
      });
    }
  }, 5000);
}
