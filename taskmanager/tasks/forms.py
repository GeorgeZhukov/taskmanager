from django import forms
from django.utils.translation import ugettext_lazy as _

from .models import Project


class SignupForm(forms.Form):
    username = forms.CharField(max_length=30, label=_('Username'))
    password = forms.CharField(max_length=30, widget=forms.PasswordInput, label=_('Password'))
    confirm = forms.CharField(max_length=30, widget=forms.PasswordInput, label=_('Password Confirm'))


class SigninForm(forms.Form):
    username = forms.CharField(max_length=30, label=_('Username'))
    password = forms.CharField(max_length=30, widget=forms.PasswordInput, label=_('Password'))


class AddProjectForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = ['name', ]