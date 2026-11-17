export function disableTokenMovementAnimation() {
  const TokenClass = CONFIG.Token.objectClass;
  const originalGetAnimationDuration =
    TokenClass.prototype._getAnimationDuration;

  TokenClass.prototype._getAnimationDuration = function (data, options = {}) {
    const isMovement =
      Object.hasOwn(data, "x") ||
      Object.hasOwn(data, "y") ||
      Object.hasOwn(data, "elevation");

    if (isMovement) {
      return 0;
    }

    return originalGetAnimationDuration.call(this, data, options);
  };
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
