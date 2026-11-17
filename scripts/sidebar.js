import { MODULE_ID } from "./utilities.js";

export const registerSidebarReloadButton = () => {
  const addReloadButton = () => {
    const enabled = game.settings.get(MODULE_ID, "enableReloadButton");

    // Ищем вкладку Settings по основным возможным селекторам в v13
    const settingsTab =
      document.querySelector('#sidebar section.settings[data-tab="settings"]') ||
      document.querySelector('#sidebar [data-tab="settings"]') ||
      document.querySelector('#sidebar section.settings') ||
      document.querySelector('#settings');

    const existing = document.querySelector(".ipad-enhancer-reload-button");

    if (!enabled) {
      existing?.remove();
      return;
    }

    if (!settingsTab) return;
    if (existing && settingsTab.contains(existing)) return;
    existing?.remove();

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

    // Пробуем вставить после первого h2, иначе — в начало/конец settingsTab
    const heading = settingsTab.querySelector("h2, h3, h4");
    if (heading) {
      heading.insertAdjacentElement("afterend", button);
    } else {
      settingsTab.prepend(button);
    }
  };

  Hooks.on("renderSidebarTab", addReloadButton);
  Hooks.on("renderSettings", addReloadButton);
  Hooks.on("changeSidebarTab", addReloadButton);

  // Наблюдаем за сайдбаром на случай перерисовок в ApplicationV2
  const sidebar = document.querySelector("#sidebar") || document.body;
  const observer = new MutationObserver(() => {
    addReloadButton();
  });
  observer.observe(sidebar, { childList: true, subtree: true });

  addReloadButton();
};

