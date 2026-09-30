# Mensch ärgere Dich nicht – Online

GitHub-Pages-fähige 2–6-Spieler-Version mit PeerJS.

## Regeln in dieser Version
- 4 Figuren pro Spieler; zu Beginn stehen alle 4 im eigenen Haus/Bereich.
- Eine Figur kommt nur mit einer **6** auf das eigene A-Feld.
- Solange alle eigenen Figuren im Haus sind, gibt es bis zu **3 Würfe**, um eine 6 zu erzielen. Nach der dritten erfolglosen Zahl ist der nächste Spieler dran.
- Liegt eine eigene Figur auf A und weitere eigene Figuren warten im Haus, muss eine gewürfelte 6 zuerst A freimachen; erst danach können wartende Figuren herauskommen.
- Steht eine gegnerische Figur auf A, wird sie beim Herauskommen geschlagen.
- Nach einer gezogenen 6 gibt es einen weiteren Wurf, sofern ein gültiger Zug mit der 6 möglich war.
- Eigene Figuren dürfen nicht auf demselben Feld stehen.
- Gegnerische Figuren werden auf ihrem eigenen Haus/Bereich zurückgesetzt; Schlagzwang gibt es nicht.
- Es wird ausschließlich vorwärts gezogen; Rückwärtsziehen gibt es nicht.
- Der Zieleinlauf muss **passend** gewürfelt werden.
- Wer alle vier Figuren im Ziel hat, gewinnt.
- Vor dem normalen Spiel gibt es einen Startwurf: alle Spieler würfeln einmal, die **niedrigste Zahl** beginnt. Bei Gleichstand würfeln nur die Beteiligten erneut.

## Technik
- Das Spielbrett `board-template.svg` stammt unverändert aus der bereitgestellten Vorlage.
- PeerJS dient für die direkte Synchronisierung zwischen Gastgeber und Mitspielern.

## Letzte Korrektur
- Die zuletzt gewürfelte Zahl bleibt im Würfelfeld sichtbar, auch nachdem der aktive Würfel gelöscht bzw. der Zug gewechselt wurde.
- Der Zieleinlauf verwendet weiterhin exakte Vorwärtsdistanz; belegte Zielfelder dürfen auf dem Weg übersprungen werden, aber das tatsächliche Zielfeld muss frei sein.
- HTML/CSS/Layout und die verwendete Board-SVG wurden nicht verändert.
