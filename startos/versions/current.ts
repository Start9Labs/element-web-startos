import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.12.35.1:0',
  releaseNotes: {
    en_US:
      'Updates Element Web to 1.12.35. A new sign-in must now be verified with another signed-in session or your recovery key before Element opens.',
    es_ES:
      'Actualiza Element Web a 1.12.35. Un nuevo inicio de sesión debe verificarse con otra sesión abierta o con su clave de recuperación antes de que Element se abra.',
    de_DE:
      'Aktualisiert Element Web auf 1.12.35. Eine neue Anmeldung muss jetzt mit einer anderen angemeldeten Sitzung oder Ihrem Wiederherstellungsschlüssel bestätigt werden, bevor Element sich öffnet.',
    pl_PL:
      'Aktualizuje Element Web do wersji 1.12.35. Nowe logowanie trzeba teraz zweryfikować inną zalogowaną sesją lub kluczem odzyskiwania, zanim Element się otworzy.',
    fr_FR:
      "Met à jour Element Web vers la version 1.12.35. Une nouvelle connexion doit désormais être vérifiée avec une autre session connectée ou votre clé de récupération avant qu'Element ne s'ouvre.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
