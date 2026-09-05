"""Luque Law backup of ~/.phone-harness/agent-workspace/agent_helpers.py

The live file is the one under ~/.phone-harness — phone-harness loads that
path, not this copy. Keep them in sync when helpers change. No Screen Time
codes belong here.
"""


def tap_icon(label, index=0):
    """Tap a Home-Screen app icon by its label.

    Learned: tapping the label text itself does NOT launch the app in the
    mirrored Home Screen — the tappable icon is ~35 points above the label.
    Verified against Weather (label tap: no-op; icon tap: launches).
    """
    from phone_harness.helpers import find_text, tap
    hits = find_text(label)
    if not hits:
        raise RuntimeError(f"no Home-Screen label matching {label!r}")
    h = hits[index]
    tap(h["x"], h["y"] - 35)
    return h


def nav_back():
    """Tap the iOS back chevron on the navigation title row.

    Learned: chevron is window.x+36 at the title's y (often ~194), not the
    status bar. +22 misses WhatsApp. Status-bar taps hit the clock or Home.
    """
    from phone_harness.helpers import ocr, screen_info, tap

    w = screen_info()["window"]
    titles = [
        b
        for b in ocr()
        if b.get("confidence", 1) > 0.3
        and b.get("y", 0) < w["y"] + 140
        and b.get("y", 0) > w["y"] + 80
    ]
    y = titles[0]["y"] if titles else 194
    # +22 is Settings. WhatsApp's chevron is a bit inward; +36 still hits Settings.
    tap(w["x"] + 36, y)


def settings_search_bar():
    """Tap the bottom Settings search pill, not the Search settings row.

    Learned: tap_text("Search") opens Settings → Search (the feature), not
    the filter field. The live pill OCRs as "Q Search" / "Search" near
    y ≈ window.y + window.h - 50.
    """
    from phone_harness.helpers import ocr, screen_info, tap

    w = screen_info()["window"]
    pills = [
        b
        for b in ocr()
        if b.get("confidence", 1) > 0.3
        and b.get("y", 0) > w["y"] + w["h"] - 80
        and "Search" in (b.get("text") or "")
    ]
    if pills:
        tap(pills[0]["x"], pills[0]["y"])
        return pills[0]
    tap(w["x"] + 80, w["y"] + w["h"] - 48)
    return None


def dismiss_sheet():
    """Tap the top-right circular X on an iOS sheet (Screen Time passcode, etc.)."""
    from phone_harness.helpers import screen_info, tap

    w = screen_info()["window"]
    tap(w["x"] + w["w"] - 22, 194)


def tap_exact(label, pick="first"):
    """Tap an OCR box whose text equals `label` (not a substring).

    Learned: tap_text("Stop Using") hits the SIWA dialog title
    "Stop Using Sign in…" and the confirm never fires. pick="last" is the
    lowest box on screen — the red button.
    """
    from phone_harness.helpers import ocr, tap

    hits = [
        b
        for b in ocr()
        if b.get("confidence", 1) > 0.3 and (b.get("text") or "") == label
    ]
    if not hits:
        raise RuntimeError(f"no exact {label!r}")
    b = max(hits, key=lambda x: x["y"]) if pick == "last" else hits[0]
    tap(b["x"], b["y"])
    return b
