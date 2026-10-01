# Mensch ärgere Dich nicht – Ziel-Einlauf Fix

Diese Version behält Design, Layout und die originale Board-SVG unverändert.

Korrigiert wurde die logische Reihenfolge des roten Zielfeldes: Zielfeld 1 liegt dort jetzt am Einlauf vom roten Laufbahnfeld, danach folgen 2, 3 und 4. Dadurch kann eine rote Figur mit einem passenden Würfelwert aus dem Einlauf weiter in Richtung Ziel vorrücken.

Zusätzlich wurden die Zielbewegungen für alle Farben systematisch geprüft: 6 Farben × 52 Positionen × 6 Würfelwerte sowie Belegungsfälle im Ziel.


## Letzter Ziel-Einlauf-Fix

Die Zielpositionen 48-51 sind pro Farbe eine private Zielbahn. Eine rote Zielfigur auf Position 50 darf daher niemals einen gelben Zug auf Position 50 blockieren. Nur eine bereits auf demselben Zielfeld derselben Farbe stehende Figur blockiert die Landung.

Getestet mit `goal-exhaustive-tests.js`: alle 6 Farben, alle 48 Laufbahnpositionen, alle 6 Würfelwerte, alle Zielbelegungen der eigenen Farbe sowie 2- und 3-Spieler-Konstellationen mit vollständigen Zielbelegungsmasken der Mitspieler.
