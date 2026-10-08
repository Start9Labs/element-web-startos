import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.12.27.3:1',
  releaseNotes: {
    en_US: `- Configure Push Notifications lists what each choice of Push Notifications and Homeserver means.
- Configure Default Homeserver's Homeserver URL explains which address to enter for the Synapse on this server.
- The optional Synapse dependency names 1.161.0:1 as its minimum version.`,
    es_ES: `- Configurar notificaciones push indica qué significa cada opción de Notificaciones push y Servidor Matrix.
- La URL del servidor Matrix de Configurar servidor Matrix predeterminado explica qué dirección introducir para el Synapse de este servidor.
- La dependencia opcional de Synapse indica 1.161.0:1 como versión mínima.`,
    de_DE: `- Push-Benachrichtigungen konfigurieren erklärt, was jede Auswahl bei Push-Benachrichtigungen und Homeserver bedeutet.
- Die Homeserver-URL in Standard-Homeserver konfigurieren erklärt, welche Adresse für den Synapse auf diesem Server einzugeben ist.
- Die optionale Abhängigkeit Synapse nennt 1.161.0:1 als Mindestversion.`,
    pl_PL: `- Konfiguruj powiadomienia push wyjaśnia, co oznacza każdy wybór w polach Powiadomienia push i Serwer Matrix.
- Adres URL serwera Matrix w Skonfiguruj domyślny serwer Matrix wyjaśnia, jaki adres wpisać dla Synapse na tym serwerze.
- Opcjonalna zależność Synapse podaje 1.161.0:1 jako wersję minimalną.`,
    fr_FR: `- Configurer les notifications push indique ce que signifie chaque choix de Notifications push et Serveur Matrix.
- L'URL du serveur Matrix de Configurer le serveur Matrix par défaut explique quelle adresse saisir pour le Synapse de ce serveur.
- La dépendance optionnelle Synapse indique 1.161.0:1 comme version minimale.`,
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
