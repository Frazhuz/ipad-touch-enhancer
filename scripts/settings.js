import { MODULE_ID, syncBodyFeatureClasses } from "./utilities.js";

export const registerModuleSettings = (onStateChange) => {
  game.settings.register(MODULE_ID, "enableModule", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableModule.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableModule.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      syncBodyFeatureClasses();
      if (typeof onStateChange === "function") onStateChange();
      ui.controls?.render();
      canvas.hud?.token?.render();
    }
  });

  game.settings.register(MODULE_ID, "enableTouchBar", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableTouchBar.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableTouchBar.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      syncBodyFeatureClasses();
      if (typeof onStateChange === "function") onStateChange();
      ui.controls?.render();
    }
  });

  game.settings.register(MODULE_ID, "enableSingleTapHud", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableSingleTapHud.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableSingleTapHud.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true
  });

  game.settings.register(MODULE_ID, "enableHudSheetButton", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableHudSheetButton.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableHudSheetButton.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => canvas.hud?.token?.render()
  });

  game.settings.register(MODULE_ID, "hideHudElevationArrow", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.HideHudElevationArrow.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.HideHudElevationArrow.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      syncBodyFeatureClasses();
      canvas.hud?.token?.render();
    }
  });

  game.settings.register(MODULE_ID, "fixWindows", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixWindows.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixWindows.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "fixCheckboxes", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixCheckboxes.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixCheckboxes.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: syncBodyFeatureClasses
  });
};
