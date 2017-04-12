from django.shortcuts import render
from django.contrib.auth.decorators import login_required


@login_required()
def home(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'wms_map/home.html', context)

def help_file(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'wms_map/help_file.html', context)

def technical_file(request):
    """
    Controller for the app home page.
    """
    context = {}

    return render(request, 'wms_map/technical_file.html', context)

