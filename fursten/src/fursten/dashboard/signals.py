from django.dispatch import Signal

initialize = Signal(providing_args=["page", "request", "user",])
user_login = Signal(providing_args=["request", "user"])
