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
  document.body.classList.toggle("ipad-enhancer-fix-windows", isSettingEnabled("fixSafariWindows"));
  document.body.classList.toggle("ipad-enhancer-fix-inputs", isSettingEnabled("fixSafariInputs"));
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

export const registerModuleSettings = (onStateChange) => {
  const notify = () => {
    syncBodyFeatureClasses();
    if (typeof onStateChange === "function") onStateChange();
  };

  game.settings.register(MODULE_ID, "enableModule", {
    name: "Enable iPadOS Safari Touch & UI Enhancer",
    hint: "Master switch to enable or disable all features and visual fixes of this module for your client.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      notify();
      ui.controls?.render();
      canvas.hud?.token?.render();
    }
  });

  game.settings.register(MODULE_ID, "enableTouchBar", {
    name: "Floating Touch Modifier Bar (2x / Right-Click)",
    hint: "Displays a compact, draggable bar for emulating Double-Click and Right-Click, along with a visibility toggle button in Scene Controls.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      notify();
      ui.controls?.render();
    }
  });

  game.settings.register(MODULE_ID, "enableSingleTapHud", {
    name: "Open Token HUD on Single Tap",
    hint: "Opens the Token HUD upon a short tap on any token, even if that token is already selected.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "enableHudSheetButton", {
    name: "Actor Sheet Button in Token HUD",
    hint: "Adds a quick-access character sheet button to the left column of the Token HUD.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => canvas.hud?.token?.render()
  });

  game.settings.register(MODULE_ID, "hideHudElevationArrow", {
    name: "Hide Safari Elevation Dropdown Arrow in Token HUD",
    hint: "Removes the system datalist dropdown indicator (^) rendered by iPadOS Safari over the token elevation field.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      syncBodyFeatureClasses();
      canvas.hud?.token?.render();
    }
  });

  game.settings.register(MODULE_ID, "fixSafariWindows", {
    name: "Fix ApplicationV2 Windows & Dialogs in Safari",
    hint: "Prevents blank/transparent modal dialogs, lingering HUD ghost layers, and horizontal clipping in wide settings menus on iPadOS/iOS Safari.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "fixSafariInputs", {
    name: "Fix Checkboxes & Color Pickers in Safari",
    hint: "Restores missing checkboxes and properly sized color inputs in Foundry v13 windows and legacy module dialogs (e.g., Dice So Nice) on iPadOS/iOS.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: syncBodyFeatureClasses
  });
};
