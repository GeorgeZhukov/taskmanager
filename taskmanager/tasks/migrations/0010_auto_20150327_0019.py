# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models, migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tasks', '0009_auto_20150326_2354'),
    ]

    operations = [
        migrations.AlterField(
            model_name='task',
            name='order_id',
            field=models.PositiveIntegerField(default=1, verbose_name='Order id'),
            preserve_default=True,
        ),
    ]
