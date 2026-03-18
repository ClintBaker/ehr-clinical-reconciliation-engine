from backend.services.cache import SimpleCache


def test_cache_set_and_get() -> None:
    cache = SimpleCache()
    cache.set("key", "value", ttl_seconds=60)
    assert cache.get("key") == "value"


def test_cache_expiration() -> None:
    cache = SimpleCache()
    cache.set("key", "value", ttl_seconds=0)
    assert cache.get("key") is None

