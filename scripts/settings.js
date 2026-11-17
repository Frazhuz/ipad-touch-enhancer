import { MODULE_ID } from "./utilities.js";
import { syncBodyFeatureClasses } from "./settings-implementation.js";

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
    default: false,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "fixSettingsOverflow", {
  name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixSettingsOverflow.Name"),
  hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixSettingsOverflow.Hint"),
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

  game.settings.register(MODULE_ID, "fixRegionLegend", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixRegionLegend.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.FixRegionLegend.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "removeMacroBar", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.RemoveMacroBar.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.RemoveMacroBar.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "removePlayerList", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.RemovePlayerList.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.RemovePlayerList.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: syncBodyFeatureClasses
  });

game.settings.register(MODULE_ID, "disableAllNotifications", {
  name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.DisableAllNotifications.Name"),
  hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.DisableAllNotifications.Hint"),
  scope: "client",
  config: true,
  type: Boolean,
  default: false,
  onChange: syncBodyFeatureClasses
});


  // Compact Notifications
  game.settings.register(MODULE_ID, "compactNotifications", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.CompactNotifications.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.CompactNotifications.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: false,
    onChange: syncBodyFeatureClasses
  });

  // Notification Position: Top
  game.settings.register(MODULE_ID, "notificationTop", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationTop.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationTop.Hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 12,
    onChange: syncBodyFeatureClasses
  });

  // Notification Position: Left
  game.settings.register(MODULE_ID, "notificationLeft", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationLeft.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationLeft.Hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 245,
    onChange: syncBodyFeatureClasses
  });

  // Notification Width
  game.settings.register(MODULE_ID, "notificationWidth", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationWidth.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationWidth.Hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 480,
    onChange: syncBodyFeatureClasses
  });

  // Notification Font Size
  game.settings.register(MODULE_ID, "notificationFontSize", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationFontSize.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.NotificationFontSize.Hint"),
    scope: "client",
    config: true,
    type: Number,
    default: 13,
    onChange: syncBodyFeatureClasses
  });

  game.settings.register(MODULE_ID, "enableReloadButton", {
    name: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableReloadButton.Name"),
    hint: game.i18n.localize("IPAD_TOUCH_ENHANCER.Settings.EnableReloadButton.Hint"),
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    requiresReload: true,
    onChange: syncBodyFeatureClasses
  });
};
