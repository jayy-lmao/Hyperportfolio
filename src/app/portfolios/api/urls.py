from django.urls import path
from . import views

app_name = 'portfolios'

urlpatterns = [
    # Binds the endpoint `ownerportfolios` to the
    # OwnerPortfoliosSummarySymbolListView.
    path(
        'ownerportfolios/',
        views.OwnerPortfoliosSummarySymbolListView.as_view(),
        name='portfolio_summary_symbol_list'),
    # Binds the endpoint `portfolios` to the PortfolioListView.
    path(
        'portfolios/',
        views.PortfolioListView.as_view(),
        name='portfolio_list'),
    # Binds the endpoint `portfolios/<pk>` to the
    # PortfolioDetailListView. <PK> represents the primary key
    # value of the portfolio.
    path(
        'portfolios/<pk>/',
        views.PortfolioDetailListView.as_view(),
        name='portfolio_detail'),
    # Binds the endpoint `portfolios/<pk>/summaries` to the
    # PortfolioSummaryListView. <PK> represents the primary key
    # value of the portfolio.
    path(
        'portfolios/<pk>/summaries/',
        views.PortfolioSummaryListView.as_view(),
        name='portfolio_summary_list'),
    # Binds the endpoint `portfolios/<pk>/summaries/<symbol>`
    # to the PortfolioSummaryListDetailView.
    # <PK> represents the primary key value of the portfolio.
    path(
        'portfolios/<pk>/summaries/<symbol>/',
        views.PortfolioSummaryListDetailView.as_view(),
        name='portfolio_summary_detail'),
    # Binds the endpoint
    #  `portfolios/<pk>/summaries/<symbol>/transactions`
    # to the PortfolioTransactionListView.
    # <PK> represents the primary key value of the portfolio.
    path(
        'portfolios/<pk>/summaries/<symbol>/transactions/',
        views.PortfolioTransactionsListView.as_view(),
        name='portfolio_transactions_list'),
    # Binds the endpoint `transactiontypes` to the
    # TransactionTypeListView.
    path(
        'transactiontypes/',
        views.TransactionTypeListView.as_view(),
        name='transaction_type_list'),
]
