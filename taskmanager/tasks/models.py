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
    order_id = models.PositiveIntegerField(default=1, verbose_name=_('Order id'))

    def is_deadline_today(self):
        return date.today() == self.deadline.date()

    def delete(self, using=None):
        tasks_to_reorder = self.project.tasks.filter(order_id__gte=self.order_id)
        for task in tasks_to_reorder:
            task.order_id -= 1
            task.save()
        return super(Task, self).delete(using)

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):

        max_order = lambda : self.project.tasks.all().aggregate(models.Max("order_id"))['order_id__max']
        # Set order for new model
        if not self.pk:
            max = max_order()

            if max:
                self.order_id = int(max) + 1
            else:
                self.order_id = 1

        # validate order id
        # if self.pk:
        #     max = max_order()
        #     if self.order_id not in range(1, max + 2): # If last item change order
        #         raise ValueError("Invalid order id")   # there is moment where max
        #                                                # actually will be incorrect
        #                                                # so we use + 2 to keep margin


        return super(Task, self).save(force_insert, force_update, using, update_fields)

    def __str__(self):
        return self.content

    class Meta:
        verbose_name = _('Task')
        verbose_name_plural = _('Tasks')
        ordering = ['order_id']