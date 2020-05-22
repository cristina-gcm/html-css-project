const getFormData = function(form) {
  let data = {};
  for (let i = 0, ii = form.length; i < ii; ++i) {
    let input = form[i];
    if (input.name) {
      data[input.name] = input.value;
    }
  }
  return JSON.stringify(data)
}

const showSuccess = function(message) {
  Swal.fire({
    icon: 'success',
    title: message,
  })
}

const showError = function(message) {
  Swal.fire({
    icon: 'error',
    title: message,
  })
}

const login = function(event) {
  event.preventDefault();
  let form = document.getElementById('login-form');
  let data = getFormData(form);
  let request = new XMLHttpRequest();
  request.onload = function () {
    
    if (this.status >= 200 && this.status < 400) {
      let data = JSON.parse(this.response);
      localStorage.setItem('user_id', data.user.id)
      localStorage.setItem('authorization', data.user.token)
      localStorage.setItem('name', data.user.name)
      showSuccess(data.success);
      form.reset();
      setTimeout(function () {
        window.location.href = 'index.html';
      }, 2000);
    } else {
      let data = JSON.parse(this.response);
      showError(data.error);
    }
  };
  request.open('POST', 'https://et-portfolio-api.herokuapp.com/users/login/');
  request.setRequestHeader('Accept', 'application/json; charset=utf-8');
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.send(data);
}

const logout = function() {
  localStorage.clear();
  window.location.reload();
}

const register = function (event) {
  event.preventDefault();
  let form = document.getElementById('register-form');
  let data = getFormData(form);
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      let data = JSON.parse(this.response);
      showSuccess(data.success);
      form.reset();
      setTimeout(function () {
        window.location.href = 'login.html';
      }, 2000);
    } else {
      let data = JSON.parse(this.response);
      showError(data.error);
    }
  };
  request.open('POST', 'https://et-portfolio-api.herokuapp.com/users/register');
  request.setRequestHeader('Accept', 'application/json; charset=utf-8');
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.send(data);
}

const checkUser = function() {
  let currentName = localStorage.getItem('name');
  if (currentName != undefined) {
    let loginLink = document.getElementById('login-link');
    loginLink.innerHTML = 'Logout ' + currentName
    loginLink.setAttribute('href', '#')
    loginLink.addEventListener('click', logout);
    let commentForm = document.getElementById('comments-form');
    if (commentForm != undefined) {
      commentForm.style.display = '';
    }
    let noUser = document.getElementById('nouser');
    if (noUser != undefined) {
      noUser.style.display = 'none';
    }
    let commentsFilter = document.querySelector('.comments-filter');
    if (commentsFilter != undefined) {
      commentsFilter.style.display = '';
    }
  }
}

const setMenuToggler = function() {
  document.querySelector(".menu-btn").addEventListener("click", function (e) {
    document.querySelector('ul.menu').classList.toggle('show');
    e.preventDefault();
  });
}

const setFontToggler = function () {
  document.getElementById("font-size").addEventListener("change", function (e) {
    let body = document.body;
    if (this.value == 'large') {
      body.classList.add('large-font');
    } else {
      body.classList.remove('large-font');
    }
  });
}

            