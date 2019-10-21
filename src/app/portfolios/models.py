from django.contrib.auth.models import User
from django.db import models


class Portfolio(models.Model):
    """
    Django class to declare a model which maps to a database table
    called portolios_portolio (which it will create if it doesn't
    exist). The variables below are the user defined fields that it
    will create. This model represents portfolio header information.
    """
    owner = models.ForeignKey(User,
                              on_delete=models.CASCADE,
                              related_name="portfolio_owned_by")
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("name",)
        unique_together = (('name', 'owner'),)

    def __str__(self):
        return self.name


class TransactionType(models.Model):
    """
    Django class to declare a model which maps to a database table
    called portolios_transactiontype (which it will create if it
    doesn't exist). The variables below are the user defined fields
    that it will create. This model represents the type of transactions
    that can be made with a portfolio e.g. BUY/SELL.
    """
    code = models.CharField(max_length=5, unique=True)
    description = models.CharField(max_length=10)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("code",)


class PortfolioDetail(models.Model):
    """
    Django class to declare a model which maps to a database table
    called portolios_portoliodetail (which it will create if it doesn't
    exist). The variables below are the user defined fields that it
    will create. This model represents portfolio transaction information.
    """
    portfolio_id = models.ForeignKey(Portfolio,
                                     on_delete=models.CASCADE,
                                     related_name="portfolio_details")
    symbol = models.CharField(max_length=20)
    transaction_type_id = models.ForeignKey(
        TransactionType,
        on_delete=models.CASCADE,
        related_name="portfolio_detail_trans")
    transaction_date = models.DateTimeField()
    units = models.DecimalField(max_digits=20, decimal_places=10)
    price = models.DecimalField(max_digits=20, decimal_places=10)
    date_created = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ("symbol", "-transaction_date",)


class PortfolioSummary(models.Model):
    """
    Django class to declare a model which maps to a database view
    called vw_portfolios_summary (as can be seen in the 'db_table'
    field of the Meta class below). The variables below are the user
    fields that it will map to. This model represents each portfolio's
    value by symbol (stock code).
    """
    id = models.BigIntegerField(primary_key=True)
    portfolio_id = models.ForeignKey(Portfolio,
                                     on_delete=models.DO_NOTHING,
                                     related_name="portfolio_summary")
    symbol = models.CharField(max_length=20)
    units = models.DecimalField(max_digits=20, decimal_places=10)
    value = models.DecimalField(max_digits=20, decimal_places=10)
    average_price = models.DecimalField(max_digits=20, decimal_places=10)

    class Meta:
        managed = False
        db_table = 'vw_portfolios_summary'


class OwnerPortfoliosSummary(models.Model):
    """
    Django class to declare a model which maps to a database view
    called vw_owner_portfolios_summary (as can be seen in the 'db_table'
    field of the Meta class below). The variables below are the user
    fields that it will map to. This model represents each portfolio's
    total value along with the header information such
    as portfolio name, description and owner.
    """
    id = models.BigIntegerField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    owner = models.ForeignKey(User,
                              on_delete=models.DO_NOTHING,
                              related_name="portfolios_summary_owned_by")
    units = models.DecimalField(max_digits=20, decimal_places=10)
    value = models.DecimalField(max_digits=20, decimal_places=10)
    average_price = models.DecimalField(max_digits=20, decimal_places=10)
    latest_transaction_date = models.DateTimeField()
    date_created = models.DateTimeField()
    date_modified = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'vw_owner_portfolios_summary'


class OwnerPortfoliosSummarySymbol(models.Model):
    """
    Django class to declare a model which maps to a database view
    called vw_owner_portfolios_summary_symbols (as can be seen in the
    'db_table' field of the Meta class below). The variables below are
    the user fields that it will map to. This model represents each
    portfolio's total value by symbol along with the header information
    such as portfolio name, description and owner.
    """
    owner = models.ForeignKey(
        User,
        on_delete=models.DO_NOTHING,
        related_name="portfolios_summary_symbol_owned_by")
    portfolio_id = models.ForeignKey(Portfolio,
                                     on_delete=models.DO_NOTHING,
                                     related_name="portfolio_summary_symbol")
    symbol = models.CharField(max_length=20)
    units = models.DecimalField(max_digits=20, decimal_places=10)
    value = models.DecimalField(max_digits=20, decimal_places=10)
    average_price = models.DecimalField(max_digits=20, decimal_places=10)
    latest_transaction_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'vw_owner_portfolios_summary_symbols'
