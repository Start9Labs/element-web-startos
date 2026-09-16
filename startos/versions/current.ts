import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '1.12.27.1:0',
  releaseNotes: {
    en_US:
      "Now ships Start9's fork of Element Web: a phone layout, installation to the home screen, push notifications (on by default; Configure Push Notifications turns them off or sets a contact address), and a reload prompt after an update.",
    es_ES:
      'Ahora incluye la bifurcación de Element Web de Start9: diseño para teléfono, instalación en la pantalla de inicio, notificaciones push (activadas de forma predeterminada; Configurar notificaciones push las desactiva o establece una dirección de contacto) y un aviso para recargar tras una actualización.',
    de_DE:
      'Enthält jetzt Start9s Fork von Element Web: Smartphone-Layout, Installation auf dem Startbildschirm, Push-Benachrichtigungen (standardmäßig eingeschaltet; Push-Benachrichtigungen konfigurieren schaltet sie aus oder setzt eine Kontaktadresse) und eine Aufforderung zum Neuladen nach einem Update.',
    pl_PL:
      'Zawiera teraz fork Element Web od Start9: układ na telefon, instalację na ekranie głównym, powiadomienia push (domyślnie włączone; Konfiguruj powiadomienia push wyłącza je lub ustawia adres kontaktowy) oraz monit o przeładowanie po aktualizacji.',
    fr_FR:
      "Fournit désormais le fork d'Element Web par Start9 : mise en page pour téléphone, installation sur l'écran d'accueil, notifications push (activées par défaut ; Configurer les notifications push les désactive ou définit une adresse de contact) et invitation à recharger après une mise à jour.",
  },
  migrations: {
    up: async () => {},
    down: IMPOSSIBLE,
  },
})
