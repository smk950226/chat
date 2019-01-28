from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return self.user.username

    def last_10_messages():
        return Message.objects.order_by('-timestamp').all()[:10]