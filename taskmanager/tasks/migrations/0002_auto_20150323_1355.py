# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='content',
            field=models.CharField(max_length=50, verbose_name='Task content'),
            preserve_default=True,
        ),
    ]
