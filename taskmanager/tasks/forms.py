from django import forms
from django.utils.translation import ugettext_lazy as _

from datetimewidget.widgets import DateTimeWidget

from datetime import datetime

from .models import Project, Task


class TaskForm(forms.ModelForm):
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