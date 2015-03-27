from django.views import generic
from django.contrib.auth import authenticate, logout, login
from django.contrib.auth.models import User

from rest_framework import serializers, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView, Response
from rest_framework.exceptions import NotFound, APIException

from braces.views import LoginRequiredMixin

from .models import Project, Task
from .forms import TaskForm, ProjectForm, NgSignupForm, NgLoginForm

# Create your views here.


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', )

# Serializers define the API representation.
class TaskSerializer(serializers.ModelSerializer):
    def save(self, **kwargs):

        if self.instance:
            # Change order id on target task
            order_id = self.validated_data['order_id']
            if self.instance.order_id != order_id:
                project = self.validated_data['project']
                task = project.tasks.filter(order_id=order_id).exclude(pk=self.instance.pk).first()
                task.order_id = self.instance.order_id
                task.save()

        result = super(TaskSerializer, self).save(**kwargs)
        return result

    class Meta:
        model = Task
        fields = ('id', 'project', 'content', 'deadline', 'done', 'order_id', )


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)

    def save(self, **kwargs):
        kwargs['user'] = self.context['request'].user
        result = super(ProjectSerializer, self).save(**kwargs)
        return result

    class Meta:
        model = Project
        fields = ('id', 'user', 'name', 'tasks', )
        read_only_fields = ('user', )


# ViewSets define the view behavior.
class TaskViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_queryset(self):
        return Task.objects.filter(project__user=self.request.user)


class ProjectViewSet(viewsets.ModelViewSet):
    permission_classes = (IsAuthenticated,)
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer

    def get_queryset(self):
        return Project.objects.filter(user=self.request.user)



class AuthView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data["username"]
        password = request.data["password"]
        users = User.objects.filter(username=username)
        if users.exists():
            raise APIException("username already in use")
        User.objects.create_user(username=username, password=password)
        user = authenticate(username=username, password=password)
        login(request, user)
        return Response(UserSerializer(request.user).data)

    def put(self, request, *args, **kwargs):
        username = request.data["username"]
        password = request.data["password"]
        user = authenticate(username=username, password=password)
        if user is None:
            raise NotFound()

        if not user.is_active:
            raise APIException("user inactive")

        login(request, user)
        return Response(UserSerializer(request.user).data)

    def delete(self, request, *args, **kwargs):
        logout(request)
        return Response('Ok')


class AngularView(generic.TemplateView):
    template_name = 'tasks/angular.html'

    def get_context_data(self, **kwargs):
        context = super(AngularView, self).get_context_data(**kwargs)
        context.update(task_form=TaskForm())
        context.update(project_form=ProjectForm(form_name='edit_project'))
        context.update(add_project_form=ProjectForm(form_name='add_project'))
        context.update(login_form=NgLoginForm())
        context.update(signup_form=NgSignupForm())
        # context.update()

        return context