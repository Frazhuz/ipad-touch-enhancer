
import { MODULE_ID } from "./utilities.js";

export const registerSidebarReloadButton = () => {
  const addReloadButton = () => {
    const enabled = game.settings.get(MODULE_ID, "enableReloadButton");

    document.querySelector("#sidebar .settings")
      ?.querySelector(".window-header")?.querySelector(".window-title");

    const settingsTab = document.querySelector(
      '#sidebar [data-tab="settings"]'
    );

    if (!settingsTab) return;

    const target = settingsTab.querySelector(".window-title");

    if (!target) return;

    const existing = settingsTab.querySelector(
      ".ipad-enhancer-reload-button"
    );

    if (!enabled) {
      existing?.remove();
      return;
    }

    if (existing) return;

    const button = document.createElement("button");

    button.type = "button";
    button.className = "ipad-enhancer-reload-button";
    button.innerHTML = '<i class="fas fa-rotate"></i>';
    button.title = game.i18n.localize(
      "IPAD_TOUCH_ENHANCER.Settings.EnableReloadButton.Name"
    );

    button.addEventListener("click", () => {
      window.location.reload();
    });

    target.insertAdjacentElement("afterend", button);
  };

  Hooks.on("renderSidebarTab", addReloadButton);
  Hooks.on("renderSettings", addReloadButton);

  addReloadButton();
};
