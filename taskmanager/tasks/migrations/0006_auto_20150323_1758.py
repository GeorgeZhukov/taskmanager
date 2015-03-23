# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0005_auto_20150323_1531'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='deadline',
            field=models.DateTimeField(null=True, verbose_name='Deadline'),
            preserve_default=True,
        ),
    ]
