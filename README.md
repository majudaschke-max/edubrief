# EduBrief

EduBrief ist eine eigenständige, dependency-freie und local-first nutzbare
Browser-App für kurze wissenschaftlich fundierte Forschungs- und Praxisimpulse.
Dieses Repository enthält ausschließlich EduBrief.

Das veröffentlichte Grundlagenpaket umfasst:

- 16 Themenwochen,
- 80 EduCoffees,
- 240 fachunabhängige mögliche Umsetzungen.

Persönliche Einstellungen, Öffnungsstände und vorgemerkte Umsetzungen bleiben
lokal im Browser. Die App verwendet IndexedDB und einen Service Worker für die
Offline-Nutzung.

## Lokal starten

```sh
node preview-server.mjs
```

Danach ist die App unter `http://127.0.0.1:4173/` erreichbar.

## Tests

```sh
node --test tests/*.test.mjs
```

## Ausschließlich lokale QA-Parameter

- `?qaDate=YYYY-MM-DD` setzt auf `localhost` oder `127.0.0.1` das fachliche
  Testdatum.
- `?qaContentError=1` simuliert einen Contentfehler.
- `?qaStorageError=1` simuliert einen fehlgeschlagenen Speicherstart.

Die Parameter werden nicht persistiert und sind außerhalb lokaler Hosts
wirkungslos.

## Inhalt

Das aktive, versionierte Paket liegt unter `content/foundation-weeks/`.
Content-IDs und persönliche Speicherstrukturen bleiben gegenüber der bisherigen
EduBrief-Version unverändert.

## Lizenz

MIT, siehe [LICENSE](LICENSE).
