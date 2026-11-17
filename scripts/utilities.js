export const MODULE_ID = "ipad-touch-enhancer-main";
const STORAGE_KEY = "ipad-touch-toggles-state-v5";

const loadPanelState = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      left: typeof saved.left === "number" ? saved.left : 110,
      top: typeof saved.top === "number" ? saved.top : 14,
      locked: Boolean(saved.locked),
      visible: saved.visible !== undefined ? Boolean(saved.visible) : true
    };
  } catch {
    return { left: 110, top: 14, locked: false, visible: true };
  }
};

export const savePanelState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

export const panelState = loadPanelState();

export const isModuleEnabled = () => {
  try {
    return Boolean(game.settings.get(MODULE_ID, "enableModule"));
  } catch {
    return true;
  }
};

export const isSettingEnabled = (key) => {
  if (!isModuleEnabled()) return false;
  try {
    return Boolean(game.settings.get(MODULE_ID, key));
  } catch {
    return true;
  }
};

export const syncBodyFeatureClasses = () => {
  if (!document.body) return;
  document.body.classList.toggle("ipad-enhancer-hide-arrow", isSettingEnabled("hideHudElevationArrow"));
  document.body.classList.toggle("ipad-enhancer-fix-windows", isSettingEnabled("fixWindows"));
  document.body.classList.toggle("ipad-enhancer-fix-checkboxes", isSettingEnabled("fixCheckboxes"));
  document.body.classList.toggle("ipad-enhancer-fix-region-legend", isSettingEnabled("fixRegionLegend"));
  document.body.classList.toggle("ipad-enhancer-remove-macro-bar", isSettingEnabled("removeMacroBar"));
  document.body.classList.toggle("ipad-enhancer-remove-player-list", isSettingEnabled("removePlayerList"));
  document.body.classList.toggle("ipad-enhancer-disable-all-notifications", isSettingEnabled("disableAllNotifications"));
  document.body.classList.toggle("ipad-enhancer-compact-notifications", isSettingEnabled("compactNotifications"));
  document.body.classList.toggle("ipad-enhancer-fix-settings-overflow", isSettingEnabled("fixSettingsOverflow"));

  const notificationSettings = {
    "--ie-notification-top": "notificationTop",
    "--ie-notification-left": "notificationLeft",
    "--ie-notification-width": "notificationWidth",
    "--ie-notification-font-size": "notificationFontSize"
  };
  for (const [cssVariable, settingKey] of Object.entries(notificationSettings)) {
    const value = game.settings.get(MODULE_ID, settingKey);
    document.body.style.setProperty(cssVariable, `${value}px`);
  }

};

export const applyPanelDisplay = (onHideResetMode = null) => {
  const panel = document.getElementById("ipad-touch-toggles");
  const shouldShow = isSettingEnabled("enableTouchBar") && panelState.visible;

  if (panel) {
    panel.style.display = shouldShow ? "flex" : "none";
    if (shouldShow) {
      const rect = panel.getBoundingClientRect();
      const maxX = Math.max(8, window.innerWidth - (rect.width || 170) - 8);
      const maxY = Math.max(8, window.innerHeight - (rect.height || 44) - 8);
      panelState.left = Math.min(Math.max(8, panelState.left), maxX);
      panelState.top = Math.min(Math.max(8, panelState.top), maxY);
      panel.style.left = `${Math.round(panelState.left)}px`;
      panel.style.top = `${Math.round(panelState.top)}px`;
    }
  }

  if (!shouldShow && typeof onHideResetMode === "function") {
    onHideResetMode();
  }

  const domToggleBtn = document.querySelector('[data-tool="ipad-touch-panel"], #ipad-panel-layer-toggle button');
  if (domToggleBtn) {
    domToggleBtn.classList.toggle("active", Boolean(panelState.visible));
    domToggleBtn.setAttribute("aria-pressed", String(Boolean(panelState.visible)));
  }
};

export const setPanelVisibility = (isVisible, { rerenderControls = false, onHideResetMode = null } = {}) => {
  panelState.visible = Boolean(isVisible);
  savePanelState(panelState);
  applyPanelDisplay(onHideResetMode);
  if (rerenderControls && ui.controls?.render) {
    ui.controls.render();
  }
};
