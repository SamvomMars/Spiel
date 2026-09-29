# Mensch ärgere Dich nicht – Online

Statische GitHub-Pages-App für 2–6 Spieler. PeerJS Cloud übernimmt die Signalisierung; die Spielzustände werden per WebRTC zwischen den Browsern übertragen.

## GitHub Pages
1. Alle Dateien ins Repository-Root laden.
2. Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
3. Die erzeugte HTTPS-Seite öffnen.

## Wichtig
Der Raumcode ist nicht direkt die Peer-ID: intern wird daraus `maedn-<code>` gebildet. Dadurch stimmen sichtbarer Raumcode und PeerJS-Verbindungsadresse zuverlässig überein. PeerJS benötigt einen Signaling-Server; standardmäßig kann PeerJS Cloud verwendet werden.
