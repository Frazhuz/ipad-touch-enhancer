import { syncBodyFeatureClasses } from "./utilities.js";

export const registerModuleSettings = (onStateChange) => {
  const notify = () => {
    syncBodyFeatureClasses();
    if (typeof onStateChange === "function") onStateChange();
  };

  game.settings.register(MODULE_ID, "enableModule", {
    name: "Enable module",
    hint: "Master switch to enable or disable all features and visual fixes of this module for your client.",
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      notify();
      ui.controls?.render();
      canvas.hud?.token?.render();
    }
  });

  game.settings.register(MODULE_ID, "enableTouchBar", {
    name: "Double-click / Right-click bar",
    hint: "Adds a draggable mini-bar to emulate double-click and right-click actions, with a toggle button in the Scene Controls bar to control its visibility.",
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
    name: "Token HUD on Short Tap",
    hint: "Opens the Token HUD on a short tap of a token.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "enableHudSheetButton", {
    name: "Actor Sheet Button",
    hint: "Adds a button to the Token HUD that opens the selected token’s Actor Sheet.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => canvas.hud?.token?.render()
  });

  game.settings.register(MODULE_ID, "hideHudElevationArrow", {
    name: "Hide Caret (^)",
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
    name: "Fix Application Window Clipping",
    hint: "Adjusts application window positioning to prevent clipping at the bottom of the screen.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "fixSafariInputs", {
    name: "Fix Duplicate Checkboxes",
    hint: "Prevents checkboxes from appearing twice in the interface.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: syncBodyFeatureClasses
  });
};
