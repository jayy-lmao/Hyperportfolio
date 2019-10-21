from django.contrib import admin
from .models import (Portfolio, PortfolioDetail,
                     PortfolioSummary, TransactionType)


@admin.register(TransactionType)
class TransactionTypeAdmin(admin.ModelAdmin):
    """
    Django class to register the TransactionType model with the Django
    admin application.
    """
    list_display = (
        'code',
        'description',
    )  # lists the fields to display in the admin application


class PortfolioDetailInLine(admin.TabularInline):
    model = PortfolioDetail
    """
    Django class to register the ProductDetail model with the Django
    admin application.
    """
    raw_id_fields = (
        'transaction_type_id',
    )  # selects the list of fields to perform lookup on in the admin
    # application.


@admin.register(Portfolio)
class PortfolioAdmin(admin.ModelAdmin):
    """
    Django class to register the Product model with the Django
    admin application.
    """
    list_display = (
        'name',
        'description',
        'owner')  # lists the fields to display in the admin application
    # links the ProductDetailInLine class to this class as a child in the
    # admin application.
    inlines = (PortfolioDetailInLine,)
