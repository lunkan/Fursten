from django import forms

class ResourceForm(forms.Form):
    name = forms.CharField(max_length=30)