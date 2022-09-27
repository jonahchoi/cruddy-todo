$(() => {

  // View ////////////////////////////////////////////////////////////////////////

  var template = _.template(`
    <li data-id="<%=id%>" class="todo">
      <span><%=text%></span>
      <button data-action="edit">edit</button>
      <button data-action="done">&#x2714;</button>
      <button data-action="up">^</button>
      <button data-action="down">v</button>
    </li>
  `);

  var renderTodo = (todo) => {
    return template(todo);
  };

  var addTodo = (todo) => {
    $('#todos').append(renderTodo(todo));
  };

  var changeTodo = (id, todo) => {
    $(`#todos [data-id=${id}]`).replaceWith(renderTodo(todo));
  };

  var removeTodo = (id) => {
    $(`#todos [data-id=${id}]`).remove();
  };

  var addAllTodos = (todos) => {
    _.each(todos, (todo) => {
      addTodo(todo);
    });
  };

  // Controller //////////////////////////////////////////////////////////////////

  $('#form button').click( (event) => {
    var text = $('#form input').val().trim();
    if (text) {
      Todo.create(text, addTodo);
    }
    $('#form input').val('');
  });

  $('#todos').delegate('button', 'click', (event) => {
    var id = $(event.target.parentNode).data('id');
    if ($(event.target).data('action') === 'edit') {
      Todo.readOne(id, (todo) => {
        var updatedText = prompt('Change to?', todo.text);
        if (updatedText !== null && updatedText !== todo.text) {
          Todo.update(id, updatedText, changeTodo.bind(null, id));
        }
      });
    } else if ($(event.target).data('action') === 'up') {
      Todo.switch(id, true, () => {
        // console.log('id', id);
        Todo.readOne(id, (todo) => {
          // console.log('hi im todo', todo);
          var updatedText1 = todo.text;//get the new text
          Todo.update(id, updatedText1, changeTodo.bind(null, id));
        });
        let nextFileId = String(Number(id) - 1).padStart(5, '0');
        console.log('-->', nextFileId)
        Todo.readOne(nextFileId, (todo) => {
          console.log('hi im todo', todo);
          var updatedText2 = todo.text;//get the new text
          Todo.update(nextFileId, updatedText2, changeTodo.bind(null, nextFileId));
        });
      });
    } else if ($(event.target).data('action') === 'down') {
      Todo.switch(id, false, () => {
        Todo.readOne(id, (todo) => {
          // console.log('hi im todo', todo);
          var updatedText1 = todo.text;//get the new text
          Todo.update(id, updatedText1, changeTodo.bind(null, id));
        });
        let nextFileId = String(Number(id) + 1).padStart(5, '0');
        console.log('-->', nextFileId)
        Todo.readOne(nextFileId, (todo) => {
          console.log('hi im todo', todo);
          var updatedText2 = todo.text;//get the new text
          Todo.update(nextFileId, updatedText2, changeTodo.bind(null, nextFileId));
        });
      });
    } else {
      Todo.delete(id, removeTodo.bind(null, id));
    }
  });

  // Initialization //////////////////////////////////////////////////////////////

  console.log('CRUDdy Todo client is running the browser');
  Todo.readAll(addAllTodos);

});
