from django.contrib import admin
from .models import WatchList, WatchListDetail


class WatchListDetailInLine(admin.TabularInline):
    model = WatchListDetail


@admin.register(WatchList)
class WatchListAdmin(admin.ModelAdmin):
    """
    Django class to register the WatchList model with the Django
    admin application.
    """
    list_display = (
        'name',
        'description',
        'owner')  # lists the fields to display in the admin application
    # links the WatchListDetailInLine class to this class a child in the
    # admin application.
    inlines = (WatchListDetailInLine,)
