from django.urls import path, include
from rest_framework import routers
from rest_framework_simplejwt import views as jwt_views
from users import views as auth_views
from users.views import UserViewSet
from instruments.api import views as instrument_views
from portfolios.api import views as portfolio_views
from watchlists.api import views as watchlist_views

router = routers.DefaultRouter() # declares a router to route the REST endpoints

# Registers the endpoint `portfoliotransactions` for the
# PortfolioTransactionsViewSet ModelViewSet.
router.register(
    'portfoliotransactions',
    portfolio_views.PortfolioTransactionsViewSet,
    base_name='portfoliotransactions')

# Registers the endpoint `watchlistdetails` for the
# WatchListDetailViewSet ModelViewSet.
router.register(
    'watchlistdetails',
    watchlist_views.WatchListDetailViewSet,
    base_name='watchlistdetails')

# Registers the endpoint `watchlists` for the
# WatchListViewSet ModelViewSet.
router.register(
    'watchlists',
    watchlist_views.WatchListViewSet,
    base_name='watchlists')

# Registers the endpoint `users` for the built in
# Django users UserViewSet.
router.register('users', UserViewSet, base_name='users')
