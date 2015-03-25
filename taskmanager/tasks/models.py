from django.db import models
from django.contrib.auth.models import User
from django.utils.encoding import python_2_unicode_compatible
from django.utils.translation import ugettext_lazy as _

from datetime import date

# Create your models here.


@python_2_unicode_compatible
class Project(models.Model):
    name = models.CharField(max_length=50, verbose_name=_('Project name'))
    user = models.ForeignKey(User, null=True, related_name='projects', verbose_name=_('User'))

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = _('Project')
        verbose_name_plural = _('Projects')


@python_2_unicode_compatible
class Task(models.Model):
    project = models.ForeignKey(Project, related_name='tasks', verbose_name=_('Project'))
    content = models.CharField(max_length=50, verbose_name=_('Task content'))
    deadline = models.DateTimeField(blank=True, null=True, verbose_name=_('Deadline'))
    done = models.BooleanField(default=False, verbose_name=_('Is done?'))

    def is_deadline_today(self):
        return date.today() == self.deadline.date()

    def __str__(self):
        return self.content

    class Meta:
        verbose_name = _('Task')
        verbose_name_plural = _('Tasks')