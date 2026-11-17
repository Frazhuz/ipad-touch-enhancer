import { MODULE_ID } from "./utilities.js";

const getRightSettingsTab = () =>
  document.querySelector('#sidebar section.settings[data-tab="settings"]') ||
  document.querySelector('section.settings[data-tab="settings"]') ||
  document.querySelector('#sidebar [data-tab="settings"].tab') ||
  document.querySelector('[data-tab="settings"].tab') ||
  document.querySelector('#settings');

export const registerSidebarReloadButton = () => {
  const addReloadButton = () => {
    const enabled = game.settings.get(MODULE_ID, "enableReloadButton");
    const tabEl = getRightSettingsTab();

    document.querySelectorAll(".ipad-enhancer-reload-button").forEach((el) => {
      if (!enabled || !tabEl || !tabEl.contains(el)) {
        el.remove();
      }
    });

    if (!enabled || !tabEl) return;
    if (tabEl.querySelector(".ipad-enhancer-reload-button")) return;

    const label = "Reload";

    const button = document.createElement("button");
    button.type = "button";
    button.className = "ipad-enhancer-reload-button";
    button.innerHTML = `<i class="fas fa-rotate"></i> <span>${label}</span>`;
    button.title = label;

    button.addEventListener("click", (event) => {
      event.preventDefault();
      ui.notifications.info("Reloading Foundry VTT...");
      window.location.reload();
    });

    const firstSection = tabEl.querySelector("section");
    if (firstSection) {
      firstSection.insertAdjacentElement("beforebegin", button);
    } else {
      tabEl.prepend(button);
    }
  };

  Hooks.on("renderSettings", addReloadButton);
  Hooks.on("renderSidebarTab", (app) => {
    if (app?.tabName === "settings" || app?.constructor?.name === "Settings") {
      addReloadButton();
    }
  });
  Hooks.on("changeSidebarTab", (app) => {
    if (app?.tabName === "settings" || app?.constructor?.name === "Settings") {
      addReloadButton();
    }
  });

  addReloadButton();
};

