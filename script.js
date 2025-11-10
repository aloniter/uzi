let currentUser = 'אלון';
let activities = [];
let questions = [];
let database = null;
let currentEditId = null;
let schedule = [];
let isEditingSchedule = false;
let currentFilter = 'הכל';

const defaultSchedule = [
    { time: "06:00", activity: "🌅 השכמה + פיפי ראשון" }, { time: "06:30", activity: "🍖 ארוחת בוקר" },
    { time: "08:00", activity: "🚶 טיול קצר + צרכים" }, { time: "09:00", activity: "🎾 זמן משחק ופעילות" },
    { time: "10:00", activity: "😴 תנומה" }, { time: "12:00", activity: "🍖 ארוחת צהריים" },
    { time: "13:00", activity: "🚶 טיול + צרכים" }, { time: "14:00", activity: "🎯 זמן אימון (5-10 דקות)" },
    { time: "15:00", activity: "😴 מנוחת אחה\"צ" }, { time: "17:00", activity: "🎾 משחק ופעילות" },
    { time: "18:00", activity: "🍖 ארוחת ערב" }, { time: "19:00", activity: "🚶 טיול ערב + צרכים" },
    { time: "21:00", activity: "😴 הכנה לשינת לילה" }, { time: "23:00", activity: "💧 פיפי אחרון לפני השינה" }
];

const activityTypes = [
    { type: 'אוכל', emoji: '🍖' }, { type: 'שינה', emoji: '😴' }, { type: 'משחק', emoji: '🎾' }, 
    { type: 'אימון', emoji: '🎯' }, { type: 'פיפי', emoji: '💧' }, { type: 'קקי', emoji: '💩' }, 
    { type: 'טיול', emoji: '🚶' }, { type: 'וטרינר', emoji: '🏥' }
];

const firebaseConfig = {
    apiKey: "AIzaSyDj_SEXQ6irE7RL0_9RNkktzWSzPh8eVys",
    authDomain: "puppy-tracker-82cb0.firebaseapp.com",
    databaseURL: "https://puppy-tracker-82cb0-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "puppy-tracker-82cb0",
    storageBucket: "puppy-tracker-82cb0.firebasestorage.app",
    messagingSenderId: "565635528841",
    appId: "1:565635528841:web:e2bd7f4f10910d1ae1ae58"
};

document.addEventListener('DOMContentLoaded', () => {
    try {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        setupFirebaseListeners();
    } catch (e) { console.error("Firebase initialization failed:", e); }
    setupEventListeners();
    loadInitialData();
    renderFilterButtons();
});

function setupEventListeners() {
    document.querySelectorAll('.tab').forEach(tab => tab.addEventListener('click', () => switchToTab(tab.dataset.tab)));
    document.querySelectorAll('.user-btn').forEach(btn => btn.addEventListener('click', () => switchUser(btn.dataset.user)));
    document.querySelectorAll('.action-btn').forEach(btn => btn.addEventListener('click', () => recordActivity(btn.dataset.type, btn.dataset.emoji)));
    document.getElementById('modalCancelBtn').addEventListener('click', closeEditModal);
    document.getElementById('modalSaveBtn').addEventListener('click', saveActivityChanges);
    document.getElementById('editScheduleBtn').addEventListener('click', toggleScheduleEdit);
    document.getElementById('addScheduleItemBtn').addEventListener('click', addScheduleItem);
    document.getElementById('saveScheduleBtn').addEventListener('click', saveSchedule);
    document.getElementById('resetScheduleBtn').addEventListener('click', resetSchedule);
    document.getElementById('historyFilters').addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            handleFilterClick(e.target.dataset.type);
        }
    });
    document.getElementById('addQuestionBtn').addEventListener('click', addQuestion);
}

function loadInitialData() {
    if (database) {
        listenToActivities();
        loadSchedule();
        listenToQuestions();
    }
    calculatePuppyAge();
    setInterval(calculatePuppyAge, 3600000); // Check age every hour
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) switchUser(savedUser);
}

function setupFirebaseListeners() {
    database.ref('.info/connected').on('value', snapshot => {
        document.getElementById('connectionStatus').classList.toggle('offline', !snapshot.val());
    });
}

function listenToActivities() {
    database.ref('activities').on('value', snapshot => {
        const data = snapshot.val() || {};
        activities = Object.keys(data).map(key => ({ ...data[key], id: key })).sort((a, b) => b.timestamp - a.timestamp);
        if (document.getElementById('history').classList.contains('active')) {
            displayHistory();
        }
    });
}

function switchToTab(tabName) {
    document.querySelectorAll('.tab-content, .tab').forEach(el => el.classList.remove('active'));
    document.getElementById(tabName).classList.add('active');
    document.querySelector(`.tab[data-tab="${tabName}"]`).classList.add('active');
    if (tabName === 'history') displayHistory();
    if (tabName === 'schedule') loadSchedule();
    if (tabName === 'questions') displayQuestions();
}

function switchUser(user) {
    currentUser = user;
    document.getElementById('currentUserDisplay').textContent = 'משתמש: ' + user;
    localStorage.setItem('currentUser', user);
    document.querySelectorAll('.user-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.user === user));
}

async function recordActivity(type, emoji) {
    if (!database) return alert('לא מחובר ל-Firebase.');
    const activity = {
        type, emoji, user: currentUser,
        note: document.getElementById('noteInput').value,
        time: new Date().toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }),
        date: new Date().toLocaleDateString('he-IL'),
        timestamp: Date.now()
    };
    try {
        await database.ref('activities').push(activity);
        document.getElementById('noteInput').value = '';
        showNotification(`${emoji} ${type} נרשם בהצלחה!`);
        switchToTab('history');
    } catch (error) {
        console.error("Failed to record activity:", error);
        alert(`שגיאה ברישום הפעילות: ${error.message}`);
    }
}

function renderFilterButtons() {
    const container = document.getElementById('historyFilters');
    let buttonsHTML = `<button class="filter-btn active" data-type="הכל"> הכל </button>`;
    activityTypes.forEach(activity => {
        buttonsHTML += `<button class="filter-btn" data-type="${activity.type}">${activity.emoji} ${activity.type}</button>`;
    });
    container.innerHTML = buttonsHTML;
}

function handleFilterClick(filterType) {
    currentFilter = filterType;
    document.querySelectorAll('#historyFilters .filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.type === currentFilter);
    });
    displayHistory();
}

function displayHistory() {
    const filteredActivities = (currentFilter === 'הכל') 
        ? activities 
        : activities.filter(act => act.type === currentFilter);

    const grouped = filteredActivities.reduce((acc, act) => {
        (acc[act.date] = acc[act.date] || []).push(act);
        return acc;
    }, {});

    // ✅ ממיינים לפי הפעולה הכי חדשה בכל יום
    const sortedDates = Object.keys(grouped).sort((a, b) => {
        const maxA = Math.max(...grouped[a].map(act => act.timestamp));
        const maxB = Math.max(...grouped[b].map(act => act.timestamp));
        return maxB - maxA; // יום עם הפעילות הכי חדשה ראשון
    });

    const historyList = document.getElementById('historyList');
    if (filteredActivities.length === 0) {
         historyList.innerHTML = `<div style="text-align: center; color: #999; padding: 20px;">אין פעילויות להצגה עבור "${currentFilter}"</div>`;
         return;
    }

    historyList.innerHTML = sortedDates.map(date => `
        <div class="day-section">
            <div class="day-header">${date === new Date().toLocaleDateString('he-IL') ? 'היום' : date}</div>
            ${grouped[date]
                .sort((a, b) => b.timestamp - a.timestamp) // ✅ פעילויות מהחדש לישן
                .map(act => `
                <div class="history-item">
                    <div style="flex-grow: 1; text-align: right;">
                        <span>${act.emoji} ${act.type}</span>
                        ${act.note ? `<span style="color: #666; font-size: 12px; display: block;">(${act.note})</span>` : ''}
                    </div>
                    <div style="display: flex; align-items: center; gap: 5px; flex-shrink: 0;">
                        <span class="time">${act.time}</span>
                        <span class="user">${act.user}</span>
                        <button class="edit-btn" onclick="openEditModal('${act.id}')">ערוך</button>
                        <button class="delete-btn" onclick="deleteActivity('${act.id}')">מחק</button>
                    </div>
                </div>`).join('')}
        </div>`).join('');
}

async function deleteActivity(id) {
    if (confirm('האם למחוק את הפעילות?')) {
        try { await database.ref(`activities/${id}`).remove(); } catch (e) { alert(`שגיאת מחיקה: ${e.message}`); }
    }
}

function openEditModal(id) {
    const activity = activities.find(act => act.id === id);
    if (!activity) return;
    currentEditId = id;
    document.getElementById('editTime').value = activity.time;
    document.getElementById('editNote').value = activity.note || '';
    document.getElementById('editModal').style.display = 'block';
}

function closeEditModal() {
    document.getElementById('editModal').style.display = 'none';
}

async function saveActivityChanges() {
    if (!currentEditId) return;
    const updates = {
        time: document.getElementById('editTime').value,
        note: document.getElementById('editNote').value
    };
    try {
        await database.ref(`activities/${currentEditId}`).update(updates);
        closeEditModal();
    } catch (e) { alert(`שגיאת עדכון: ${e.message}`); }
}

// --- UPDATED Puppy Age Calculation ---
function calculatePuppyAge() {
    const birthDate = new Date(2025, 5, 22); // Month is 0-indexed, so 5 is June
    const today = new Date();

    if (today < birthDate) {
        const diffDays = Math.ceil((birthDate - today) / (1000 * 60 * 60 * 24));
        document.getElementById('puppyAge').textContent = `עוד ${diffDays} ${diffDays === 1 ? 'יום' : 'ימים'}`;
        return;
    }

    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();

    if (days < 0) {
        months--;
        const lastDayOfPrevMonth = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += lastDayOfPrevMonth;
    }

    if (months < 0) {
        years--;
        months += 12;
    }

    months += years * 12;

    let ageParts = [];
    if (months > 0) {
        ageParts.push(`${months} ${months === 1 ? 'חודש' : 'חודשים'}`);
    }
    if (days > 0) {
        ageParts.push(`${days} ${days === 1 ? 'יום' : 'ימים'}`);
    }
    
    let ageText;
    if (ageParts.length === 0) {
        ageText = 'היום נולד!';
    } else {
        ageText = `בן ${ageParts.join(' ו')}`;
    }

    document.getElementById('puppyAge').textContent = ageText;
}


// --- Schedule Functions ---
function loadSchedule() {
    if (!database) return;
    database.ref('schedule').once('value', snapshot => {
        const data = snapshot.val();
        schedule = data ? data : JSON.parse(JSON.stringify(defaultSchedule));
        displaySchedule();
    });
}
function displaySchedule() {
    const container = document.getElementById('scheduleItems');
    schedule.sort((a, b) => a.time.localeCompare(b.time));
    container.innerHTML = schedule.map((item, index) => {
        if (isEditingSchedule) {
            return `
            <div class="schedule-item edit-mode">
                <input type="time" value="${item.time}" onchange="updateScheduleItem(${index}, 'time', this.value)">
                <input type="text" value="${item.activity}" onchange="updateScheduleItem(${index}, 'activity', this.value)" placeholder="תיאור הפעילות...">
                <button class="delete-schedule-btn" onclick="removeScheduleItem(${index})">🗑️</button>
            </div>`;
        }
        return `
            <div class="schedule-item">
                <div class="time">${item.time}</div>
                <div class="activity">${item.activity}</div>
            </div>`;
    }).join('');
}
function toggleScheduleEdit() {
    isEditingSchedule = !isEditingSchedule;
    document.getElementById('editScheduleBtn').textContent = isEditingSchedule ? '❌ בטל עריכה' : '✏️ ערוך לו"ז';
    document.getElementById('scheduleEditSection').style.display = isEditingSchedule ? 'block' : 'none';
    displaySchedule();
}
function updateScheduleItem(index, key, value) { schedule[index][key] = value; }
function removeScheduleItem(index) {
    if (confirm('למחוק את הפעילות מהלו"ז?')) {
        schedule.splice(index, 1);
        displaySchedule();
    }
}
function addScheduleItem() {
    schedule.push({ time: "12:00", activity: "פעילות חדשה" });
    displaySchedule();
}
async function saveSchedule() {
    if (!database) return;
    try {
        await database.ref('schedule').set(schedule);
        showNotification('הלו"ז נשמר בהצלחה!');
        toggleScheduleEdit();
    } catch (e) { alert(`שגיאה בשמירת הלו"ז: ${e.message}`); }
}
function resetSchedule() {
    if (confirm('לאפס את הלו"ז לברירת המחדל?')) {
        schedule = JSON.parse(JSON.stringify(defaultSchedule));
        displaySchedule();
    }
}

// --- Questions Functions ---
function listenToQuestions() {
    database.ref('questions').on('value', snapshot => {
        const data = snapshot.val() || {};
        questions = Object.keys(data).map(key => ({ ...data[key], id: key })).sort((a, b) => b.timestamp - a.timestamp);
        if (document.getElementById('questions').classList.contains('active')) {
            displayQuestions();
        }
    });
}
async function addQuestion() {
    const questionInput = document.getElementById('questionInput');
    const questionText = questionInput.value.trim();
    if (!questionText) {
        alert("יש לכתוב שאלה.");
        return;
    }
    if (!database) return alert('לא מחובר ל-Firebase.');
    const question = {
        text: questionText,
        user: currentUser,
        date: new Date().toLocaleDateString('he-IL'),
        timestamp: Date.now()
    };
    try {
        await database.ref('questions').push(question);
        questionInput.value = '';
        showNotification(`שאלה נוספה בהצלחה!`);
    } catch (error) {
        console.error("Failed to add question:", error);
        alert(`שגיאה בהוספת השאלה: ${error.message}`);
    }
}
function displayQuestions() {
    const container = document.getElementById('questionsList');
    if (questions.length === 0) {
        container.innerHTML = '<div style="text-align: center; color: #999; padding: 20px;">אין עדיין שאלות</div>';
        return;
    }
    container.innerHTML = questions.map(q => `
        <div class="question-item">
            <div class="text">${q.text}</div>
            <div class="meta">
                <div>${q.date}</div>
                <div>${q.user}</div>
                <button class="delete-btn" onclick="deleteQuestion('${q.id}')" style="margin-top: 5px;">מחק</button>
            </div>
        </div>
    `).join('');
}
async function deleteQuestion(id) {
    if (confirm('האם למחוק את השאלה?')) {
        try {
            await database.ref(`questions/${id}`).remove();
        } catch (e) {
            alert(`שגיאת מחיקה: ${e.message}`);
        }
    }
}

function showNotification(message) {
    const el = document.createElement('div');
    el.style.cssText = `position: fixed; top: 20px; left: 50%; transform: translateX(-50%); background: #4CAF50; color: white; padding: 12px 24px; border-radius: 10px; z-index: 1001;`;
    el.textContent = message;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3000);
}
