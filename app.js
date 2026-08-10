// DONNÉES DE PLANIFICATION QUOTIDIENNE (QUOI FAIRE & QUAND)
const scheduleData = [
  { time: "07:30", desc: "Hydratation (500ml d'eau) + Réveil corporel & Étirements légers." },
  { time: "08:00", desc: "Petit-Déjeuner : Overnight Oats ou Omelette Protéinée." },
  { time: "09:00", desc: "Début de la session Dev. Remplis ta gourde de 1.5L d'eau." },
  { time: "10:00", desc: "Pause Active 5 min : 10 squats + étirement des hanches (Règle 50/5)." },
  { time: "11:00", desc: "Pause Active 5 min : Marche rapide dans le logement." },
  { time: "12:30", desc: "Déjeuner hors de l'écran (Ex: Salade Thon & Cannellini / Bowl Saumon)." },
  { time: "14:00", desc: "Reprise du travail + Pause Active 5 min." },
  { time: "16:00", desc: "Collation : Shaker Protéiné + Noix de Grenoble (Gourde 1.5L terminée !)." },
  { time: "18:00", desc: "Séance de Sport à la maison (35-45 min)." },
  { time: "20:00", desc: "Dîner : Pavé de Saumon, Brocolis & Lentilles." },
  { time: "22:30", desc: "Coupure des écrans / Filtre lumière bleue. Préparation au sommeil." }
];

// DONNÉES DES RECETTES DÉTAILLÉES ÉTAPE PAR ÉTAPE
const recipesData = [
  {
    id: 1,
    category: "pdej",
    title: "Overnight Oats Super-Graines",
    prepTime: "5 min (la veille)",
    proteins: "28g",
    fibers: "12g",
    omega3: "Élevé",
    ingredients: ["50g flocons d'avoine", "200g fromage blanc 0%", "15g graines de chia", "10g graines de lin moulues", "Poignée de myrtilles"],
    steps: [
      "Dans un bocal ou un récipient, verse les 50g de flocons d'avoine.",
      "Ajoute les 15g de graines de chia et les 10g de graines de lin préalablement moulues (pour une absorption maximale des Oméga-3).",
      "Incorpore les 200g de fromage blanc 0% et mélange le tout vigoureusement.",
      "Ajoute un filet d'eau si la consistance est trop dense.",
      "Dépose les myrtilles sur le dessus, ferme le récipient et réserve au réfrigérateur toute la nuit."
    ]
  },
  {
    id: 2,
    category: "pdej",
    title: "Omelette Revisitée & Épinards sur Pain Complet",
    prepTime: "8 min",
    proteins: "26g",
    fibers: "6g",
    omega3: "Moyen (Œufs Bleu-Blanc-Cœur)",
    ingredients: ["3 œufs entiers", "1 poignée d'épinards frais", "2 tranches de pain complet au levain", "1 c.à.s d'huile d'olive"],
    steps: [
      "Bats les 3 œufs dans un bol avec une pincée de sel et de poivre.",
      "Fais chauffer l'huile d'olive dans une poêle antiadhésive à feu moyen.",
      "Jette la poignée d'épinards frais dans la poêle et fais-les tomber pendant 1 minute.",
      "Verse les œufs battus par-dessus les épinards. Laisse cuire 3 à 4 minutes selon ta préférence de cuisson.",
      "Fais griller les 2 tranches de pain complet et sers l'omelette bien chaude dessus."
    ]
  },
  {
    id: 3,
    category: "dejeuner",
    title: "Salade Express Thon, Cannellini & Colza",
    prepTime: "5 min",
    proteins: "38g",
    fibers: "11g",
    omega3: "Très Élevé",
    ingredients: ["1 boîte de thon au naturel (120g)", "150g haricots blancs (cannellini)", "Tomates concassées", "1.5 c.à.s d'huile de colza", "Jus de citron"],
    steps: [
      "Égoutte et rince les haricots blancs (cannellini) à l'eau froide.",
      "Dans un grand bol, émiette le thon au naturel.",
      "Ajoute les haricots blancs et 3 cuillères à soupe de tomates concassées.",
      "Assaisonne avec la cuillère et demi d'huile de colza (riche en Oméga-3, ne pas chauffer).",
      "Arrose d'un filet de jus de citron, sale, poivre et mélange."
    ]
  },
  {
    id: 4,
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
      "Dépose le pavé de saumon sur une plaque couverte de papier cuisson, sale, poivre et enfourne pendant 12 à 15 minutes.",
      "Réchauffe les lentilles vertes dans une petite casserole à feu doux.",
      "Assemble dans ton assiette : le saumon, les brocolis arrosés d'un trait d'huile d'olive/ail et les lentilles."
    ]
  },
  {
    id: 5,
    category: "snack",
    title: "Encas Shaker & Noix de Grenoble",
    prepTime: "2 min",
    proteins: "25g",
    fibers: "3g",
    omega3: "Élevé",
    ingredients: ["30g de Whey ou protéine végétale", "200ml d'eau ou lait d'amande", "20g de cerneaux de noix"],
    steps: [
      "Mets 30g de poudre de protéine dans ton shaker.",
      "Ajoute 200ml d'eau ou de lait d'amande sans sucre.",
      "Mélange vigoureusement pendant 15 secondes.",
      "Consomme immédiatement accompagné des 20g de cerneaux de noix pour les acides gras essentiels."
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
  // Exemple de notification de démonstration envoyée après 5 secondes
  setTimeout(() => {
    if (Notification.permission === "granted") {
      new Notification("DevFit - Pause Active 50/5 !", {
        body: "Développeur, lève-toi ! Fais 10 squats et bois une gorgée d'eau.",
        icon: "https://via.placeholder.com/128"
      });
    }
  }, 5000);
}
