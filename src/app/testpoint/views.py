from django.shortcuts import render
from django.http import HttpResponse

def index(request):
    return HttpResponse("Cool, so endpoints should be working!")

