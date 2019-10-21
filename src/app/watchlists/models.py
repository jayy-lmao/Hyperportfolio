from django.contrib.auth.models import User
from django.db import models


class WatchList(models.Model):
    """
    Django class to declare a model which maps to a database table
    called watchlists_watchlist (which it will create if it doesn't
    exist). The variables below are the user defined fields that it
    will create. This model represents watchlist header information.
    """
    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE,
                              related_name="watchlist_owned_by")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    view_count = models.IntegerField(default=0)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("-view_count", )
        unique_together = (('name', 'owner'),)

    def __str__(self):
        return self.name


class WatchListDetail(models.Model):
    """
    Django class to declare a model which maps to a database table
    called watchlists_watchlistdetail (which it will create if it doesn't
    exist). The variables below are the user defined fields that it
    will create. This model represents the stocks in the watchlist.
    """
    watchlist_id = models.ForeignKey(WatchList,
                                     on_delete=models.CASCADE,
                                     related_name="watchlist_details")
    symbol = models.CharField(max_length=20)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = (('watchlist_id', 'symbol'),)
