# Mensch ärgere Dich nicht – Online

GitHub-Pages-taugliche 2–6-Spieler-Version.

## Vorlage
`board-template.svg` ist die vom Nutzer bereitgestellte SVG-Vorlage und wird als sichtbares Brett verwendet. Die A-/B-/Zielfelder und die Laufbahn kommen damit aus derselben Vorlage statt aus einer frei erfundenen CSS-Geometrie.

## Ablauf
- Name + Farbe wählen.
- Raum erstellen oder per Code beitreten.
- Das Brett wird sofort angezeigt.
- Der Host sieht die Spielerliste und kann ab 2 Spielern `Spiel starten` drücken.
- Weitere Spieler können bis zum Start beitreten.
- `Neues Spiel` befindet sich beim Host direkt in der Spielerliste und setzt die Partie zurück, ohne den Raum zu schließen.

## Regeln
Die Implementierung folgt den dokumentierten Standardregeln für Laufbahn, A-Feld, B-Felder, Ziele, Schlagen, eigene Figuren, Sechsen und Zielbereich. Zusätzlich ist die vom Auftrag gewünschte 3-Wurf-Regel umgesetzt: Wenn alle eigenen Figuren wieder auf den B-Feldern stehen, gibt es bis zu drei Würfe, um eine 6 zu bekommen.

## Online
Die Verbindung erfolgt über PeerJS. GitHub Pages bleibt statisch; PeerJS übernimmt die Signalisierung. Eine funktionierende Internetverbindung ist erforderlich.
