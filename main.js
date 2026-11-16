import {
  applyPanelDisplay,
  isSettingEnabled,
  panelState,
  registerModuleSettings,
  setPanelVisibility,
  syncBodyFeatureClasses
} from "./scripts/settings.js";
import { attachStageTouchListener, initTouchBar, setActiveMode } from "./scripts/touch-bar.js";
import { initTokenHudObserver } from "./scripts/token-hud.js";

const resetModeCallback = () => setActiveMode("none");

Hooks.once("init", () => {
  registerModuleSettings(() => applyPanelDisplay(resetModeCallback));
});

Hooks.on("getSceneControlButtons", (controls) => {
  if (!isSettingEnabled("enableTouchBar") || !controls) return;

  const toggleTool = {
    name: "ipad-touch-panel",
    title: "Touch Modifier Bar (2x / Right-Click)",
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
  initTouchBar();
  initTokenHudObserver();
  attachStageTouchListener();
  Hooks.on("canvasReady", attachStageTouchListener);
  ui.controls?.render();
});
