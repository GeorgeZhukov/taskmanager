/**
 * Created by george on 3/25/15.
 */

var app = angular.module('services', ['restangular', 'toaster']);

app.config(function (RestangularProvider) {
    RestangularProvider
        .setBaseUrl('/api')
        .setRequestSuffix('/?format=json');
});

app.factory("auth", function ($http) {
    return {
        login: function (username, password) {
            return $http.put("/api/auth/", {username: username, password: password});
        },
        logout: function () {
            return $http.delete("/api/auth/");
        },
        signup: function (username, password) {
            return $http.post("/api/auth/", {username: username, password: password});
        }

    };
});

app.factory("notification", function (toaster) {
    return {
        showUnknownError: function (msg){
            toaster.error(msg);
        },
        showPasswordConfirm: function(){
            toaster.warning("Passwords not equal");
        },
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
        },
        showWrongCredentials: function () {
            toaster.error("Wrong credentials.");
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
        showEditTaskModal: function () {
            $('#EditTaskModal').modal('show');
        },
        hideEditTaskModal: function () {
            $('#EditTaskModal').modal('hide');
        },
        hideNewProjectModal: function () {
            $('#newProjectModal').modal('hide');
        },
        hideLoginModal: function () {
            $("#LoginModal").modal('hide');
        },
        showLoginModal: function () {
            $("#LoginModal").modal('show');
        },
        hideLogoutModal: function () {
            $("#LogoutModal").modal('hide');
        },
        hideSignUpModal: function(){
            $("#SignUpModal").modal('hide');
            this.hideLoginModal();
        }

    };
});


app.factory("project", function (Restangular) {
    return Restangular.all('projects');
});

app.factory("task", function (Restangular) {
    return Restangular.all('tasks');
});