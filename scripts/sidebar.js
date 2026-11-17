import { MODULE_ID } from "./utilities.js";

export const registerSidebarReloadButton = () => {
  const addReloadButton = () => {
    const enabled = game.settings.get(MODULE_ID, "enableReloadButton");

    // Ищем контейнер вкладки Settings (в v13 это section.settings.tab или [data-tab="settings"])
    const settingsTab = document.querySelector(
      '#sidebar section.settings, #sidebar [data-tab="settings"]'
    );

    if (!settingsTab) return;

    // Выбираем целевой заголовок секции (например, первый h2 или заголовок конкретной секции)
    const target = settingsTab.querySelector("h2");
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

    button.addEventListener("click", (event) => {
      event.preventDefault();
      window.location.reload();
    });

    // Вставляем кнопку сразу после заголовка h2
    target.insertAdjacentElement("afterend", button);
  };

  Hooks.on("renderSidebarTab", addReloadButton);
  Hooks.on("renderSettings", addReloadButton);
  Hooks.on("ready", addReloadButton);

  addReloadButton();
};
