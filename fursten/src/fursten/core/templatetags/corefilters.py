from django import template
from django.template.defaultfilters import stringfilter

register = template.Library()
print "hej"

@register.filter
@stringfilter
def label(value):
    return value.replace("_", " ").title()

@register.filter
def is_false(arg): 
    return arg is False