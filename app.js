// ENREGISTREMENT DU SERVICE WORKER
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

// ETAT DE L'APPLICATION (LocalStorage)
let selectedRecipesMap = JSON.parse(localStorage.getItem('devfit_selected_recipes_map')) || {}; 
let checkedGroceryItems = JSON.parse(localStorage.getItem('devfit_checked_groceries')) || [];
let waterCount = parseInt(localStorage.getItem('devfit_water_count')) || 0;
let consumedProteins = parseInt(localStorage.getItem('devfit_consumed_proteins')) || 0;
let lastResetDate = localStorage.getItem('devfit_last_reset_date');

// Réinitialisation quotidienne de l'hydratation et des protéines
const todayStr = new Date().toDateString();
if (lastResetDate !== todayStr) {
  waterCount = 0;
  consumedProteins = 0;
  localStorage.setItem('devfit_water_count', 0);
  localStorage.setItem('devfit_consumed_proteins', 0);
  localStorage.setItem('devfit_last_reset_date', todayStr);
}

// DONNÉES DE PLANIFICATION QUOTIDIENNE
const scheduleData = [
  { id: 'p1', time: "07:30", desc: "Hydratation (500ml) + Réveil corporel & Étirements.", prot: 0 },
  { id: 'p2', time: "08:00", desc: "Petit-Déjeuner Protéiné.", prot: 28 },
  { id: 'p3', time: "09:00", desc: "Début session Dev. Remplis ta gourde de 1.5L sur ton bureau.", prot: 0 },
  { id: 'p4', time: "10:00", desc: "Pause Active 5 min : 10 squats + étirement des hanches.", prot: 0 },
  { id: 'p5', time: "11:00", desc: "Pause Active 5 min : Marche rapide dans le logement.", prot: 0 },
  { id: 'p6', time: "12:30", desc: "Déjeuner hors de l'écran.", prot: 36 },
  { id: 'p7', time: "14:00", desc: "Reprise du travail + Pause Active 5 min.", prot: 0 },
  { id: 'p8', time: "16:00", desc: "Collation Protéinée.", prot: 25 },
  { id: 'p9', time: "18:00", desc: "Séance de Sport à la maison (35-45 min).", prot: 0 },
  { id: 'p10', time: "20:00", desc: "Dîner complet & Anti-inflammatoire.", prot: 38 },
  { id: 'p11', time: "22:30", desc: "Coupure des écrans. Préparation au sommeil.", prot: 0 }
];

// DONNÉES DES RECETTES (23 RECETTES)
const recipesData = [
  { id: 1, category: "pdej", title: "Overnight Oats Super-Graines", prepTime: "5 min", proteins: "28g", protValue: 28, fibers: "12g", omega3: "Très Élevé", ingredients: ["50g flocons d'avoine", "200g fromage blanc 0%", "15g graines de chia", "10g graines de lin moulues", "50g myrtilles"], steps: ["Dans un bocal, verse les flocons d'avoine.", "Ajoute les graines de chia et de lin.", "Incorpore le fromage blanc 0% et mélange.", "Dépose les myrtilles et réserve au frais."] },
  { id: 2, category: "pdej", title: "Omelette Épinards & Pain au Levain", prepTime: "8 min", proteins: "26g", protValue: 26, fibers: "6g", omega3: "Élevé", ingredients: ["3 unit œufs", "50g épinards frais", "2 tranches pain complet", "10ml huile d'olive"], steps: ["Bats les 3 œufs dans un bol.", "Fais tomber les épinards à la poêle avec l'huile.", "Verse les œufs et laisse cuire 3-4 min.", "Sers sur le pain grillé."] },
  { id: 3, category: "pdej", title: "Bowl Skyr, Protéine & Noix", prepTime: "3 min", proteins: "32g", protValue: 32, fibers: "5g", omega3: "Très Élevé", ingredients: ["250g skyr", "30g protéine vanille", "20g cerneaux de noix", "1/2 unit banane"], steps: ["Mélange le Skyr et la protéine.", "Ajoute les cerneaux de noix et les rondelles de banane."] },
  { id: 4, category: "pdej", title: "Pancakes Protéinés Avoine & Chia", prepTime: "10 min", proteins: "30g", protValue: 30, fibers: "8g", omega3: "Moyen", ingredients: ["60g flocons d'avoine", "2 unit œufs", "100g fromage blanc 0%", "10g graines de chia"], steps: ["Mélange l'avoine, les œufs, le fromage blanc et la chia.", "Fais cuire de petits pancakes dans une poêle 2 min par côté."] },
  { id: 16, category: "pdej", title: "Toast Avocat & Saumon Fumé", prepTime: "8 min", proteins: "27g", protValue: 27, fibers: "7g", omega3: "Excellence EPA/DHA", ingredients: ["2 tranches pain complet", "1/2 unit avocat", "1 unit œuf", "50g saumon fumé"], steps: ["Écrase l'avocat sur le pain grillé.", "Ajoute le saumon et l'œuf poché."] },
  { id: 17, category: "pdej", title: "Smoothie Bowl Framboise & Lin", prepTime: "5 min", proteins: "29g", protValue: 29, fibers: "10g", omega3: "Très Élevé", ingredients: ["200g fromage blanc 0%", "100g framboises", "30g protéine vanille", "15g graines de lin moulues"], steps: ["Mixe le fromage blanc, framboises et protéine.", "Parsème de graines de lin."] },

  { id: 5, category: "dejeuner", title: "Salade Thon & Haricots Blancs", prepTime: "5 min", proteins: "38g", protValue: 38, fibers: "11g", omega3: "Très Élevé", ingredients: ["120g thon au naturel", "150g haricots blancs", "100g tomates", "15ml huile de colza"], steps: ["Mélange le thon, les haricots rincés et les tomates.", "Assaisonne avec l'huile de colza."] },
  { id: 6, category: "dejeuner", title: "Bowl Saumon Fumé & Quinoa", prepTime: "10 min", proteins: "35g", protValue: 35, fibers: "9g", omega3: "Excellence EPA/DHA", ingredients: ["100g saumon fumé", "120g quinoa cuit", "1/2 unit avocat", "100g concombre"], steps: ["Assemble le quinoa, saumon, avocat et concombre."] },
  { id: 7, category: "dejeuner", title: "Wrap Poulet & Houmous", prepTime: "7 min", proteins: "36g", protValue: 36, fibers: "10g", omega3: "Modéré", ingredients: ["1 unit tortilla intégrale", "130g aiguillettes de poulet", "30g houmous", "50g carottes râpées"], steps: ["Poêle le poulet 5 min.", "Étale le houmous sur la tortilla, ajoute la garniture et roule."] },
  { id: 8, category: "dejeuner", title: "Pâtes au Maquereau & Courgettes", prepTime: "12 min", proteins: "34g", protValue: 34, fibers: "8g", omega3: "Très Élevé", ingredients: ["60g pâtes complètes", "120g maquereau au naturel", "1 unit courgette", "10ml huile d'olive"], steps: ["Fais cuire les pâtes.", "Fais sauter la courgette.", "Mélange le tout avec le maquereau."] },
  { id: 18, category: "dejeuner", title: "Salade Lentilles & Sardines", prepTime: "6 min", proteins: "35g", protValue: 35, fibers: "12g", omega3: "Excellence EPA/DHA", ingredients: ["200g lentilles cuites", "100g sardines", "15ml huile de colza"], steps: ["Réchauffe légèrement les lentilles.", "Mélange avec la vinaigrette et les sardines."] },
  { id: 19, category: "dejeuner", title: "Bowl Crevettes & Riz Noir", prepTime: "12 min", proteins: "33g", protValue: 33, fibers: "6g", omega3: "Élevé", ingredients: ["150g crevettes", "120g riz noir cuit", "1 unit poivron rouge"], steps: ["Fais sauter le poivron et les crevettes.", "Sers sur le riz noir."] },

  { id: 9, category: "diner", title: "Pavé de Saumon, Brocolis & Lentilles", prepTime: "20 min", proteins: "42g", protValue: 42, fibers: "14g", omega3: "Excellence EPA/DHA", ingredients: ["140g pavé de saumon", "150g brocolis", "100g lentilles cuites"], steps: ["Cuis le saumon au four à 180°C pendant 12 min.", "Cuis le brocolis à la vapeur."] },
  { id: 10, category: "diner", title: "Chili Express Dinde & Haricots Rouges", prepTime: "15 min", proteins: "40g", protValue: 40, fibers: "12g", omega3: "Moyen", ingredients: ["150g haché de dinde 5%", "150g haricots rouges", "200g purée de tomates"], steps: ["Dore la dinde.", "Ajoute les haricots et la purée de tomate, puis laisse mijoter 8 min."] },
  { id: 11, category: "diner", title: "Sauté de Bœuf aux Poivrons & Riz", prepTime: "15 min", proteins: "38g", protValue: 38, fibers: "7g", omega3: "Faible", ingredients: ["150g pavé de bœuf 5%", "1 unit poivron rouge", "100g riz complet cuit"], steps: ["Émince le bœuf et les légumes.", "Fais sauter au wok à feu vif."] },
  { id: 12, category: "diner", title: "Cabillaud Graines & Épinards", prepTime: "15 min", proteins: "36g", protValue: 36, fibers: "6g", omega3: "Très Élevé", ingredients: ["160g filet de cabillaud", "15g graines de chia", "250g épinards frais"], steps: ["Presse le cabillaud dans les graines et cuis au four 12 min.", "Fais tomber les épinards."] },
  { id: 20, category: "diner", title: "Curry de Poulet & Chou-Fleur", prepTime: "18 min", proteins: "35g", protValue: 35, fibers: "9g", omega3: "Moyen", ingredients: ["150g filet de poulet", "200g chou-fleur", "100ml lait de coco léger"], steps: ["Dore le poulet.", "Ajoute le chou-fleur, le curry et le lait de coco."] },
  { id: 21, category: "diner", title: "Omelette Fluffy aux Crevettes", prepTime: "10 min", proteins: "34g", protValue: 34, fibers: "4g", omega3: "Élevé", ingredients: ["3 unit œufs", "100g crevettes", "1/2 unit courgette"], steps: ["Fais sauter la courgette.", "Ajoute les crevettes puis les œufs battus."] },

  { id: 13, category: "snack", title: "Shaker Protéiné & Noix", prepTime: "2 min", proteins: "25g", protValue: 25, fibers: "3g", omega3: "Élevé", ingredients: ["30g protéine vanille", "20g cerneaux de noix"], steps: ["Mélange la protéine avec de l'eau.", "Consomme avec les noix."] },
  { id: 14, category: "snack", title: "Pomme & Beurre de Cacahuète", prepTime: "2 min", proteins: "8g", protValue: 8, fibers: "6g", omega3: "Faible", ingredients: ["1 unit pomme", "20g beurre de cacahuète"], steps: ["Tranche la pomme et tartine de beurre de cacahuète."] },
  { id: 15, category: "snack", title: "Fromage Blanc & Graines de Lin", prepTime: "2 min", proteins: "20g", protValue: 20, fibers: "4g", omega3: "Élevé", ingredients: ["200g fromage blanc 0%", "10g graines de lin moulues"], steps: ["Mélange le fromage blanc et les graines de lin."] },
  { id: 22, category: "snack", title: "Muffin Mug Protéiné Minute", prepTime: "3 min", proteins: "22g", protValue: 22, fibers: "5g", omega3: "Moyen", ingredients: ["1 unit œuf", "25g protéine vanille", "10g flocons d'avoine"], steps: ["Mélange dans une tasse.", "Cuis au micro-ondes pendant 50 secondes."] },
  { id: 23, category: "snack", title: "Tzatziki Protéiné & Concombre", prepTime: "4 min", proteins: "15g", protValue: 15, fibers: "3g", omega3: "Faible", ingredients: ["1/2 unit concombre", "150g skyr"], steps: ["Mélange le Skyr avec l'ail/citron.", "Trempe les rondelles de concombre."] }
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

// INITIALISATION DE L'APPLICATION
document.addEventListener('DOMContentLoaded', () => {
  renderWaterWidget();
  renderProteinWidget();
  initPomodoroTimer();
  renderTimeline();
  renderRecipes('all');
  renderGroceries();
  renderWorkout('A');
  setupNavigation();
  setupNotifications();
});

// GESTION DU NAVIGATION
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

      if (tabId === 'tab-groceries') renderGroceries();
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

// 1. WIDGET HYDRATATION
function renderWaterWidget() {
  const container = document.getElementById('water-glasses-container');
  const text = document.getElementById('water-count-text');
  
  text.textContent = `${(waterCount * 0.25).toFixed(1)} / 2.0 L`;

  let html = '';
  for (let i = 1; i <= 8; i++) {
    const isActive = i <= waterCount ? 'active' : '';
    html += `<div class="water-glass ${isActive}" onclick="toggleWaterGlass(${i})">🥛</div>`;
  }
  container.innerHTML = html;
}

function toggleWaterGlass(index) {
  if (waterCount === index) waterCount = index - 1;
  else waterCount = index;
  
  localStorage.setItem('devfit_water_count', waterCount);
  renderWaterWidget();
}

// 2. WIDGET PROTEINES
function renderProteinWidget() {
  const text = document.getElementById('protein-count-text');
  const bar = document.getElementById('protein-progress-bar');
  const target = 140;

  text.textContent = `${consumedProteins} / ${target}g`;
  const pct = Math.min(100, Math.round((consumedProteins / target) * 100));
  bar.style.width = `${pct}%`;
}

function addProteins(amount) {
  consumedProteins += amount;
  localStorage.setItem('devfit_consumed_proteins', consumedProteins);
  renderProteinWidget();
}

// 3. TIMER POMODORO ACTIVE BREAK
let timerInterval = null;
let timerSeconds = 50 * 60;
let isWorkPeriod = true;
let isTimerRunning = false;

function initPomodoroTimer() {
  const btnToggle = document.getElementById('btn-timer-toggle');
  const btnReset = document.getElementById('btn-timer-reset');

  btnToggle.addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      btnToggle.textContent = 'Reprendre';
    } else {
      isTimerRunning = true;
      btnToggle.textContent = 'Pause';
      timerInterval = setInterval(updateTimer, 1000);
    }
  });

  btnReset.addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    isWorkPeriod = true;
    timerSeconds = 50 * 60;
    btnToggle.textContent = 'Démarrer';
    updateTimerDisplay();
  });
}

function updateTimer() {
  if (timerSeconds > 0) {
    timerSeconds--;
    updateTimerDisplay();
  } else {
    // Changement de phase
    clearInterval(timerInterval);
    isTimerRunning = false;
    playNotificationSound();

    if (isWorkPeriod) {
      alert("🚨 C'est l'heure de la PAUSE ACTIVE (5 min) ! Lève-toi, fais 10 squats et étire tes hanches !");
      isWorkPeriod = false;
      timerSeconds = 5 * 60;
    } else {
      alert("💻 Fin de la pause ! Retour au code.");
      isWorkPeriod = true;
      timerSeconds = 50 * 60;
    }
    document.getElementById('btn-timer-toggle').textContent = 'Démarrer';
    updateTimerDisplay();
  }
}

function updateTimerDisplay() {
  const mins = Math.floor(timerSeconds / 60);
  const secs = timerSeconds % 60;
  document.getElementById('timer-display').textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  
  const statusEl = document.getElementById('pomodoro-status');
  if (isWorkPeriod) {
    statusEl.textContent = 'Session Dev (50m)';
    statusEl.className = 'status-badge status-work';
  } else {
    statusEl.textContent = 'Pause Active (5m)';
    statusEl.className = 'status-badge status-break';
  }
}

function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime);
    osc.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.5);
  } catch(e) {}
}

// 4. TIMELINE
function renderTimeline() {
  const container = document.getElementById('daily-timeline');
  container.innerHTML = scheduleData.map(item => `
    <div class="timeline-item">
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-content">
        <div class="timeline-desc">${item.desc}</div>
        ${item.prot > 0 ? `<div class="timeline-action" onclick="addProteins(${item.prot})">+ Valider Repas (+${item.prot}g prot)</div>` : ''}
      </div>
    </div>
  `).join('');
}

// 5. RENDU DES RECETTES
function renderRecipes(filter) {
  const container = document.getElementById('recipes-list');
  const filtered = filter === 'all' ? recipesData : recipesData.filter(r => r.category === filter);

  container.innerHTML = filtered.map(recipe => {
    const count = selectedRecipesMap[recipe.id] || 0;
    return `
      <div class="recipe-card">
        <div class="recipe-counter">
          <button class="counter-btn" onclick="updateRecipeCount(${recipe.id}, 1)">+</button>
          <span class="counter-value">${count}</span>
          <button class="counter-btn" onclick="updateRecipeCount(${recipe.id}, -1)">-</button>
        </div>
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

function updateRecipeCount(id, delta) {
  const current = selectedRecipesMap[id] || 0;
  const updated = Math.max(0, current + delta);
  
  if (updated === 0) delete selectedRecipesMap[id];
  else selectedRecipesMap[id] = updated;

  localStorage.setItem('devfit_selected_recipes_map', JSON.stringify(selectedRecipesMap));
  renderRecipes(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
}

// 6. LISTE DE COURSES AVEC CALCUL DES QUANTITÉS
function renderGroceries() {
  const container = document.getElementById('groceries-container');
  const activeIds = Object.keys(selectedRecipesMap);

  if (activeIds.length === 0) {
    container.innerHTML = `
      <div class="grocery-empty">
        <p>🛒 Aucune recette sélectionnée.</p>
        <p style="font-size: 0.8rem; margin-top: 0.5rem;">Utilise les boutons <strong>+</strong> dans l'onglet <strong>Recettes</strong> pour ajouter des portions et calculer tes courses.</p>
      </div>
    `;
    return;
  }

  // Aggrégation des ingrédients
  const aggregated = {};

  activeIds.forEach(idStr => {
    const id = parseInt(idStr);
    const count = selectedRecipesMap[id];
    const recipe = recipesData.find(r => r.id === id);

    if (recipe) {
      recipe.ingredients.forEach(rawIng => {
        // Format typique: "50g flocons d'avoine" ou "3 unit œufs"
        const match = rawIng.match(/^(\d+(?:\.\d+)?)\s*([a-zA-Z%]+)?\s+(.*)$/);
        
        if (match) {
          const qty = parseFloat(match[1]) * count;
          const unit = match[2] || '';
          const name = match[3].toLowerCase().trim();
          const key = `${name}_${unit}`;

          if (aggregated[key]) aggregated[key].qty += qty;
          else aggregated[key] = { name: match[3], qty, unit };
        } else {
          // Si pas de quantité numérique directe
          const key = rawIng.toLowerCase().trim();
          if (aggregated[key]) aggregated[key].qty += count;
          else aggregated[key] = { name: rawIng, qty: count, unit: 'x' };
        }
      });
    }
  });

  const groceryListHtml = Object.values(aggregated).map(item => {
    const formattedText = item.unit === 'x' ? `${item.name} (${item.qty}x)` : `${item.qty}${item.unit} ${item.name}`;
    const isChecked = checkedGroceryItems.includes(formattedText) ? 'checked' : '';

    return `
      <label class="grocery-item ${isChecked ? 'checked' : ''}">
        <input type="checkbox" ${isChecked} onchange="toggleGroceryCheck('${formattedText.replace(/'/g, "\\'")}', this)">
        <span>${formattedText}</span>
      </label>
    `;
  }).join('');

  container.innerHTML = `
    <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 1rem;">
      Ingrédients regroupés et ajustés selon tes portions :
    </p>
    <div class="grocery-list">
      ${groceryListHtml}
    </div>
  `;
}

function toggleGroceryCheck(ingredientText, checkbox) {
  const parent = checkbox.closest('.grocery-item');
  if (checkbox.checked) {
    parent.classList.add('checked');
    if (!checkedGroceryItems.includes(ingredientText)) checkedGroceryItems.push(ingredientText);
  } else {
    parent.classList.remove('checked');
    checkedGroceryItems = checkedGroceryItems.filter(item => item !== ingredientText);
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
    
    <h3 style="margin-top: 1rem; border-bottom: 1px solid var(--border-color); padding-bottom: 0.3rem;">Ingrédients (1 portion)</h3>
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
      if (permission === "granted") alert("Notifications activées !");
    });
  });
}
