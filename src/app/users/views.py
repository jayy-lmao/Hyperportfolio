from django.contrib.auth.models import Group
from django.shortcuts import render
from rest_framework.decorators import api_view, renderer_classes
from rest_framework.permissions import AllowAny
from rest_framework import renderers, response, schemas
from rest_framework import viewsets


# from users.models import User
from django.contrib.auth.models import User
from users.serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)

@api_view()
@renderer_classes([renderers.OpenAPIRenderer])
def schema_view(request):
    generator = schemas.SchemaGenerator(title='Stocks')
    schema = generator.get_schema(request)
    return response.Response(schema)
