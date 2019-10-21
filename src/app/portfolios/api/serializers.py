from rest_framework import serializers
from ..models import (
    OwnerPortfoliosSummary,
    OwnerPortfoliosSummarySymbol,
    Portfolio,
    PortfolioDetail,
    PortfolioSummary,
    TransactionType)


class PortfolioSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the Portfolio model for use with the REST api framework.
    """
    class Meta:
        model = Portfolio
        fields = (
            'id',
            'owner',
            'name',
            'description',
            'date_created',
            'date_modified',
        )
        read_only_fields = ('owner',)


class PortfolioDetailSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the PortfolioDetail model for use with the REST api framework.
    """
    class Meta:
        model = PortfolioDetail
        fields = (
            'id',
            'portfolio_id',
            'symbol',
            'transaction_type_id',
            'transaction_date',
            'units',
            'price',
            'date_created',
            'date_modified',
        )


class PortfolioSummarySerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the Portfolio model for use with the REST api framework.
    """
    class Meta:
        model = PortfolioSummary
        fields = (
            'id',
            'portfolio_id',
            'symbol',
            'units',
            'value',
            'average_price',
        )


class OwnerPortfoliosSummarySerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the OwnerPortfoliosSummary model for use with the REST api
    framework.
    """
    class Meta:
        model = OwnerPortfoliosSummary
        fields = '__all__'
        read_only_fields = (
            'owner',
            'units',
            'value',
            'average_price',
            'latest_transaction_date',
        )


class OwnerPortfoliosSummarySymbolSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the OwnerPortfoliosSummarySymbol model for use with the REST api
    framework.
    """
    class Meta:
        model = OwnerPortfoliosSummarySymbol
        fields = '__all__'
        read_only_fields = (
            'owner',
            'portfolio_id',
            'symbol',
            'units',
            'value',
            'average_price',
            'latest_transaction_date',
        )


class TransactionTypeSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the TransactionType model for use with the REST api framework.
    """
    class Meta:
        model = TransactionType
        fields = (
            'id',
            'code',
            'description',
            'date_created',
            'date_modified',
        )
