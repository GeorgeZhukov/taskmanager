from django import forms
from django.contrib.auth.models import User
from django.utils.translation import ugettext_lazy as _

from datetimewidget.widgets import DateTimeWidget

from allauth.account.forms import SignupForm, LoginForm

from datetime import datetime

from djangular.forms import NgFormValidationMixin, NgModelForm
from djangular.styling.bootstrap3.forms import Bootstrap3ModelForm, Bootstrap3Form

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


class NgLoginForm(NgFormValidationMixin, Bootstrap3Form):
    username = forms.CharField(label=_("Username"),
                               widget=forms.TextInput(attrs={'placeholder': _('Username'), 'autofocus': 'autofocus'}),
                               max_length=30)
    password = forms.CharField(label=_("Password"), widget=forms.PasswordInput)


class NgSignupForm(NgFormValidationMixin, Bootstrap3Form):
    username = forms.CharField(label=_("Username"),
                               max_length=30,
                               min_length=5,
                               widget=forms.TextInput(
                                   attrs={'placeholder':
                                              _('Username'),
                                          'autofocus': 'autofocus'}))

    password1 = forms.CharField(min_length=5, max_length=30, label=_("Password"), widget=forms.PasswordInput)
    password2 = forms.CharField(min_length=5, max_length=30, label=_("Password (again)"), widget=forms.PasswordInput)