var app = angular.module('app', ['restangular', 'toaster', 'ng.django.forms']);

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


app.config(function ($interpolateProvider, $httpProvider, RestangularProvider) {
    $interpolateProvider.startSymbol('<%').endSymbol('%>');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

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
                //notification.showLoggedOut();
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

app.controller('EditTaskController', function ($scope, task, notification) {
    $scope.$on('editTask', function (event, args) {
        $scope.task = args;
        $('#EditTaskModal').modal('show');
    });
    $scope.save = function () {
        //todo: optimize
        task.getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === $scope.task.id;
            });
            theTask.content = $scope.task.content;
            theTask.deadline = $scope.task.deadline;
            theTask.put();
            $('#EditTaskModal').modal('hide');
            notification.showTaskSaved();
        });
    }
});

app.controller('ProjectsListController', function ($scope, project, notification) {

    $scope.update = function () {
        project.getList().then(function (projects) {
            $scope.projects = projects;
            $scope.project = {};
        });
    };

    $scope.addProject = function () {
        project.post($scope.project).then(function () {
            $scope.update();
            notification.showProjectAdded();
        });
    };

    $scope.update();
});

app.controller('EditProjectController', function ($scope, project, notification) {
    $scope.$on('editProject', function (event, args) {
        $scope.project = args;
        $('#EditProjectModal').modal('show');
    });
    $scope.save = function () {
        //todo: optimize
        project.getList().then(function (projects) {
            var theProject = _.find(projects, function (project) {
                return project.id === $scope.project.id;
            });
            theProject.name = $scope.project.name;

            theProject.put();
            $('#EditProjectModal').modal('hide');
            notification.showProjectSaved();
        });
    }
});

app.controller('ProjectController', function ($scope, $rootScope, project, task, notification) {
    $scope.updateProject = function () {
        // todo: optimize
        project.getList().then(function (projects) {
            var theProject = _.find(projects, function (project) {
                return project.id === $scope.project.id;
            });
            $scope.project = theProject;
        });

        $scope.task = {};
    };

    $scope.edit = function () {
        $rootScope.$broadcast('editProject', $scope.project);
    };

    $scope.editTask = function (taskInstance) {
        $rootScope.$broadcast('editTask', taskInstance);
    };

    $scope.delete = function () {
        $scope.project.remove().then(function () {
            $scope.update();
            notification.showProjectRemoved();
        });
    };

    $scope.addTask = function () {
        $scope.task.project = $scope.project.id;
        task.post($scope.task).then(function () {
            $scope.updateProject();
            notification.showTaskAdded();
        })
    };

    $scope.toggleTaskStatus = function (taskInstance) {
        task.getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === taskInstance.id;
            });
            theTask.done = !theTask.done;
            theTask.put().then(function(){
                $scope.updateProject();
            });

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
                $scope.updateProject();
                notification.showTaskRemoved();
            });
        });
    };
    $scope.updateProject();
});