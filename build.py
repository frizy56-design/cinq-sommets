"""Construit le site dans dist/ : index.html, app.js et les fichiers de public/.

Usage : python build.py
"""
import hashlib
import json
import shutil
from pathlib import Path

ROOT = Path(__file__).parent
SRC = ROOT / "src"
DIST = ROOT / "dist"

CONTENT = ["vente", "ecriture", "psycho", "marketing", "argent", "patches", "missions", "roleplay"]


def read(p: Path) -> str:
    return p.read_text(encoding="utf-8")


def build() -> None:
    if DIST.exists():
        shutil.rmtree(DIST)
    shutil.copytree(ROOT / "public", DIST)

    content = "\n".join(read(SRC / "content" / f"{n}.js") for n in CONTENT)
    engine = "\n".join(read(f) for f in sorted((SRC / "engine").glob("*.js")))
    platform = read(SRC / "web" / "platform.js")
    app = (
        content
        + "\nwindow.__startGame = function () {\n"
        + engine
        + "\n};\n"
        + platform
    )
    version = hashlib.sha256((app + read(SRC / "shell.html") + read(SRC / "web" / "site.css")).encode()).hexdigest()[:10]
    (DIST / "app.js").write_text(app, encoding="utf-8")

    shell = read(SRC / "shell.html")
    head, sep, body = shell.partition('<div id="app">')
    if not sep:
        raise SystemExit("shell.html : <div id=\"app\"> introuvable")
    site_css = read(SRC / "web" / "site.css")
    html = f"""<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="description" content="Cinq compétences, quelques minutes par jour : vendre, écrire, comprendre les gens, marketer, faire fructifier son argent.">
<meta name="theme-color" content="#E4571F">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Cinq Sommets">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<link rel="manifest" href="manifest.webmanifest">
<link rel="icon" type="image/png" href="icons/icon-192.png">
<link rel="apple-touch-icon" href="icons/apple-touch-icon.png">
{head.strip()}
<style>
{site_css}
</style>
</head>
<body>
<div id="login" class="login" aria-live="polite"></div>
<div id="app" hidden>{body}
<script src="config.js?v={version}"></script>
<script src="vendor/supabase.min.js?v={version}"></script>
<script src="app.js?v={version}"></script>
</body>
</html>
"""
    (DIST / "index.html").write_text(html, encoding="utf-8")

    precache = ["./", "./index.html", f"./app.js?v={version}", f"./config.js?v={version}", f"./vendor/supabase.min.js?v={version}",
                "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/badge-72.png"]
    sw = read(DIST / "sw.js").replace("__VERSION__", version).replace("__PRECACHE__", json.dumps(precache))
    (DIST / "sw.js").write_text(sw, encoding="utf-8")
    (DIST / ".nojekyll").write_text("", encoding="utf-8")
    print(f"dist/ prêt · version {version} · app.js {len(app.encode()) // 1024} Ko")


if __name__ == "__main__":
    build()
