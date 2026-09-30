# Mensch ärgere Dich nicht – Online

Statische GitHub-Pages-Version für 2–6 Spieler.

## Start
1. Dateien in ein GitHub-Repository laden.
2. GitHub → Settings → Pages → Deploy from branch → `main` / `/ (root)`.
3. Die Seite öffnen.

## Online-Spiel
- Ein Spieler erstellt einen Raum.
- Der Raumcode wird an die anderen Spieler weitergegeben.
- Nach dem Beitritt erscheint das Brett sofort.
- Ab 2 Spielern wird beim Host „Spiel starten“ aktiv.
- Der Startspieler wird zufällig bestimmt.
- Würfelwürfe werden als gemeinsamer Spielzustand an alle verbundenen Spieler übertragen.

## Vorlage
`board-template.svg` ist die vom Nutzer bereitgestellte SVG-Vorlage und wird unverändert als sichtbares Brett verwendet. Die Spielfiguren werden darüber gelegt.

Hinweis: Die PeerJS-Verbindung benötigt eine funktionierende Internetverbindung und kann je nach Netzwerk/NAT eingeschränkt sein.
