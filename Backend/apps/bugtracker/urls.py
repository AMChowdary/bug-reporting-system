# apps/bugtracker/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ProjectViewSet, IssueViewSet, CommentListCreateView
from rest_framework_nested import routers

router = DefaultRouter()
router.register(r"projects", ProjectViewSet, basename="projects")

# Use nested router for project issues
from rest_framework_nested.routers import NestedDefaultRouter

projects_router = NestedDefaultRouter(router, r"projects", lookup="project")
projects_router.register(r"issues", IssueViewSet, basename="project-issues")

# Non-nested issues endpoint (for PATCH /issues/<id>/)
from rest_framework import routers
from django.urls import re_path

# Add non-nested issues endpoint for PATCH /issues/<id>/
issue_list = IssueViewSet.as_view({"get": "list"})
issue_detail = IssueViewSet.as_view({"get": "retrieve", "patch": "partial_update"})

urlpatterns = [
    path("", include(router.urls)),
    path("", include(projects_router.urls)),
    # patch/update issue by id
    path("issues/<int:pk>/", issue_detail, name="issue-detail"),
    # comments under an issue
    path("issues/<int:issue_pk>/comments/", CommentListCreateView.as_view(), name="issue-comments"),
]
