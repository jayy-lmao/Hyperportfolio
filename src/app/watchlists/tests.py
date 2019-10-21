from django.apps import apps
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.test import TestCase

WatchList = apps.get_model('watchlists', 'WatchList')
WatchListDetail = apps.get_model('watchlists', 'WatchListDetail')

User = apps.get_model('auth', 'User')


class WatchListCreationTestCase(TestCase):
    def setUp(self):
        User.objects.create(
            email="tester@hyperportfol.io",
            password="test",
            username='Tester',
            first_name="Tester",
            last_name="Test")
        user = User.objects.get(email="tester@hyperportfol.io")

        WatchList.objects.create(name="Test", description="Test", owner=user)

    def test_string_representation(self):
        result = WatchList.objects.get(name="Test")
        self.assertEquals(str(result), "Test")

    def test_watch_list_creation(self):
        """
        Expected: WatchList correctly adds a watchlist named 'Test' with
        description 'Test'
        """
        result = WatchList.objects.get(name='Test')
        self.assertEqual(result.name, 'Test')

    def test_watch_list_duplicate_creation(self):
        """
        Expected: Adding 'Test' again raises a database
        integrity exception
        """
        user = User.objects.get(email="tester@hyperportfol.io")

        with self.assertRaises(IntegrityError):
            WatchList.objects.create(
                name="Test", description="Test", owner=user)

    def test_watch_list_add_empty_watch_list(self):
        """Expected: Raises a database integrity exception"""

        with self.assertRaises(IntegrityError):
            WatchList.objects.create()


class WatchListModificationTestCase(TestCase):
    def setUp(self):
        User.objects.create(
            email="tester@hyperportfol.io",
            password="test",
            username='tester',
            first_name="Tester",
            last_name="Test")
        User.objects.create(
            email="tester2@hyperportfol.io",
            password="test",
            username='tester2',
            first_name="Tester2",
            last_name="Test")

        user = User.objects.get(email="tester@hyperportfol.io")
        WatchList.objects.create(name="Test", description="Test", owner=user)

        user = User.objects.get(email="tester2@hyperportfol.io")
        WatchList.objects.create(name="New", description="New", owner=user)
        WatchList.objects.create(name="New2", description="New2", owner=user)

    def test_watch_list_modification(self):
        """
        Expected: WatchList correctly changes watch list named 'Test'
        with description 'Test' with owner 'tester@hyperportfol.io' to
        new name 'Tested', description 'Tested Desc' and owner
        'tester2@hyperportfol.io'
        """
        original_result = WatchList.objects.get(name='Test')
        original_owner = User.objects.get(email="tester@hyperportfol.io")
        new_owner = User.objects.get(email="tester@hyperportfol.io")

        test = original_result
        self.assertEqual(original_result.name, 'Test')
        test.name = "Tested"
        test.description = "Tested Desc"
        test.owner = new_owner
        test.save()
        result = WatchList.objects.get(name='Tested')
        self.assertEqual(result.name, 'Tested')
        self.assertEqual(result.description, 'Tested Desc')
        self.assertEqual(result.owner, new_owner)
        self.assertEqual(test.id, result.id)

    def test_watch_list_duplicate_modification(self):
        """
        Expected: Updating the name of the watch list 'New2' to 'New'
        (which exists) for Tester2, raises a database integrity error
        """
        original_result = WatchList.objects.get(name='New2')

        with self.assertRaises(IntegrityError):
            test = original_result
            test.name = 'New'
            test.save()


class WatchListDeletionTestCase(TestCase):
    def setUp(self):
        User.objects.create(
            email="tester@hyperportfol.io",
            password="test",
            username='Tester',
            first_name="Tester",
            last_name="Test")
        user = User.objects.get(email="tester@hyperportfol.io")

        WatchList.objects.create(name="Test", description="Test", owner=user)

    def test_watch_list_deletion(self):
        """
        Expected: Deleting the watch list named 'Test' succeeds
        """
        with self.assertRaises(ObjectDoesNotExist):
            test = WatchList.objects.get(name="Test")
            test.delete()
            result = WatchList.objects.get(name="Test")


class WatchListDetailCreation(TestCase):
    def setUp(self):
        User.objects.create(
            email="tester@hyperportfol.io",
            password="test",
            username='Tester',
            first_name="Tester",
            last_name="Test")
        user = User.objects.get(email="tester@hyperportfol.io")

        WatchList.objects.create(name="Test", description="Test", owner=user)

    def test_watch_list_deletion(self):
        """
        Expected: Deletion of the watch list named 'Test' should also
        delete the watch list details
        """
        watchlist = WatchList.objects.get(name="Test")
        watchlist.delete()

        with self.assertRaises(ObjectDoesNotExist):
            result = WatchListDetail.objects.get(watchlist_id=watchlist)
