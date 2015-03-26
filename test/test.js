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

    beforeEach(inject(function (_$httpBackend_, _$controller_, $rootScope) {
        $httpBackend = _$httpBackend_;
        $controller = _$controller_;
        scope = $rootScope.$new();
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
    })


    describe("project controller", function(){
        var ProjectCtrl;

        beforeEach(function(){
            scope.update = function(){};
            $httpBackend.whenGET("/api/projects/?format=json").respond(projects);
            scope.project = projects[0];
            ProjectCtrl = $controller("ProjectCtrl", {$scope: scope});
            $httpBackend.flush();
        });

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
            $httpBackend.whenPUT("/api/tasks/1/?format=json").respond(200, '');
            $httpBackend.whenGET("/api/tasks/?format=json").respond(tasks);
            scope.toggleTaskStatus(tasks[0]);
            $httpBackend.expectGET("/api/tasks/?format=json");
            $httpBackend.expectPUT("/api/tasks/1/?format=json");
            $httpBackend.flush();
        });

        it("delete task send request", function(){
            $httpBackend.whenDELETE("/api/tasks/2/?format=json").respond(200, '');
            $httpBackend.whenGET("/api/tasks/?format=json").respond(tasks);
            scope.deleteTask(tasks[1]);
            $httpBackend.expectGET("/api/tasks/?format=json");
            $httpBackend.expectDELETE("/api/tasks/2/?format=json");
            $httpBackend.flush();
        });

    })

});