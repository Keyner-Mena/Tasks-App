$(document).ready(function () {
  let edit = false;
  console.log("jQuery is Working");
  $("#task-result").hide();
  fetchTasks();

  //Funcionalidad Barra de búsqueda
  $("#search").keyup(function (e) {
    if ($("#search").val()) {
      let search = $("#search").val();
      //console.log(search);
      $.ajax({
        url: "task-search.php",
        type: "POST",
        data: { search },
        success: function (response) {
          //console.log(response);
          let tasks = JSON.parse(response);
          //console.log(tasks);
          // Mostrar todos los resultados
          let template = "";
          tasks.forEach((task) => {
            template += `<li>
                            ${task.name}
                        </li>`;
          });
          $("#container").html(template);
          $("#task-result").show();
        },
      });
    }
  });

  // Crear Tarea / Editar Tarea
  $("#task-form").submit(function (e) {
    e.preventDefault();
    const postData = {
      name: $("#name").val(),
      description: $("#description").val(),
      id: $("#taskId").val(),
    };

    let url = edit === false ? "task-add.php" : "task-edit.php";

    $.post(url, postData, function (response) {
      fetchTasks();
      $("#task-form").trigger("reset");
    });

    edit = false;
  });

  // Mostrar todas las tareas al cargar la página
  function fetchTasks() {
    $.ajax({
      url: "task-list.php",
      type: "GET",
      success: function (response) {
        let tasks = JSON.parse(response);
        let template = "";
        tasks.forEach((task) => {
          template += `
          <tr taskId="${task.id}">
            <td>${task.id}</td>
            <td>
              <a href="#" class="task-item"> ${task.name} </a>
            </td>
            <td>${task.description}</td>
            <td>
              <button class="task-delete btn btn-danger">
                Delete
              </button>
            </td>
          </tr>
          `;
        });
        $("#tasks").html(template);
      },
    });
  }

  // Eliminar Tarea
  $(document).on("click", ".task-delete", function () {
    if (confirm("Are you sure you want to delete it?")) {
      let element = $(this)[0].parentElement.parentElement;
      let id = $(element).attr("taskId");
      $.post("task-delete.php", { id }, function (response) {
        fetchTasks();
      });
    }
  });

  // Editar Tarea
  $(document).on("click", ".task-item", function () {
    let element = $(this)[0].parentElement.parentElement;
    let id = $(element).attr("taskId");
    $.post("task-single.php", { id }, function (response) {
      const task = JSON.parse(response);
      $("#name").val(task.name);
      $("#description").val(task.description);
      $("#taskId").val(task.id);
      edit = true;
    });
  });
});
