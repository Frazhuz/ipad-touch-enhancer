function reportError(error) {
  const message = error?.message ?? String(error);

  globalThis.ui?.notifications?.error(
    `ipad-touch-enhancer-main: ${message}`,
    { permanent: true }
  );
}

// Глобальные ошибки JavaScript
window.addEventListener("error", event => {
  reportError(event.error ?? event.message);
});

// Необработанные Promise
window.addEventListener("unhandledrejection", event => {
  reportError(event.reason);
});

