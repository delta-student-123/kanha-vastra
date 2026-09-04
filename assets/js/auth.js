/* Auth Handler */

window.handleLogin = function(e) {
  e.preventDefault();
  const email = document.getElementById('login-email').value;
  const pass = document.getElementById('login-password').value;

  if (email && pass) {
    const user = {
      name: email.split('@')[0].toUpperCase(),
      email: email,
      role: 'customer'
    };

    localStorage.setItem('kcs_user', JSON.stringify(user));
    window.KCS.user = user;
    window.showToast(`Welcome back, ${user.name}!`);
    setTimeout(() => {
      window.location.href = '/pages/account/profile.html';
    }, 800);
  }
};

window.handleRegister = function(e) {
  e.preventDefault();
  const name = document.getElementById('reg-name').value;
  const email = document.getElementById('reg-email').value;
  const phone = document.getElementById('reg-phone').value;

  if (name && email) {
    const user = { name, email, phone, role: 'customer' };
    localStorage.setItem('kcs_user', JSON.stringify(user));
    window.KCS.user = user;
    window.showToast('Account created successfully! Jai Shree Krishna!');
    setTimeout(() => {
      window.location.href = '/pages/account/profile.html';
    }, 800);
  }
};

window.handleLogout = function() {
  localStorage.removeItem('kcs_user');
  window.KCS.user = null;
  window.showToast('Logged out successfully', 'info');
  setTimeout(() => {
    window.location.href = '/index.html';
  }, 500);
};
