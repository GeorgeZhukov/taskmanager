describe("Unit: app", function () {

    function toRawCollection(collection) {
        var rawCollection = [];
        _.each(collection, function (item) {
            rawCollection.push(item.plain());
        });
        return rawCollection;
    }

    // mock our module in our test
    beforeEach(module("app"));

    var $httpBackend, $controller, scope;
    var projects = [
        {
            id: 1,
            name: "Project 1"
        }];

    var tasks = [
        {
            id: 1,
            content: "Task 1",
            project: 1
        },
        {
            id: 2,
            content: "Task 2",
            project: 1
        },
        {
            id: 3,
            content: "Task 3",
            project: 1
        }
    ];

    // Mock jquery modal
    var modalService = {
        showEditProjectModal: function () {},
        hideEditProjectModal: function () {},
        showEditTaskModal: function(){},
        hideEditTaskModal: function(){},
        hideNewProjectModal: function(){}
    };

    beforeEach(function(){
        module(function($provide){
            $provide.value("modal", modalService);
        });
    });

    beforeEach(inject(function (_$httpBackend_, _$controller_, $rootScope) {
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        scope = $rootScope.$new();
        modal = modalService;
    }));

    afterEach(function () {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("projects list controller", function () {
        var ProjectsListCtrl;

        beforeEach(function () {
            $httpBackend.whenGET("/api/projects/?format=json").respond(projects);
            ProjectsListCtrl = $controller("ProjectsListCtrl", {$scope: scope});
            $httpBackend.flush();
        });


        it("show projects list", function () {
            expect(toRawCollection(scope.projects)).toEqual(projects);
        });

        it("refresh collection after add project", function () {
            expect(toRawCollection(scope.projects)).toEqual(projects);

            scope.project = {
                id: 2,
                name: "Project 2"
            };
            scope.addProject();

            // POST
            projects.push(scope.project);
            $httpBackend.expectPOST("/api/projects/?format=json").respond(201, '');
            $httpBackend.flush();
            expect(toRawCollection(scope.projects)).toEqual(projects);
        });
    });

    describe("add project controller", function(){
        var AddProjectCtrl;
        beforeEach(function(){
            AddProjectCtrl = $controller("AddProjectCtrl", {$scope: scope});
        });

        it("sends request when add project", function(){
            scope.name = "New Project";
            scope.update = function(){};
            $httpBackend.whenPOST("/api/projects/?format=json").respond(201, '');
            scope.save();
            $httpBackend.expectPOST("/api/projects/?format=json");
            $httpBackend.flush();
        });
    });

    describe("project controller", function(){
        var ProjectCtrl, $rootScope;

        beforeEach(inject(function(_$rootScope_){
            $rootScope = _$rootScope_;
            spyOn($rootScope, '$broadcast');
            scope.update = function(){};
            $httpBackend.whenGET("/api/projects/1/?format=json").respond(projects[0]);
            scope.project = projects[0];
            ProjectCtrl = $controller("ProjectCtrl", {$scope: scope});
            $httpBackend.flush();
        }));

        it("get project", function(){
            expect(scope.project.plain()).toEqual(projects[0]); // plain to convert restangular to raw item
            expect(scope.task).toEqual({}); // empty task init when project updated
        });

        it("delete project send request", function(){
            $httpBackend.whenDELETE("/api/projects/1/?format=json").respond(200, '');
            scope.delete();
            $httpBackend.expectDELETE("/api/projects/1/?format=json");
            $httpBackend.flush();
        });

        it("add task send request", function(){
            $httpBackend.whenPOST("/api/tasks/?format=json").respond(201, '');
            scope.addTask();
            $httpBackend.expectPOST("/api/tasks/?format=json");
            $httpBackend.flush();
        });

        it("toggle task status send request", function(){
            $httpBackend.whenPUT("/api/tasks/?format=json").respond(200, '');
            $httpBackend.whenGET("/api/tasks/1/?format=json").respond(tasks);
            scope.toggleTaskStatus(tasks[0]);
            $httpBackend.expectGET("/api/tasks/1/?format=json");
            $httpBackend.expectPUT("/api/tasks/?format=json");
            $httpBackend.flush();
        });

        it("delete task send request", function(){
            $httpBackend.whenDELETE("/api/tasks/2/?format=json").respond(200, '');
            scope.deleteTask(tasks[1]);
            $httpBackend.expectDELETE("/api/tasks/2/?format=json");
            $httpBackend.flush();
        });

        it("edit project broadcast event", function(){
            scope.edit();
            expect($rootScope.$broadcast).toHaveBeenCalledWith("editProject", scope.project);
        });

        it("edit task broadcast event", function(){
            scope.editTask(tasks[0]);
            expect($rootScope.$broadcast).toHaveBeenCalledWith("editTask", tasks[0]);
        });

    });

    describe("edit project controller", function(){
        var EditProjectCtrl;

        beforeEach(function(){
            EditProjectCtrl = $controller("EditProjectCtrl", {$scope: scope});
        });

        it("receive event", function(){
            scope.$broadcast("editProject", projects[0]);
            spyOn(scope, '$broadcast').and.callThrough();
        });

        it("save project", function(){
            scope.project = projects[0];
            $httpBackend.whenGET("/api/projects/1/?format=json").respond(projects);
            $httpBackend.whenPUT("/api/projects/?format=json").respond(200, '');
            scope.save();
            $httpBackend.expectGET("/api/projects/1/?format=json");
            $httpBackend.expectPUT("/api/projects/?format=json");
            $httpBackend.flush();
        });
    });

    describe("edit task controller", function(){
        var EditTaskCtrl;

        beforeEach(function(){
            EditTaskCtrl = $controller("EditTaskCtrl", {$scope: scope});

        });

        it("receive edit task event", function (){
            scope.$broadcast("editTask", tasks[2]);
            spyOn(scope, '$broadcast').and.callThrough();
            expect(scope.content).toEqual(tasks[2].content);
        });

        it("save task", function(){
            scope.task = tasks[1];
            scope.content = tasks[1].content;
            scope.deadline = "";
            $httpBackend.whenGET("/api/tasks/2/?format=json").respond(tasks);
            $httpBackend.whenPUT("/api/tasks/?format=json").respond(200, '');
            scope.save();
            $httpBackend.expectGET("/api/tasks/2/?format=json");
            $httpBackend.expectPUT("/api/tasks/?format=json");
            $httpBackend.flush();
        });
    });

});