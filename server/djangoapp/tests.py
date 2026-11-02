import json

from django.contrib.auth.models import User
from django.test import TestCase


class UserManagementViewsTests(TestCase):
    def setUp(self):
        self.user_data = {
            "userName": "labuser",
            "password": "test-password-123",
            "firstName": "Lab",
            "lastName": "User",
            "email": "labuser@example.com",
        }

    def post_json(self, path, data):
        return self.client.post(
            path,
            data=json.dumps(data),
            content_type="application/json",
        )

    def test_registration_creates_user_and_starts_session(self):
        response = self.post_json("/djangoapp/register", self.user_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["userName"], "labuser")
        self.assertEqual(response.json()["status"], "Authenticated")
        self.assertTrue(
            User.objects.get(username=self.user_data["userName"]).check_password(
                self.user_data["password"]
            )
        )
        self.assertEqual(
            int(self.client.session["_auth_user_id"]),
            User.objects.get(username=self.user_data["userName"]).pk,
        )

    def test_registration_rejects_duplicate_username(self):
        User.objects.create_user(
            username=self.user_data["userName"],
            password=self.user_data["password"],
        )

        response = self.post_json("/djangoapp/register", self.user_data)

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["userName"], "labuser")
        self.assertEqual(response.json()["error"], "Already Registered")

    def test_login_and_logout(self):
        User.objects.create_user(
            username=self.user_data["userName"],
            password=self.user_data["password"],
        )

        login_response = self.post_json(
            "/djangoapp/login",
            {
                "userName": self.user_data["userName"],
                "password": self.user_data["password"],
            },
        )
        self.assertEqual(login_response.status_code, 200)
        self.assertEqual(login_response.json()["userName"], "labuser")
        self.assertEqual(login_response.json()["status"], "Authenticated")

        logout_response = self.client.get("/djangoapp/logout")
        self.assertEqual(logout_response.status_code, 200)
        self.assertEqual(logout_response.json()["userName"], "")
        self.assertNotIn("_auth_user_id", self.client.session)

    def test_login_rejects_incorrect_password(self):
        User.objects.create_user(
            username=self.user_data["userName"],
            password=self.user_data["password"],
        )

        response = self.post_json(
            "/djangoapp/login",
            {"userName": self.user_data["userName"], "password": "incorrect"},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()["userName"], "labuser")
        self.assertNotIn("status", response.json())
