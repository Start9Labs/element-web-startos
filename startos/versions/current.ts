import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.12.35.1:1',
  releaseNotes: {
    en_US:
      'Updates the push notification gateway, Sygnal, to 0.17.0, with security fixes in the networking libraries it is built on. [Sygnal changelog](https://github.com/element-hq/sygnal/blob/v0.17.0/CHANGELOG.md)',
    es_ES:
      'Actualiza la pasarela de notificaciones push, Sygnal, a 0.17.0, con correcciones de seguridad en las bibliotecas de red sobre las que está construida. [Registro de cambios de Sygnal](https://github.com/element-hq/sygnal/blob/v0.17.0/CHANGELOG.md)',
    de_DE:
      'Aktualisiert das Push-Benachrichtigungs-Gateway Sygnal auf 0.17.0, mit Sicherheitskorrekturen in den Netzwerkbibliotheken, auf denen es aufbaut. [Sygnal-Änderungsprotokoll](https://github.com/element-hq/sygnal/blob/v0.17.0/CHANGELOG.md)',
    pl_PL:
      'Aktualizuje bramę powiadomień push, Sygnal, do wersji 0.17.0, z poprawkami bezpieczeństwa w bibliotekach sieciowych, na których jest zbudowana. [Dziennik zmian Sygnal](https://github.com/element-hq/sygnal/blob/v0.17.0/CHANGELOG.md)',
    fr_FR:
      'Met à jour la passerelle de notifications push, Sygnal, vers la version 0.17.0, avec des correctifs de sécurité dans les bibliothèques réseau sur lesquelles elle repose. [Journal des modifications de Sygnal](https://github.com/element-hq/sygnal/blob/v0.17.0/CHANGELOG.md)',
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
