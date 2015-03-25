var app = angular.module('app', ['restangular', 'toaster']);

app.config(function ($interpolateProvider, $httpProvider, RestangularProvider) {
    $interpolateProvider.startSymbol('<%').endSymbol('%>');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function ($q, notification) {
        return {
            // optional method
            'responseError': function (rejection) {
                // do something on error
                if (rejection.status == 403) {
                    // auth problem
                    notification.showLoggedOut();
                    $('#AuthModal').modal('show');
                }
                return $q.reject(rejection);
            }
        };
    });

    RestangularProvider
        .setBaseUrl('/api')
        .setRequestSuffix('/?format=json')
        .setErrorInterceptor(function (response, deferred, responseHandler) {
            if (response.status === 403) {
                //refreshAccesstoken().then(function () {
                //    // Repeat the request and then call the handlers the usual way.
                //    $http(response.config).then(responseHandler, deferred.reject);
                //    // Be aware that no request interceptors are called this way.
                //});
                notification.showLoggedOut();
                return false; // error handled
            }

            return true; // error not handled
        });
});


app.factory("project", function (Restangular) {
    return Restangular.all('projects');
});

app.factory("task", function (Restangular) {
    return Restangular.all('tasks');
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
        }
    };
});

app.controller('ProjectsController', function ($scope, task, project, notification) {

    $scope.update = function () {
        project.getList().then(function (projects) {
            $scope.projects = projects;
            $scope.project = {};
            $scope.task = {};
        });
    };

    $scope.addProject = function () {
        project.post($scope.project).then(function () {
            $scope.update();
            notification.showProjectAdded();
        });
    };
    $scope.deleteProject = function (projectInstance) {
        console.log(projectInstance);
        projectInstance.remove().then(function () {
            $scope.update();
            notification.showProjectRemoved();
        });

    };

    $scope.getTasks = function (projectInstance) {
        console.log(projectInstance.tasks);
    };

    $scope.addTask = function (projectInstance) {
        $scope.task.project = projectInstance.id;
        task.post($scope.task).then(function () {
            $scope.update();
            notification.showTaskAdded();
        })
    };

    $scope.toggleTaskStatus = function (taskInstance) {

        task.getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === taskInstance.id;
            });
            theTask.done = !theTask.done;

            theTask.put();
        });
    };

    $scope.deleteTask = function (taskInstance) {
        task.getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === taskInstance.id;
            });
            // Alternatively delete the element from the list when finished
            theTask.remove().then(function () {
                // Updating the list and removing the user after the response is OK.
                $scope.update();
                notification.showTaskRemoved();
            });
        });
    };

    $scope.update();
});