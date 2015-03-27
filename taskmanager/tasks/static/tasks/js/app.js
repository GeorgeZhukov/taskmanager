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


app.controller('EditTaskCtrl', function ($scope, task, notification, modal) {
    $scope.$on('editTask', function (event, args) {
        $scope.task = args;
        $scope.content = $scope.task.content;
        $scope.deadline = $scope.task.deadline;
        modal.showEditTaskModal();
    });
    $scope.save = function () {
        $scope.task.content = $scope.content;
        $scope.task.deadline = $scope.deadline;
        //todo: optimize
        task.getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === $scope.task.id;
            });
            theTask.content = $scope.content;
            theTask.deadline = $scope.deadline;
            theTask.put();
            modal.hideEditTaskModal();
            notification.showTaskSaved();
        });
    }
});

app.controller('AddProjectCtrl', function ($scope, project, modal) {
    $scope.save = function () {
        var projectInstance = {name: $scope.name};
        project.post(projectInstance).then(function () {
            $scope.update();
            modal.hideNewProjectModal();
        });
    };
});

app.controller('ProjectsListCtrl', function ($scope, project, notification) {
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

app.controller("SignUpCtrl", function ($scope, notification, modal, auth, $rootScope) {
    $scope.signup = function () {
        if ($scope.password1 != $scope.password2){
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


app.controller('EditProjectCtrl', function ($scope, project, notification, modal) {
    $scope.$on('editProject', function (event, args) {
        $scope.project = args;
        $scope.name = $scope.project.name;
        modal.showEditProjectModal();//
    });
    $scope.save = function () {
        $scope.project.name = $scope.name;
        //todo: optimize
        project.getList().then(function (projects) {
            var theProject = _.find(projects, function (project) {
                return project.id === $scope.project.id;
            });
            theProject.name = $scope.project.name;

            theProject.put();
            modal.hideEditProjectModal();
            notification.showProjectSaved();
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

app.controller('ProjectCtrl', function ($scope, $rootScope, project, task, notification) {

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

    $scope.canMoveTaskUp = function (taskInstance) {
        return taskInstance.order_id > 1;
    };

    $scope.canMoveTaskDown = function (taskInstance) {
        return taskInstance.order_id < $scope.project.tasks.length;
    };

    $scope.moveUpTask = function (taskInstance) {
        task.getList().then(function (tasks) {
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
        task.getList().then(function (tasks) {
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
        task.getList().then(function (tasks) {
            var theTask = _.find(tasks, function (task) {
                return task.id === taskInstance.id;
            });
            theTask.done = !theTask.done;
            theTask.put().then(function () {
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