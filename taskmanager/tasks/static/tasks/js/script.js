/**
 * Created by george on 3/21/15.
 */


function login(){
    var form = $('#sign-in');
    console.log(form.serialize());
    $.ajax({
        method: 'POST',
        url: '/api-auth/login/',
        data: form.serialize(),
        success: function(data){
            console.log(data);
        }
    });
}

function logout(){
    $.ajax({
        method: 'GET',
        url: '/api-auth/logout/',
        success: function(data){
            console.log(data);
        }
    });
}

function addProject(){
    var project_name = $('#id_name').val()
}