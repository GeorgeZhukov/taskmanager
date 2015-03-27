var app = angular.module('app', ['services', 'ng.django.forms']);

app.config(function ($interpolateProvider, $httpProvider) {
    $interpolateProvider.startSymbol('<%').endSymbol('%>');

    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';

    $httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

    // alternatively, register the interceptor via an anonymous factory
    $httpProvider.interceptors.push(function ($q, notification, modal) {
        return {
            // optional method
            'responseError': function (rejection) {
                // do something on error
                if (rejection.status == 403) {
                    // auth problem
                    //notification.showLoggedOut();
                    //document.location.href = '/accounts/login/';
                    modal.showLoginModal();
                }
                return $q.reject(rejection);
            }
        };
    });

});


app.controller('EditTaskCtrl', function ($scope, tasks, notification, modal) {
    $scope.$on('editTask', function (event, args) {
        $scope.task = args;
        $scope.content = $scope.task.content;
        $scope.deadline = $scope.task.deadline;
        modal.showEditTaskModal();
    });
    $scope.save = function () {
        $scope.task.content = $scope.content;
        $scope.task.deadline = $scope.deadline;

        tasks.byId($scope.task.id).get().then(function (task) {
            task.content = $scope.content;
            task.deadline = $scope.deadline;
            task.put().then(function () {
                modal.hideEditTaskModal();
                notification.showTaskSaved();
            });
        });
    }
});

app.controller('AddProjectCtrl', function ($scope, projects, modal) {
    $scope.save = function () {
        var projectInstance = {name: $scope.name};
        projects.all().post(projectInstance).then(function () {
            $scope.update();
            modal.hideNewProjectModal();
        });
    };
});

app.controller('ProjectsListCtrl', function ($scope, projects, notification) {
    $scope.$on('userAuthorized', function (event, args) {
        $scope.update();
    });
    $scope.$on('userUnauthorized', function (event, args) {
        $scope.projects = {};
        $scope.update();
    });
    $scope.projects = {};
    $scope.project = {};

    $scope.update = function () {
        projects.all().getList().then(function (projects) {
            $scope.projects = projects;
            $scope.project = {};
        });
    };

    $scope.addProject = function () {
        projects.all().post($scope.project).then(function () {
            $scope.update();
            notification.showProjectAdded();
        });
    };

    $scope.update();
});

app.controller("SignUpCtrl", function ($scope, notification, modal, auth, $rootScope) {
    $scope.signup = function () {
        if ($scope.password1 != $scope.password2) {
            notification.showPasswordConfirm();
            return;
        }
        auth.signup($scope.username, $scope.password1).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $rootScope.$broadcast('userAuthorized', data.data);
            modal.hideSignUpModal();
        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            notification.showUnknownError(data.detail);
        }).then(function () {
            $scope.password = "";
        });
    };
});


app.controller('EditProjectCtrl', function ($scope, projects, notification, modal) {
    $scope.$on('editProject', function (event, args) {
        $scope.project = args;
        $scope.name = $scope.project.name;
        modal.showEditProjectModal();//
    });
    $scope.save = function () {
        $scope.project.name = $scope.name;
        projects.byId($scope.project.id).get().then(function (project) {
            project.name = $scope.project.name;
            project.put().then(function () {
                modal.hideEditProjectModal();
                notification.showProjectSaved();
            });
        });

    }
});

app.controller("LogoutCtrl", function ($scope, auth, notification, modal, $rootScope) {
    $scope.logout = function () {
        auth.logout().then(function () {
            $rootScope.$broadcast('userUnauthorized');
            notification.showLoggedOut();
            modal.hideLogoutModal();
            modal.showLoginModal();
        });
    }
});

app.controller("LoginCtrl", function ($scope, notification, auth, modal, $rootScope) {
    $scope.login = function () {
        auth.login($scope.username, $scope.password).success(function (data, status, headers, config) {
            // this callback will be called asynchronously
            // when the response is available
            $rootScope.$broadcast('userAuthorized', data.data);
            modal.hideLoginModal();
        }).error(function (data, status, headers, config) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            notification.showWrongCredentials();
        }).then(function () {
            $scope.password = "";
        });

    };
});

app.controller('ProjectCtrl', function ($scope, $rootScope, projects, tasks, notification) {

    $scope.updateProject = function () {
        projects.byId($scope.project.id).get().then(function (project) {
            $scope.project = project;
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
        tasks.all().post($scope.task).then(function () {
            $scope.updateProject();
            notification.showTaskAdded();
        })
    };

    $scope.canMoveTaskUp = function (taskInstance) {
        return taskInstance.order_id > 1;
    };

    $scope.canMoveTaskDown = function (taskInstance) {
        return taskInstance.order_id < $scope.project.tasks.length;
    };

    $scope.moveUpTask = function (taskInstance) {
        tasks.all().getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === taskInstance.id;
            });

            theTask.order_id -= 1;
            theTask.put().then(function () {
                $scope.updateProject();
            });

        });
    };

    $scope.moveDownTask = function (taskInstance) {
        tasks.all().getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === taskInstance.id;
            });

            theTask.order_id += 1;
            theTask.put().then(function () {
                $scope.updateProject();
            });

        });
    };

    $scope.toggleTaskStatus = function (taskInstance) {
        tasks.byId(taskInstance.id).get().then(function (task) {
            task.done = !task.done;
            task.put().then(function () {
                $scope.updateProject();
            });
        });
    };

    $scope.deleteTask = function (taskInstance) {
        tasks.byId(taskInstance.id).remove().then(function () {
            // Updating the list and removing the user after the response is OK.
            $scope.updateProject();
            notification.showTaskRemoved();
        });

    };
    $scope.updateProject();
});