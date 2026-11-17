
const notifyError = (message, error) => {
  console.error(`[ipad-touch-enhancer] ${message}`, error);

  try {
    globalThis.ui?.notifications?.error(
      `[iPad Touch Panel] ${message}: ${
        error?.message ?? error ?? "Unknown error"
      }`
    );
  } catch (notificationError) {
    console.error("Failed to display error notification:", notificationError);
  }
};

// Обычные JavaScript-ошибки
window.addEventListener("error", event => {
  notifyError(
    event.message || "JavaScript error",
    event.error
  );
});

// Ошибки Promise
window.addEventListener("unhandledrejection", event => {
  notifyError("Unhandled Promise rejection", event.reason);
});
