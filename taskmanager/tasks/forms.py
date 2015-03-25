from django import forms
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from datetimewidget.widgets import DateTimeWidget

from datetime import datetime
from djangular.forms import NgFormValidationMixin, NgModelForm
from djangular.styling.bootstrap3.forms import Bootstrap3ModelForm

from .models import Project, Task


class TaskForm(NgFormValidationMixin, Bootstrap3ModelForm):
    class Meta:
        model = Task
        fields = ('content', 'deadline', )
        dateTimeOptions = {
            'startDate': datetime.now().strftime("%Y-%m-%d"),
            'initialDate': datetime.now().strftime("%Y-%m-%d")
        }
        widgets = {
            'deadline': DateTimeWidget(usel10n=True, bootstrap_version=3, options=dateTimeOptions)
        }


class ProjectForm(NgFormValidationMixin, Bootstrap3ModelForm):
    class Meta:
        model = Project
        fields = ('name', )

class LoginForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username', 'password', ]