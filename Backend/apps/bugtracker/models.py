# apps/bugtracker/models.py
from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL

class Project(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Issue(models.Model):
    STATUS_CHOICES = [
        ("Open", "Open"),
        ("In Progress", "In Progress"),
        ("Closed", "Closed"),
    ]
    PRIORITY_CHOICES = [
        ("LOW", "Low"),
        ("MEDIUM", "Medium"),
        ("HIGH", "High"),
    ]
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default="MEDIUM")

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="open")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="issues")
    reporter = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="reported_issues")
    assignee = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="assigned_issues")

    def __str__(self):
        return f"{self.title} ({self.project})"

class Comment(models.Model):
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    issue = models.ForeignKey(Issue, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="comments")

    def __str__(self):
        return f"Comment by {self.author} on {self.issue}"
