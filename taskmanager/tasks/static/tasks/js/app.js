var app = angular.module('app', ['ngResource', 'toaster']);

app.config(function ($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('<%').endSymbol('%>');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
});

app.factory("project", function ($resource) {
    return $resource("/api/projects/:id/?format=json");
});

app.factory("task", function ($resource) {
    return $resource("/api/tasks/:id/?format=json");
});

app.factory("notification", function (toaster) {
    return {
        showTaskAdded: function (){
            toaster.pop('success', "Task Added", "Task Added");
        },
        showTaskRemoved: function () {
            toaster.pop('success', "Task Removed", "Task Removed");
        },
        showProjectAdded: function () {
            toaster.pop('success', "Project Added", "Project Added");
        },
        showProjectRemoved: function () {
            toaster.pop('success', "Project Removed", "Project Removed");
        }
    };
});

app.controller('ProjectsController', function ($scope, project, notification, $resource) {

    $scope.updateProjects = function () {
        $scope.projects = project.query();
        $scope.project = new project();
    };

    $scope.addProject = function () {
        $scope.project.$save(function(){}, $scope.updateProjects());
        notification.showProjectAdded();
    };
    $scope.deleteProject = function (projectInstance) {
        project.delete({id: projectInstance.id}, $scope.updateProjects());
        notification.showProjectRemoved();
    };

    $scope.getTasks = function (projectInstance) {
        console.log(projectInstance.tasks);


    };

    $scope.updateProjects();
});

app.controller('TasksController', function($scope, task, notification) {

    $scope.updateTasks = function(){
        $scope.tasks = task.query();
        $scope.task = new task();
    };

    $scope.addTask = function (project) {
        $scope.task.project = project.id;
        $scope.task.$save();
        $scope.updateTasks();
        notification.showTaskAdded();
    };
    $scope.deleteTask = function (taskInstance) {
        task.delete({id: taskInstance.id});
        $scope.updateTasks();
        notification.showTaskRemoved();
    };

    $scope.updateTasks();
});