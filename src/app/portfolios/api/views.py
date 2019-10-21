from rest_framework import generics, viewsets
from rest_framework.permissions import AllowAny
from ..models import (
    OwnerPortfoliosSummary,
    OwnerPortfoliosSummarySymbol,
    Portfolio,
    PortfolioDetail,
    PortfolioSummary,
    TransactionType)
from .serializers import (
    OwnerPortfoliosSummarySerializer,
    OwnerPortfoliosSummarySymbolSerializer,
    PortfolioDetailSerializer,
    PortfolioSerializer,
    PortfolioSummarySerializer,
    TransactionTypeSerializer)


class PortfolioListView(generics.ListCreateAPIView):
    """
    Django class to establish a Retrieve and Create view for portfolios
    for use in a REST API endpoint.
    """
    def get_serializer_class(self):
        """
        Determines the serializer to use based on the request made. 
        If the request method is GET then it uses the 
        OwnerPortfoliosSummarySerializer otherwise it uses the
        PortfolioSerializer.
        """
        if self.request.method == 'GET':
            return OwnerPortfoliosSummarySerializer
        else:
            return PortfolioSerializer

    def get_queryset(self):
        """
        Determines the queryset to use based on the request made.
        If the request method is GET then it uses the 
        OwnerPortfoliosSummary model otherwise it uses the
        Portfolio model. It filters these by the logged on user.
        """
        if self.request.method == 'GET':
            return OwnerPortfoliosSummary.objects.filter(
                owner=self.request.user)
        else:
            return Portfolio.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        """
        Overriding this method to make the view set the owner of
        the repository to the logged on user when creating a 
        new portfolio.
        """
        serializer.save(owner=self.request.user)


class PortfolioDetailListView(generics.RetrieveUpdateDestroyAPIView):
    def get_serializer_class(self):
        """
        Determines the serializer to use based on the request made. 
        If the request method is GET then it uses the 
        OwnerPortfoliosSummarySerializer otherwise it uses the
        PortfolioSerializer.
        """
        if self.request.method == 'GET':
            return OwnerPortfoliosSummarySerializer
        else:
            return PortfolioSerializer

    def get_queryset(self):
        """
        Determines the queryset to use based on the request made.
        If the request method is GET then it uses the 
        OwnerPortfoliosSummary model otherwise it uses the
        Portfolio model. It filters these by the logged on user as
        well as the primary key 'pk' of the portfolio, supplied to
        it by URL path.
        """
        if self.request.method == 'GET':
            return (
                OwnerPortfoliosSummary.objects.filter(owner=self.request.user)
                .filter(id=self.kwargs['pk'])
            )
        else:
            return (
                Portfolio.objects.filter(owner=self.request.user)
                                 .filter(id=self.kwargs['pk'])
            )


class PortfolioSummaryListView(generics.ListAPIView):
    serializer_class = PortfolioSummarySerializer

    def get_queryset(self):
        return (
            PortfolioSummary.objects.filter(
                portfolio_id__owner=self.request.user) .filter(
                portfolio_id=self.kwargs['pk']))


class PortfolioSummaryListDetailView(generics.ListAPIView):
    serializer_class = PortfolioSummarySerializer

    def get_queryset(self):
        return (
            PortfolioSummary.objects.filter(
                portfolio_id__owner=self.request.user) .filter(
                portfolio_id=self.kwargs['pk']) .filter(
                symbol=self.kwargs['symbol']))


class PortfolioTransactionsListView(generics.ListCreateAPIView):
    serializer_class = PortfolioDetailSerializer

    def get_queryset(self):
        return (
            PortfolioDetail.objects.filter(
                portfolio_id__owner=self.request.user) .filter(
                portfolio_id=self.kwargs['pk']) .filter(
                symbol=self.kwargs['symbol']))


class PortfolioTransactionsViewSet(viewsets.ModelViewSet):
    serializer_class = PortfolioDetailSerializer

    def get_queryset(self):
        return PortfolioDetail.objects.filter(
            portfolio_id__owner=self.request.user)


class OwnerPortfoliosSummarySymbolListView(generics.ListAPIView):
    serializer_class = OwnerPortfoliosSummarySymbolSerializer

    def get_queryset(self):
        return OwnerPortfoliosSummarySymbol.objects.filter(
            owner=self.request.user)


class TransactionTypeListView(generics.ListAPIView):
    serializer_class = TransactionTypeSerializer
    queryset = TransactionType.objects.all()
