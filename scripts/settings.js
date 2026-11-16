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
