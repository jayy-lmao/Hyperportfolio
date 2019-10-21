from rest_framework import serializers
from ..models import WatchList, WatchListDetail


class WatchListSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the WatchList model for use with the REST api framework.
    """
    class Meta:
        model = WatchList
        fields = (
            'id',
            'owner',
            'name',
            'description',
            'date_created',
            'date_modified',
        )
        read_only_fields = ('owner',)


class WatchListDetailSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the WatchListDetail model for use with the REST api framework.
    """
    class Meta:
        model = WatchListDetail
        fields = (
            'id',
            'watchlist_id',
            'symbol',
            'date_created',
            'date_modified',
        )


class WatchListWithDetailsSerializer(serializers.ModelSerializer):
    """
    Django class to enable object serialization and deserialization
    of the WatchList model for use with the REST api framework. This
    version includes the WatchListDetailSeriealizer as a child
    serializer.
    """
    watchlist_details = WatchListDetailSerializer(many=True, read_only=False)

    class Meta:
        model = WatchList
        fields = (
            'id',
            'name',
            'description',
            'date_created',
            'date_modified',
            'watchlist_details',
        )
