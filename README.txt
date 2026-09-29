# Mensch ärgere Dich nicht – Online

Eine kostenlose, statisch hostbare Multiplayer-Version für 2–6 Personen.

## Dateien
- `index.html` – Oberfläche
- `style.css` – klassisches Spielbrett-Design
- `app.js` – Spiellogik + Multiplayer

## Kostenlos online stellen
Die Seite benötigt keinen eigenen Backend-Server. Die Browser verbinden sich über PeerJS/WebRTC; die Website selbst kann auf einem kostenlosen statischen Hoster liegen.

Geeignet sind z. B.:
- GitHub Pages
- Netlify
- Cloudflare Pages

Lade alle drei Dateien in ein öffentliches Website-Projekt hoch. `index.html` muss im Webroot liegen.

## Spielen
1. Eine Person klickt „Raum erstellen“.
2. Den 6-stelligen Raumcode an die anderen senden.
3. Die anderen geben den Code unter „Spiel beitreten“ ein.
4. Ab 2 Spielern kann der Spielleiter starten.
5. Bis zu 6 Personen können teilnehmen.

## Wichtiger technischer Hinweis
Die aktuelle Version verwendet den öffentlichen PeerJS-Signalisierungsdienst und WebRTC. Dadurch ist kein eigener Server notwendig. Für eine langfristig vollständig unabhängige Produktion kann später ein eigener kostenloser Signalisierungs-/WebSocket-Dienst ergänzt werden.

## Selbsttest
Getestet wurden:
- 40 eindeutige Rundkursfelder
- 6 Spielerfarben
- 4 Figuren pro Spieler
- Haus → Start mit 6
- Bewegungsgrenze und Zielbereich
- Schlagen gegnerischer Figuren
- Zusatzwurf bei 6
- Sieg nach vier Figuren im Ziel
- Host-/Gast-Nachrichtenstruktur
- HTML/CSS/JavaScript-Dateistruktur

Hinweis: Für eine echte Online-Partie müssen Browser WebRTC-Verbindungen zulassen und der externe PeerJS-Dienst erreichbar sein.
