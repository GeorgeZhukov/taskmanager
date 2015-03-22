var tasks = angular.module('tasks', ['ngResource']);

tasks.config(function($interpolateProvider){
    $interpolateProvider.startSymbol('<%').endSymbol('%>');
});

tasks.config(['$httpProvider', function($httpProvider){
    // django and angular both support csrf tokens. This tells
    // angular which cookie to add to what header.
    $httpProvider.defaults.xsrfCookieName = 'csrftoken';
    $httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
}]);


tasks.factory('Project', ['$resource',
  function($resource){
    return $resource("/api/projects/:id/?format=json");
  }]);

tasks.factory('Task', ['$resource',
  function($resource){
    return $resource("/api/tasks/:id/?format=json");
  }]);


tasks.controller('TodoCtrl', function($scope, Project, Task) {
  $scope.projects = Project.query();
  $scope.tasks = Task.query();

  $scope.addProject = function () {
    var project_name = $scope.project.name;
    Project.save({name: project_name});
    $('#addProjectModal').modal('hide');
  };

  $scope.deleteProject = function () {
    
  }

});

