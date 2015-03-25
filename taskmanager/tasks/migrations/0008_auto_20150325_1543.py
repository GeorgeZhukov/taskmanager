# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0007_task_done'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='deadline',
            field=models.DateTimeField(null=True, verbose_name='Deadline', blank=True),
            preserve_default=True,
        ),
    ]
