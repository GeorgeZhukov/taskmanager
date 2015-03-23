/**
 * Created by george on 3/23/15.
 */

function addTask(project) {
    var newTaskName = $('#new-task-name-' + project.toString()).val();
    renderProjectsPage();
}

function renderProjectsPage(){
    $.ajax({
        url: '/projects/',
        type: 'GET',
        dataType: 'html',
        success: function (data) {
            var v_page = $('<div></div>');
            v_page.html(data);
            var pageHTML = $('#page', v_page).html();
            $('#page').html(pageHTML);
        }
    })
}

$(function(){
    renderProjectsPage();
});