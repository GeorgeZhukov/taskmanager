'use strict';
/**
 * Created by george on 3/25/15.
 */

describe('AddProjectCtrl', function () {


    var mockServices = {};
    var $controller;
    beforeEach(function () {

        module('app', function ($provide) {
            $provide.value('services', mockServices);
        });

        inject(function (_$controller_, $q) {
            // The injector unwraps the underscores (_) from around the parameter names when matching
            $controller = _$controller_;
            mockServices = {
                project: {
                    data: [
                        {
                            name: "Project 1"
                        },
                        {
                            name: "Project 2"
                        }],
                    post: function (item) {
                        var defer = $q.defer();

                        this.data.push(item);
                        defer.resolve(item);

                        return defer.promise;
                    },
                    getList: function () {
                        var defer = $q.defer();
                        defer.resolve(this.data);
                        console.log(this.data);
                        return defer.promise;
                    }
                },
                notification: {
                    showTaskAdded: function () {
                    },
                    showTaskRemoved: function () {
                    },
                    showProjectAdded: function () {
                    },
                    showProjectRemoved: function () {
                    },
                    showLoggedOut: function () {
                    },
                    showTaskSaved: function () {
                    },
                    showProjectSaved: function () {
                    }
                }
            };

        });
    });


    describe('New project', function () {
        it('save project', function () {
            var $scope = {};
            var project = mockServices.project;
            var controller = $controller('AddProjectCtrl', {$scope: $scope, project: project});
            $scope.name = "Project name";
            $scope.save();
            expect(project.data[2]).toEqual({name: 'Project name'});
        });
    });

    describe('Show projects', function () {
        it('projects list', function () {
            var $scope = {};
            var project = mockServices.project;

            var notification = mockServices.notification;
            var controller = $controller('ProjectsListCtrl', {
                $scope: $scope,
                project: project,
                notification: notification
            });
            //project.getList().then(function(a){
            //    console.log(a);
            //});
            //$scope.update();
            console.log($scope.projects);
            //expect($scope.projects).toEqual(project.data);


        });
    });
});

//describe('api', function () {
//    var mockServices = {};
//
//    mockServices.project = function () {
//    };
//    mockServices.task = function () {
//    };
//    mockServices.notification = function () {
//        return {
//            showTaskAdded: function () {
//            },
//            showTaskRemoved: function () {
//            },
//            showProjectAdded: function () {
//            },
//            showProjectRemoved: function () {
//            },
//            showLoggedOut: function () {
//            },
//            showTaskSaved: function () {
//            },
//            showProjectSaved: function () {
//            }
//        };
//    };
//
//    beforeEach(function () {
//        module('app', function ($provide) {
//            $provide.value('services', mockServices);
//        });
//    });
//
//    var $controller;
//
//    beforeEach(inject(function (_$services_) {
//        // The injector unwraps the underscores (_) from around the parameter names when matching
//        $controller = _$services_;
//    }));
//
//    describe('$scope.grade', function () {
//        it('sets the strength to "strong" if the password length is >8 chars', function () {
//            var $scope = {};
//            //var controller = $controller('AddProjectCtrl', {$scope: $scope});
//            //console.log(controller);
//            //$scope.password = 'longerthaneightchars';
//            //$scope.grade();
//            //expect($scope.strength).toEqual('strong');
//        });
//    });
//
//});