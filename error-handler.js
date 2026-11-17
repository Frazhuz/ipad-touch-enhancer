
const MODULE_ID = "ipad-touch-panel";

function reportError(error) {
  const message = error?.message ?? String(error);

  console.error(`[${MODULE_ID}]`, error);

  globalThis.ui?.notifications?.error(
    `[${MODULE_ID}] ${message}`,
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

// Динамическая загрузка основного модуля
import("../main.js").catch(reportError);

