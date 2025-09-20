# apps/bugtracker/permissions.py
from rest_framework import permissions

class IsReporterOrAssigneeOrReadOnly(permissions.BasePermission):
    """
    Allow updates only to reporter or assignee. Read-only for others.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions for safe methods
        if request.method in permissions.SAFE_METHODS:
            return True

        # Only reporter or assignee can modify
        user = request.user
        return user and user.is_authenticated and (obj.reporter == user or obj.assignee == user)
