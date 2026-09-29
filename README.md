# Mensch ärgere Dich nicht – Online

Statische GitHub-Pages-Web-App für 2–6 Spieler. Die Verbindung läuft ohne eigenen Backend-Server über PeerJS (WebRTC/PeerJS-Signaling). GitHub Pages kann daher direkt als Hosting dienen.

## Veröffentlichung auf GitHub Pages

1. Alle Dateien in ein GitHub-Repository hochladen.
2. Repository → **Settings → Pages**.
3. Als Quelle den Branch `main` und `/ (root)` auswählen.
4. Die erzeugte `https://...github.io/.../`-Adresse öffnen.
5. Ein Spieler erstellt einen Raum und gibt den Raumcode an die anderen weiter.

## Enthaltene Regeln

- 2–6 Spieler.
- Farben: Rot, Gelb, Grün, Blau, Lila, Schwarz.
- Jeder Spieler wählt eine freie Farbe.
- Pro Farbe 4 Figuren.
- Eine Figur steht zu Beginn auf A, drei auf B.
- Der Startspieler wird per Zufall ausgewählt.
- Wenn ein Spieler keine Figur auf der Laufbahn hat, bekommt er bis zu 3 Würfe, um eine 6 zu würfeln (entsprechend dem gewünschten Regelset).
- Eine 6 erlaubt einen weiteren Wurf.
- Gegner auf dem Zielfeld werden zurück auf B gesetzt.
- Eigene Figuren dürfen nicht auf dasselbe Feld gezogen werden.
- Nach einer vollständigen Runde geht es in a–d der eigenen Farbe.
- Fremde Zielfelder können nicht betreten werden.

## Hinweis zur Regelquelle

Die aktuelle Schmidt-Spiele-Beschreibung bestätigt A als Startfeld, B als Warte-/Hausfelder und a–d als Zielfelder. Die „drei Versuche ohne Figur auf der Laufbahn“ werden in Regelübersichten als optionale Regel geführt; dieses Projekt aktiviert sie auf Wunsch des Auftraggebers.

## Technischer Hinweis

Für ein echtes öffentliches Produkt sollte ein eigener PeerServer bzw. ein eigener Signaling-Dienst eingesetzt werden. Die hier eingebundene PeerJS-Cloud-Verbindung ist für einen unkomplizierten GitHub-Pages-Prototyp gedacht.
