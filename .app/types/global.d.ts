declare global {
  interface Window {
    _pwaInstallPrompt?: BeforeInstallPromptEvent | null
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt(): Promise<void>
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
  }
}

export {}
