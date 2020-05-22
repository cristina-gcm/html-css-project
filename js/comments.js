let commentsTemplate = `
  <ul class="comments-list">
    <% comments.forEach(function(comment){ %>
      <li>
        <p><%= comment.text %></p>
        <span class="author"><%= comment.name %></span>
        <% if (comment.user_id == userId) { %>
          <a href="#" title="Delete Comment" class="delete-link" onclick="deleteConfirmation(event, <%= comment.id %>)"><i class="fas fa-times-circle"></i></a>
        <% } %>
      </li>
    <% }); %>
  </ul>
`;

const renderComments = function(comments) {
  userId = localStorage.getItem('user_id');
  commentsHtml = ejs.render(commentsTemplate, { comments: comments, userId: userId });
  document.querySelector('div.comments').innerHTML = commentsHtml;
}

const getComments = function(page) {
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      let data = JSON.parse(this.response);
      window.comments = data.comments;
      renderComments(comments);
    } else {
      let data = JSON.parse(this.response);
      console.log(data);
    }
  };
  request.open('GET', 'https://et-portfolio-api.herokuapp.com/comments/' + page);
  request.setRequestHeader('Accept', 'application/json; charset=utf-8');
  request.send();
}

const addComment = function(page) {
  const token = localStorage.getItem('authorization')
  let form = document.getElementById('comments-form');
  let data = getFormData(form);
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      let data = JSON.parse(this.response);
      showSuccess(data.success);
      window.comments.push(data.comment)
      renderComments(window.comments)
      form.reset();
    } else {
      let data = JSON.parse(this.response);
      showError(data.error);
    }
  };
  request.open('POST', 'https://et-portfolio-api.herokuapp.com/comments/' + page);
  request.setRequestHeader('Accept', 'application/json; charset=utf-8');
  request.setRequestHeader('Authorization', token);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.send(data);
}

const deleteConfirmation = function(event, id) {
  event.preventDefault();
  Swal.fire({
    title: 'Are you sure?',
    text: "This comment will be deleted!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then((result) => {
    if (result.value) {
      deleteComment(id);
    }
  })
}

const deleteComment = function(id) {
  const token = localStorage.getItem('authorization')
  let request = new XMLHttpRequest();
  request.onload = function () {
    if (this.status >= 200 && this.status < 400) {
      let data = JSON.parse(this.response);
      showSuccess(data.success);
      window.comments.splice(window.comments.findIndex(function(comment) { return comment.id == id}), 1);
      renderComments(window.comments);
    } else {
      let data = JSON.parse(this.response);
      showError(data.error);
    }
  };
  request.open('DELETE', 'https://et-portfolio-api.herokuapp.com/comments/' + id);
  request.setRequestHeader('Accept', 'application/json; charset=utf-8');
  request.setRequestHeader('Authorization', token);
  request.setRequestHeader("Content-Type", "application/json; charset=UTF-8");
  request.send();
}

const filterComments = function(event) {
  const user_id = localStorage.getItem('user_id')
  if (this.value == 'all') {
    renderComments(window.comments)
  } else {
    renderComments(window.comments.filter(function (comment) { return comment.user_id == user_id }));
  }  
}

const initComments = function(page) {
  window.comments = []
  getComments(page);
  document.getElementById('comments-form').addEventListener('submit', function(event) {
    event.preventDefault();
    addComment(page);
  });
  document.getElementById('comments-filter').addEventListener('change', filterComments);
}
            