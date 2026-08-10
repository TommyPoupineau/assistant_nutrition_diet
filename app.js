// ENREGISTREMENT DU SERVICE WORKER AVEC MISE À JOUR AUTO
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').then((registration) => {
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            window.location.reload();
          }
        };
      };
    });
  });
}

// ETAT DES RECETTES SELECTIONNEES & INGREDIENTS CHECKES
let selectedRecipeIds = JSON.parse(localStorage.getItem('devfit_selected_recipes')) || [];
let checkedGroceryItems = JSON.parse(localStorage.getItem('devfit_checked_groceries')) || [];

// DONNÉES DE PLANIFICATION QUOTIDIENNE
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

// DONNÉES DES RECETTES (23 RECETTES)
const recipesData = [
  { id: 1, category: "pdej", title: "Overnight Oats Super-Graines", prepTime: "5 min (la veille)", proteins: "28g", fibers: "12g", omega3: "Très Élevé", ingredients: ["50g flocons d'avoine", "200g fromage blanc 0%", "15g graines de chia", "10g graines de lin moulues", "Poignée de myrtilles"], steps: ["Dans un bocal, verse les flocons d'avoine.", "Ajoute les graines de chia et de lin.", "Incorpore le fromage blanc 0% et mélange.", "Dépose les myrtilles et réserve au frais."] },
  { id: 2, category: "pdej", title: "Omelette Épinards & Pain au Levain", prepTime: "8 min", proteins: "26g", fibers: "6g", omega3: "Élevé", ingredients: ["3 œufs entiers", "1 poignée d'épinards frais", "2 tranches de pain complet au levain", "1 c.à.s d'huile d'olive"], steps: ["Bats les 3 œufs dans un bol.", "Fais tomber les épinards à la poêle avec l'huile.", "Verse les œufs et laisse cuire 3-4 min.", "Sers sur le pain grillé."] },
  { id: 3, category: "pdej", title: "Bowl Froment, Skyr & Noix de Grenoble", prepTime: "3 min", proteins: "32g", fibers: "5g", omega3: "Très Élevé", ingredients: ["250g de Skyr ou Kéfir", "1 scoop de protéine vanille", "20g de cerneaux de noix", "1/2 banane"], steps: ["Mélange le Skyr et la protéine.", "Ajoute les cerneaux de noix et les rondelles de banane."] },
  { id: 4, category: "pdej", title: "Pancakes Protéinés Avoine & Chia", prepTime: "10 min", proteins: "30g", fibers: "8g", omega3: "Moyen", ingredients: ["60g flocons d'avoine mixés", "2 œufs entiers", "100g de fromage blanc 0%", "10g graines de chia", "1 c.à.c de levure chimique"], steps: ["Mélange l'avoine, les œufs, le fromage blanc, les graines de chia et la levure.", "Fais cuire de petits pancakes dans une poêle chaude 2 min par côté."] },
  { id: 16, category: "pdej", title: "Toast Avocat, Œuf Poché & Saumon Fumé", prepTime: "8 min", proteins: "27g", fibers: "7g", omega3: "Excellence EPA/DHA", ingredients: ["2 tranches de pain seigle/complet", "1/2 avocat", "1 œuf entier", "50g de saumon fumé", "Jus de citron", "Graines de sésame"], steps: ["Écrase l'avocat avec le citron sur le pain grillé.", "Ajoute le saumon et l'œuf poché.", "Parsème de sésame."] },
  { id: 17, category: "pdej", title: "Smoothie Bowl Protéiné Framboise & Lin", prepTime: "5 min", proteins: "29g", fibers: "10g", omega3: "Très Élevé", ingredients: ["200g de fromage blanc 0%", "100g de framboises surgelées", "1 scoop de protéine vanille", "15g graines de lin moulues", "10g amandes effilées"], steps: ["Mixe le fromage blanc, framboises et protéine.", "Parsème de graines de lin et amandes effilées."] },

  { id: 5, category: "dejeuner", title: "Salade Express Thon, Cannellini & Colza", prepTime: "5 min", proteins: "38g", fibers: "11g", omega3: "Très Élevé", ingredients: ["1 boîte de thon au naturel (120g)", "150g haricots blancs (cannellini)", "Tomates concassées", "1.5 c.à.s d'huile de colza", "Jus de citron"], steps: ["Mélange le thon, les haricots rincés et les tomates.", "Assaisonne avec l'huile de colza et le citron."] },
  { id: 6, category: "dejeuner", title: "Bowl Saumon Fumé, Quinoa & Avocat", prepTime: "10 min", proteins: "35g", fibers: "9g", omega3: "Excellence EPA/DHA", ingredients: ["100g de saumon fumé", "120g de quinoa cuit", "1/2 avocat", "Concombre en dés", "Graines de sésame"], steps: ["Assemble le quinoa, saumon, avocat et concombre.", "Parsème de graines de sésame."] },
  { id: 7, category: "dejeuner", title: "Wrap Intégral Poulet, Houmous & Crudités", prepTime: "7 min", proteins: "36g", fibers: "10g", omega3: "Modéré", ingredients: ["1 grande tortilla intégrale", "130g d'aiguillettes de poulet", "2 c.à.s de houmous", "Carottes râpées", "Jeunes pousses d'épinard"], steps: ["Poêle le poulet 5 min.", "Étale le houmous sur la tortilla, ajoute la garniture et roule."] },
  { id: 8, category: "dejeuner", title: "Pâtes Complètes au Maquereau & Courgettes", prepTime: "12 min", proteins: "34g", fibers: "8g", omega3: "Très Élevé", ingredients: ["60g pâtes complètes", "1 boîte de maquereau au naturel", "1 courgette", "1 gousse d'ail", "1 c.à.s d'huile d'olive"], steps: ["Fais cuire les pâtes.", "Fais sauter la courgette et l'ail à l'huile d'olive.", "Mélange le tout avec le maquereau émietté."] },
  { id: 18, category: "dejeuner", title: "Salade Tiède de Lentilles & Sardines", prepTime: "6 min", proteins: "35g", fibers: "12g", omega3: "Excellence EPA/DHA", ingredients: ["200g de lentilles cuites", "1 boîte de sardines", "1 échalote hachée", "1 c.à.s moutarde à l'ancienne", "1 c.à.s huile de colza"], steps: ["Réchauffe légèrement les lentilles.", "Mélange la vinaigrette avec échalote et moutarde.", "Sers avec les sardines."] },
  { id: 19, category: "dejeuner", title: "Bowl Crevettes, Riz Noir & Poivrons", prepTime: "12 min", proteins: "33g", fibers: "6g", omega3: "Élevé", ingredients: ["150g de crevettes décortiquées", "120g de riz noir cuit", "1 poivron rouge", "1 c.à.s d'huile de sésame", "Sauce soja"], steps: ["Fais sauter le poivron et les crevettes à l'huile de sésame.", "Déglace à la sauce soja et sers sur le riz noir."] },

  { id: 9, category: "diner", title: "Pavé de Saumon, Brocolis & Lentilles", prepTime: "20 min", proteins: "42g", fibers: "14g", omega3: "Excellence EPA/DHA", ingredients: ["140g pavé de saumon", "150g brocolis", "100g lentilles vertes cuites"], steps: ["Cuis le saumon au four à 180°C pendant 12 min.", "Cuis le brocolis à la vapeur et réchauffe les lentilles."] },
  { id: 10, category: "diner", title: "Chili Express Dinde & Haricots Rouges", prepTime: "15 min", proteins: "40g", fibers: "12g", omega3: "Moyen", ingredients: ["150g haché de dinde 5%", "150g haricots rouges cuits", "200g purée de tomates", "Épices chili", "1 c.à.s huile d'olive"], steps: ["Dore le haché de dinde.", "Ajoute les épices, les haricots et la purée de tomate, puis laisse mijoter 8 min."] },
  { id: 11, category: "diner", title: "Sauté de Bœuf Maigre aux Poivrons & Riz", prepTime: "15 min", proteins: "38g", fibers: "7g", omega3: "Faible", ingredients: ["150g pavé de bœuf 5%", "1 poivron rouge", "1/2 oignon", "100g riz complet cuit", "1 c.à.s sauce soja"], steps: ["Émince le bœuf et les légumes.", "Fais sauter au wok à feu vif avec la sauce soja.", "Sers avec le riz."] },
  { id: 12, category: "diner", title: "Cabillaud Croûte de Graines & Épinards", prepTime: "15 min", proteins: "36g", fibers: "6g", omega3: "Très Élevé", ingredients: ["160g filet de cabillaud", "15g graines (lin, chia, sésame)", "250g épinards frais", "1 c.à.s huile d'olive"], steps: ["Presse le cabillaud dans les graines et cuis au four 12 min.", "Fais tomber les épinards à la poêle."] },
  { id: 20, category: "diner", title: "Curry de Poulet/Tofu & Chou-Fleur", prepTime: "18 min", proteins: "35g", fibers: "9g", omega3: "Moyen", ingredients: ["150g filet de poulet", "200g chou-fleur", "100ml lait de coco léger", "1 c.à.s pâte de curry jaune", "1 c.à.s huile de colza"], steps: ["Dore le poulet.", "Ajoute le chou-fleur, le curry et le lait de coco.", "Mijote à couvert 10 min."] },
  { id: 21, category: "diner", title: "Omelette Fluffy aux Crevettes", prepTime: "10 min", proteins: "34g", fibers: "4g", omega3: "Élevé", ingredients: ["3 œufs entiers", "100g de crevettes cuites", "1/2 courgette râpée", "Aneth & Ciboulette", "1 c.à.s d'huile d'olive"], steps: ["Fais sauter la courgette.", "Ajoute les crevettes puis les œufs battus avec herbes."] },

  { id: 13, category: "snack", title: "Shaker Protéiné & Noix de Grenoble", prepTime: "2 min", proteins: "25g", fibers: "3g", omega3: "Élevé", ingredients: ["30g de Whey ou protéine végétale", "200ml d'eau ou lait d'amande", "20g de cerneaux de noix"], steps: ["Mélange la protéine avec le liquide.", "Consomme avec les cerneaux de noix."] },
  { id: 14, category: "snack", title: "Pomme Crue & Beurre de Cacahuète Pur", prepTime: "2 min", proteins: "8g", fibers: "6g", omega3: "Faible", ingredients: ["1 grande pomme", "20g de beurre de cacahuète 100%"], steps: ["Tranche la pomme et tartine de beurre de cacahuète."] },
  { id: 15, category: "snack", title: "Fromage Blanc 0% & Graines de Lin", prepTime: "2 min", proteins: "20g", fibers: "4g", omega3: "Élevé", ingredients: ["200g fromage blanc 0%", "10g graines de lin moulues", "Stévia ou vanille"], steps: ["Mélange le fromage blanc, la vanille et les graines de lin moulues."] },
  { id: 22, category: "snack", title: "Muffin Mug Protéiné Minute", prepTime: "3 min", proteins: "22g", fibers: "5g", omega3: "Moyen", ingredients: ["1 œuf", "25g de protéine en poudre", "10g de farine d'avoine", "2 c.à.s de lait", "1/2 c.à.c de levure"], steps: ["Mélange tout dans une tasse.", "Cuis au micro-ondes pendant 50 à 60 secondes."] },
  { id: 23, category: "snack", title: "Tzatziki Protéiné & Concombre", prepTime: "4 min", proteins: "15g", fibers: "3g", omega3: "Faible", ingredients: ["1/2 concombre", "150g de Skyr", "1 c.à.c d'huile d'olive", "Jus de citron", "Ail en poudre"], steps: ["Mélange le Skyr, huile, citron et ail.", "Trempe les rondelles de concombre dedans."] }
];

// PROGRAMMES D'ENTRAÎNEMENT
const workoutData = {
  A: {
    title: "Séance A : Posture & Force",
    desc: "3 à 4 tours | 60 à 90 secondes de repos",
    exercises: [
      { name: "1. Goblet Squat (avec haltère)", reps: "10-12 reps", note: "Dos droit, descend sous les genoux." },
      { name: "2. Oiseau / Rear Delt Fly (haltères)", reps: "12-15 reps", note: "Poids légers. Cible le haut du dos pour la posture." },
      { name: "3. Floor Press au sol (haltères)", reps: "10-12 reps", note: "Allongé sur le dos, développe vers le haut." },
      { name: "4. Rowing Buste Penché", reps: "10-12 reps / côté", note: "Tire les coudes vers les hanches." },
      { name: "5. Planche avec touche d'épaule", reps: "40 secondes", note: "Bassin fixe." }
    ]
  },
  B: {
    title: "Séance B : HIIT & Circuit Métabolique",
    desc: "4 à 5 tours | 40 sec effort / 20 sec repos",
    exercises: [
      { name: "1. Fentes Arrière Alternées", reps: "40 sec", note: "Doux pour les genoux." },
      { name: "2. Renegade Row (Position pompe)", reps: "40 sec", note: "Gainage actif + tirage." },
      { name: "3. Thrusters (Squat + Développé Épaules)", reps: "40 sec", note: "Dépense calorique maximale !" },
      { name: "4. Bird-Dog Dynamique", reps: "40 sec", note: "Renforce la sangle abdominale." },
      { name: "5. Mountain Climbers contrôlés", reps: "40 sec", note: "Rythme régulier." }
    ]
  }
};

// INITIALISATION
document.addEventListener('DOMContentLoaded', () => {
  renderTimeline();
  renderRecipes('all');
  renderGroceries();
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

      if (tabId === 'tab-groceries') {
        renderGroceries();
      }
    });
  });

  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRecipes(btn.getAttribute('data-filter'));
    });
  });

  document.querySelector('.close-modal').onclick = () => {
    document.getElementById('recipe-modal').style.display = 'none';
  };
}

function renderTimeline() {
  const container = document.getElementById('daily-timeline');
  container.innerHTML = scheduleData.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-desc">${item.desc}</div>
    </div>
  `).join('');
}

// RENDU DES RECETTES AVEC CHECKBOX
function renderRecipes(filter) {
  const container = document.getElementById('recipes-list');
  const filtered = filter === 'all' ? recipesData : recipesData.filter(r => r.category === filter);

  container.innerHTML = filtered.map(recipe => {
    const isChecked = selectedRecipeIds.includes(recipe.id) ? 'checked' : '';
    return `
      <div class="recipe-card">
        <input type="checkbox" class="recipe-checkbox" data-id="${recipe.id}" ${isChecked} onchange="toggleRecipeSelect(${recipe.id})">
        <div class="recipe-content" onclick="openRecipeModal(${recipe.id})">
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
      </div>
    `;
  }).join('');
}

// SELECTION DE RECETTES
function toggleRecipeSelect(id) {
  if (selectedRecipeIds.includes(id)) {
    selectedRecipeIds = selectedRecipeIds.filter(item => item !== id);
  } else {
    selectedRecipeIds.push(id);
  }
  localStorage.setItem('devfit_selected_recipes', JSON.stringify(selectedRecipeIds));
}

// RENDU DE LA LISTE DE COURSES
function renderGroceries() {
  const container = document.getElementById('groceries-container');

  if (selectedRecipeIds.length === 0) {
    container.innerHTML = `
      <div class="grocery-empty">
        <p>🛒 Aucune recette sélectionnée.</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Coche des recettes dans l'onglet <strong>Recettes</strong> pour constituer automatiquement ta liste de courses.</p>
      </div>
    `;
    return;
  }

  // Extraire tous les ingrédients des recettes sélectionnées
  let rawIngredients = [];
  selectedRecipeIds.forEach(id => {
    const recipe = recipesData.find(r => r.id === id);
    if (recipe) {
      rawIngredients = rawIngredients.concat(recipe.ingredients);
    }
  });

  // Éliminer les doublons simples
  const uniqueIngredients = Array.from(new Set(rawIngredients));

  container.innerHTML = `
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
      Basé sur <strong>${selectedRecipeIds.length}</strong> recette(s) choisie(s). Coche ce que tu as déjà en stock :
    </p>
    <div class="grocery-list">
      ${uniqueIngredients.map((ing, index) => {
        const isChecked = checkedGroceryItems.includes(ing) ? 'checked' : '';
        return `
          <label class="grocery-item ${isChecked ? 'checked' : ''}">
            <input type="checkbox" ${isChecked} onchange="toggleGroceryCheck('${ing.replace(/'/g, "\\'")}', this)">
            <span>${ing}</span>
          </label>
        `;
      }).join('')}
    </div>
  `;
}

function toggleGroceryCheck(ingredient, checkbox) {
  const parent = checkbox.closest('.grocery-item');
  if (checkbox.checked) {
    parent.classList.add('checked');
    if (!checkedGroceryItems.includes(ingredient)) checkedGroceryItems.push(ingredient);
  } else {
    parent.classList.remove('checked');
    checkedGroceryItems = checkedGroceryItems.filter(item => item !== ingredient);
  }
  localStorage.setItem('devfit_checked_groceries', JSON.stringify(checkedGroceryItems));
}

// MODAL RECETTE
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

    <h3 style="margin-top: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem;">Préparation</h3>
    <ol style="margin: 0.5rem 0 1rem 1.5rem; line-height: 1.6;">
      ${recipe.steps.map(step => `<li style="margin-bottom: 0.5rem;">${step}</li>`).join('')}
    </ol>
  `;

  document.getElementById('recipe-modal').style.display = 'flex';
}

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

function setupNotifications() {
  const btn = document.getElementById('btn-notification');
  btn.addEventListener('click', () => {
    if (!("Notification" in window)) {
      alert("Ce navigateur ne supporte pas les notifications.");
      return;
    }

    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        alert("Notifications activées !");
      }
    });
  });
}
