from rest_framework import viewsets
from rest_framework.decorators import action
from .serializers import (WatchListDetailSerializer, WatchListSerializer,
                          WatchListWithDetailsSerializer)
from ..models import WatchList, WatchListDetail


class WatchListViewSet(viewsets.ModelViewSet):
    """
    Django class to establish a Retrieve, Create, Update and Delete
    view for watchlists (ModelViewSets automatically generate all four)
    for use in a REST API endpoint.
    """
    serializer_class = WatchListSerializer

    def get_queryset(self):
        """
        Determines the queryset to use based on whether the user is
        a superuser or not. If the user is a superuser (admin), then
        all watchlists are returned, otherwise only the watchlists
        that are owned by the user are returned.
        """
        if self.request.user.is_superuser:
            return WatchList.objects.all()
        else:
            return WatchList.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Overriding this method to make the view set the owner of
        the repository to the logged on user when creating a
        new watchlist.
        """
        serializer.save(owner=self.request.user)

    @action(methods=['get'],
            detail=True,
            serializer_class=WatchListWithDetailsSerializer)
    def details(self, request, *args, **kwargs):
        """
        Provides an extra endpoint `/details/` to the existing
        endpoint to get the detail levels of the watchlist.
        E.g. `api/watchlists/1/details`.
        """
        return self.retrieve(request, *args, **kwargs)


class WatchListDetailViewSet(viewsets.ModelViewSet):
    """
    Django class to establish a Retrieve, Create, Update and Delete
    view for watchlist details (ModelViewSets automatically generate
    all four) for use in a REST API endpoint.
    """
    serializer_class = WatchListDetailSerializer

    def get_queryset(self):
        """
        Determines the queryset to use based on whether the user is
        a superuser or not. If the user is a superuser (admin), then
        all watchlists are returned, otherwise only the watchlists
        details that are owned by the user are returned.
        """
        if self.request.user.is_superuser:
            return WatchListDetail.objects.all()
        else:
            return WatchListDetail.objects.filter(
                watchlist_id__owner=self.request.user)
