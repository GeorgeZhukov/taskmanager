/**
 * Created by george on 3/21/15.
 */


function login(){
    var form = $('#sign-in');

    $.ajax({
        method: 'POST',
        url: '/api-auth/login/?format=json',
        data: form.serialize(),
        dataType: 'json',
        success: function(data){
            console.log(data);
        },
        error: function(data){
            console.log(data);
        }
    });
}

function logout(){
    var logoutURL = "/api-auth/logout/";
    $.ajax({
        method: 'GET',
        url: logoutURL,
        success: function(data){
            console.log(data);
        }
    });
}

function showAddProjectPopup(){
    var addProjectURL = "/projects/add/";
    $.ajax({
        method: 'GET',
        url: addProjectURL,
        success: function(data){
            var page = $.parseHTML(data);
            var form = $(page).find('#add-project');
            $('#addProjectModalBody').html(form);
            $('#addProjectModal').modal();
        }
    });
}

function addProject(){
    var project_name = $('#id_name').val();
}