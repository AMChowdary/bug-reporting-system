# apps/bugtracker/views.py
from rest_framework import viewsets, generics, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Project, Issue, Comment
from .serializers import ProjectSerializer, IssueSerializer, CommentSerializer
from .permissions import IsReporterOrAssigneeOrReadOnly
from rest_framework import filters

from django.db.models import Prefetch

class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all().order_by("-created_at")
    serializer_class = ProjectSerializer
    permission_classes = []  # allow anyone to view projects; creation requires auth in create()

    def get_permissions(self):
        if self.action in ["create"]:
            return [IsAuthenticated()]
        return super().get_permissions()

class IssueViewSet(viewsets.ModelViewSet):
    serializer_class = IssueSerializer
    permission_classes = [IsReporterOrAssigneeOrReadOnly]

    def get_queryset(self):
        qs = Issue.objects.select_related("project", "reporter", "assignee")
        project_id = self.kwargs.get("project_pk")
        if project_id:
            qs = qs.filter(project_id=project_id)

        # filters
        status = self.request.query_params.get("status")
        priority = self.request.query_params.get("priority")
        search = self.request.query_params.get("search")

        if status:
            qs = qs.filter(status=status)
        if priority:
            qs = qs.filter(priority=priority)
        if search:
            qs = qs.filter(title__icontains=search) | qs.filter(description__icontains=search)

        return qs.order_by("-created_at")

    def perform_create(self, serializer):
        project_pk = self.kwargs.get("project_pk")
        project = get_object_or_404(Project, pk=project_pk)
        serializer.save(reporter=self.request.user, project=project)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)



class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ["content", "author__username"]

    def get_queryset(self):
        issue_pk = self.kwargs.get("issue_pk")
        return (
            Comment.objects.filter(issue_id=issue_pk)
            .select_related("author")
            .order_by("created_at")
        )

    def perform_create(self, serializer):
        issue_pk = self.kwargs.get("issue_pk")
        issue = get_object_or_404(Issue, pk=issue_pk)
        serializer.save(author=self.request.user, issue=issue)

