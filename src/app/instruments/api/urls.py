from django.urls import path
from . import views

app_name = 'instruments'

urlpatterns = [
    # Binds the endpoint `markets` to the MarketSummaryView.
    path(
        'markets',
        views.MarketSummaryView.as_view(),
        name='markets_list'),
    # Binds the endpoint `instruments` to the InstrumentSearchView.
    path(
        'instruments',
        views.InstrumentSearchView.as_view(),
        name='instrument_search_list'),
    # Binds the endpoint `instruments/<symbols>` to the InstrumentView.
    # A comma separated string of symbols is sent in as <symbols>.
    path(
        'instruments/<symbols>',
        views.InstrumentView.as_view(),
        name='instrument_list'),
    # Binds the endpoint `instruments/<symbol>/charts` to
    # the InstrumentChartsView.
    path(
        'instruments/<symbol>/charts',
        views.InstrumentChartsView.as_view(),
        name='instrument_charts_list'),
    # Binds the endpoint `instruments/<symbol>/chartsmulti` to
    # the InstrumentChartsMultiView.
    path(
        'instruments/<symbol>/chartsmulti',
        views.InstrumentChartsMultiView.as_view(),
        name='instrument_charts_multi_list'),
    # Binds the endpoint `instruments/<symbol>/company` to
    # the InstrumentCompanyView.
    path(
        'instruments/<symbol>/company',
        views.InstrumentCompanyView.as_view(),
        name='instrument_company_list'),
    # Binds the endpoint `instruments/<symbol>/financialstatements` to
    # the InstrumentFinancialStatementsView.
    path(
        'instruments/<symbol>/financialstatements',
        views.InstrumentFinancialStatementsView.as_view(),
        name='instrument_company_list'),
    # Binds the endpoint `instruments/<symbol>/news` to the
    # InstrumentNewsView.
    path(
        'instruments/<symbol>/news',
        views.InstrumentNewsView.as_view(),
        name='instrument_news_list'),
]
