# apps/bugtracker/serializers.py
from rest_framework import serializers
from .models import Project, Issue, Comment
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSimpleSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name"]

class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description", "created_at"]

class IssueSerializer(serializers.ModelSerializer):
    reporter = UserSimpleSerializer(read_only=True)
    assignee = UserSimpleSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assignee",
        write_only=True,
        required=False,
        allow_null=True,
    )

    class Meta:
        model = Issue
        fields = [
            "id", "title", "description", "status", "priority",
            "created_at", "updated_at", "project", "reporter",
            "assignee", "assignee_id",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "reporter", "assignee", "project"]  # 👈 added "project"


class CommentSerializer(serializers.ModelSerializer):
    author = UserSimpleSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "content", "created_at", "issue", "author"]
        read_only_fields = ["id", "created_at", "author", "issue"]  # 👈 added "issue"
