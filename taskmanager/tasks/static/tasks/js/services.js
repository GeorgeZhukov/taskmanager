/**
 * Created by george on 3/25/15.
 */

var app = angular.module('services', ['restangular', 'toaster']);

app.config(function (RestangularProvider) {
    RestangularProvider
        .setBaseUrl('/api')
        .setRequestSuffix('/?format=json');
});

app.factory("notification", function (toaster) {
    return {
        showTaskAdded: function () {
            toaster.success("Task Added");
        },
        showTaskRemoved: function () {
            toaster.success("Task Removed");
        },
        showProjectAdded: function () {
            toaster.success("Project Added");
        },
        showProjectRemoved: function () {
            toaster.success("Project Removed");
        },
        showLoggedOut: function () {
            toaster.info("You're logged out.");
        },
        showTaskSaved: function () {
            toaster.success("The task saved.");
        },
        showProjectSaved: function () {
            toaster.success("The project saved.");
        }
    };
});

app.factory("modal", function () {
    return {
        showEditProjectModal: function () {
            $('#EditProjectModal').modal('show');
        },
        hideEditProjectModal: function () {
            $('#EditProjectModal').modal('hide');
        },
        showEditTaskModal: function(){
            $('#EditTaskModal').modal('show');
        },
        hideEditTaskModal: function(){
            $('#EditTaskModal').modal('hide');
        },
        hideNewProjectModal: function(){
            $('#newProjectModal').modal('hide');
        }

    };
});


app.factory("project", function (Restangular) {
    return Restangular.all('projects');
});

app.factory("task", function (Restangular) {
    return Restangular.all('tasks');
});