import {
  applyPanelDisplay,
  isSettingEnabled,
  panelState,
  setPanelVisibility
} from "./scripts/utilities.js";

import {
  disableTokenMovementAnimation,
  syncBodyFeatureClasses
} from "./scripts/settings-implementation.js";
  
import { registerModuleSettings } from "./scripts/settings.js";
import { attachStageTouchListener, initTouchBar, setActiveMode } from "./scripts/touch-bar.js";
import { initTokenHudObserver } from "./scripts/token-hud.js";
import { registerSidebarReloadButton } from "./scripts/sidebar.js";

const resetModeCallback = () => setActiveMode("none");

Hooks.once("init", () => {
  registerModuleSettings(() => applyPanelDisplay(resetModeCallback));
});

Hooks.on("getSceneControlButtons", (controls) => {
  if (!isSettingEnabled("enableTouchBar") || !controls) return;

  const toggleTool = {
    name: "ipad-touch-panel",
    title: "Touch Modifier Mini-Bar (Double-click / Right-click)",
    icon: "fa-solid fa-hand-pointer",
    order: 999,
    toggle: true,
    active: panelState.visible,
    visible: true,
    onChange: (_event, active) => {
      const nextState = typeof active === "boolean" ? active : !panelState.visible;
      setPanelVisibility(nextState, { onHideResetMode: resetModeCallback });
    }
  };

  if (Array.isArray(controls)) {
    const tokenControl = controls.find((c) => c?.name === "tokens");
    if (Array.isArray(tokenControl?.tools)) {
      tokenControl.tools.push(toggleTool);
    }
  } else if (typeof controls === "object") {
    const tokenControl = controls.tokens;
    if (tokenControl?.tools && typeof tokenControl.tools === "object") {
      tokenControl.tools["ipad-touch-panel"] = toggleTool;
    }
  }
});

Hooks.once("ready", () => {
  syncBodyFeatureClasses();
  registerSidebarReloadButton();
  initTouchBar();
  initTokenHudObserver();
  ui.controls?.render();
  if (isSettingEnabled("disableTokenMovementAnimation")) disableTokenMovementAnimation();
});

Hooks.on("canvasReady", attachStageTouchListener);
