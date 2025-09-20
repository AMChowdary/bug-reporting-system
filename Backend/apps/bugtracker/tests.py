from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from .models import Project, Issue, Comment

User = get_user_model()


class BugTrackerTests(APITestCase):
    def setUp(self):
        # Create users
        self.user1 = User.objects.create_user(username="alice", password="testpass123")
        self.user2 = User.objects.create_user(username="bob", password="testpass123")

        # Login as user1
        self.client = APIClient()
        login_url = reverse("token_obtain_pair")
        response = self.client.post(login_url, {"username": "alice", "password": "testpass123"}, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.token = response.data["access"]
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {self.token}")

        # Create a project
        self.project = Project.objects.create(name="Test Project", description="Demo project")

    def test_create_project(self):
        url = reverse("projects-list")  # /api/projects/
        data = {"name": "Another Project", "description": "New one"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Project.objects.count(), 2)

    def test_create_issue(self):
        url = reverse("project-issues-list", kwargs={"project_pk": self.project.pk})
        data = {"title": "Bug in login", "description": "Steps...", "priority": "high"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Issue.objects.count(), 1)
        issue = Issue.objects.first()
        self.assertEqual(issue.reporter, self.user1)

    def test_update_issue_status_by_reporter(self):
        issue = Issue.objects.create(
            title="UI Bug",
            description="Navbar broken",
            priority="medium",
            project=self.project,
            reporter=self.user1,
        )
        url = reverse("issue-detail", kwargs={"pk": issue.pk})
        data = {"status": "in_progress"}
        response = self.client.patch(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        issue.refresh_from_db()
        self.assertEqual(issue.status, "in_progress")

    def test_add_comment(self):
        issue = Issue.objects.create(
            title="Crash bug",
            description="App crashes",
            priority="high",
            project=self.project,
            reporter=self.user1,
        )
        url = reverse("issue-comments", kwargs={"issue_pk": issue.pk})
        data = {"content": "Looking into this now"}
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Comment.objects.count(), 1)
        comment = Comment.objects.first()
        self.assertEqual(comment.author, self.user1)
