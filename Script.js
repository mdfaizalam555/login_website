// =======================
// Admin Credentials (Hardcoded)
// =======================
const adminCredentials = {
    username: 'admin',
    password: 'admin123'
};

// =======================
// Page Elements
// =======================
const homePage = document.getElementById('homePage');
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');

const adminDashboard = document.getElementById('adminDashboard');
const studentsTableBody = document.querySelector('#studentsTable tbody');
const logoutBtnAdmin = document.getElementById('logoutBtn');

const userDashboard = document.getElementById('userDashboard');
const userDetails = document.getElementById('userDetails');
const logoutBtnUser = document.getElementById('logoutBtnUser');

// =======================
// Initialization
// =======================
document.addEventListener('DOMContentLoaded', () => {
    const session = localStorage.getItem('session');
    if (session) {
        const parsedSession = JSON.parse(session);
        if (parsedSession === 'admin') {
            showAdminDashboard();
        } else {
            showUserDashboard(parsedSession);
        }
    } else {
        showHomePage();
    }
});

// =======================
// Show/Hide Pages
// =======================
function showHomePage() {
    homePage.classList.remove('hidden');
    adminDashboard.classList.add('hidden');
    userDashboard.classList.add('hidden');
}

function showAdminDashboard() {
    homePage.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
    userDashboard.classList.add('hidden');
    loadAdminData();
}

function showUserDashboard(user) {
    homePage.classList.add('hidden');
    adminDashboard.classList.add('hidden');
    userDashboard.classList.remove('hidden');
    displayUserData(user);
}

// =======================
// Registration Handler
// =======================
registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const classVal = document.getElementById('regClass').value.trim();
    const sectionVal = document.getElementById('regSection').value.trim();
    const rollVal = document.getElementById('regRoll').value.trim();
    const passwordVal = document.getElementById('regPassword').value.trim();

    if (!classVal || !sectionVal || !rollVal || !passwordVal) {
        alert('Please fill in all registration fields.');
        return;
    }

    // Retrieve existing users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Check if Roll Number already exists
    const userExists = users.some(user => user.rollNumber === rollVal);
    if (userExists) {
        alert('Roll Number already registered. Please use a different Roll Number.');
        return;
    }

    // Add new user
    const newUser = {
        class: classVal,
        section: sectionVal,
        rollNumber: rollVal,
        password: passwordVal
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    alert('Registration successful! You can now log in.');
    registerForm.reset();
});

// =======================
// Login Handler
// =======================
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const rollNumber = document.getElementById('loginRoll').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (!rollNumber || !password) {
        alert('Please enter both Roll Number and Password.');
        return;
    }

    // Check if admin is trying to log in
    if (rollNumber === adminCredentials.username && password === adminCredentials.password) {
        localStorage.setItem('session', JSON.stringify('admin'));
        showAdminDashboard();
        loginForm.reset();
        return;
    }

    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Find matching user
    const matchedUser = users.find(user => user.rollNumber === rollNumber && user.password === password);

    if (matchedUser) {
        localStorage.setItem('session', JSON.stringify(matchedUser));
        showUserDashboard(matchedUser);
        loginForm.reset();
    } else {
        alert('Invalid Roll Number or Password.');
    }
});

// =======================
// Admin Functions
// =======================
function loadAdminData() {
    // Clear existing table data
    studentsTableBody.innerHTML = '';

    // Retrieve users from localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.length === 0) {
        const row = studentsTableBody.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 4;
        cell.textContent = 'No registered students.';
        return;
    }

    // Populate table with users
    users.forEach(user => {
        const row = studentsTableBody.insertRow();

        const cellClass = row.insertCell(0);
        const cellSection = row.insertCell(1);
        const cellRoll = row.insertCell(2);
        const cellPassword = row.insertCell(3);

        cellClass.textContent = user.class;
        cellSection.textContent = user.section;
        cellRoll.textContent = user.rollNumber;
        cellPassword.textContent = user.password; // Note: Insecure to display passwords
    });
}

// Logout from Admin Dashboard
logoutBtnAdmin.addEventListener('click', () => {
    localStorage.removeItem('session');
    showHomePage();
});

// =======================
// User Functions
// =======================
function displayUserData(user) {
    userDetails.innerHTML = `
        <strong>Class:</strong> ${user.class} <br>
        <strong>Section:</strong> ${user.section} <br>
        <strong>Roll Number:</strong> ${user.rollNumber}
    `;
}

// Logout from User Dashboard
logoutBtnUser.addEventListener('click', () => {
    localStorage.removeItem('session');
    showHomePage();
});
