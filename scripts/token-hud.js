import { isModuleEnabled, isSettingEnabled } from "./settings.js";

export const findTokenAtPos = (pos) => {
  return (
    [...(canvas.tokens?.placeables || [])]
      .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
      .find((t) => {
        if (!t.visible) return false;
        const x1 = t.x ?? t.document?.x ?? 0;
        const y1 = t.y ?? t.document?.y ?? 0;
        const w = t.w || t.bounds?.width || 0;
        const h = t.h || t.bounds?.height || 0;
        return pos.x >= x1 && pos.x <= x1 + w && pos.y >= y1 && pos.y <= y1 + h;
      }) || null
  );
};

export const openTokenHudFor = (token) => {
  const hud = canvas.hud?.token;
  if (!token || !hud) return;

  if (!token.controlled) {
    token.control({ releaseOthers: true });
  }

  requestAnimationFrame(() => {
    if (token.destroyed || !canvas.tokens?.controlled) return;
    if (canvas.tokens.controlled.length === 1 && canvas.tokens.controlled[0] === token) {
      hud.bind(token);
    }
  });
};

const enhanceTokenHUD = (tokenHudEl) => {
  if (!tokenHudEl || !isModuleEnabled()) return;

  if (isSettingEnabled("hideHudElevationArrow")) {
    tokenHudEl.querySelectorAll("input").forEach((inp) => {
      inp.removeAttribute("list");
      inp.setAttribute("autocomplete", "off");
    });
    tokenHudEl
      .querySelectorAll(
        ".attribute.elevation > i, .attribute.elevation > svg, [data-attribute='elevation'] > i, [data-attribute='elevation'] > svg"
      )
      .forEach((arrow) => arrow.remove());
  }

  const existingBtn = tokenHudEl.querySelector("[data-action='open-actor-sheet']");
  if (!isSettingEnabled("enableHudSheetButton")) {
    existingBtn?.remove();
    return;
  }

  if (existingBtn) return;

  const tokenObj = canvas?.hud?.token?.object || canvas?.tokens?.controlled?.[0];
  const actor = tokenObj?.actor;
  if (!actor) return;

  const leftCol = tokenHudEl.querySelector(".col.left") || tokenHudEl.querySelector(".left");
  if (!leftCol) return;

  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "control-icon";
  btn.dataset.action = "open-actor-sheet";
  btn.title = "Open Actor Sheet";
  btn.innerHTML = `<svg viewBox="0 0 448 512" style="width:18px;height:18px;fill:currentColor;pointer-events:none;"><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-45.7 48C79.8 304 0 383.8 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7C448 383.8 368.2 304 269.7 304H178.3z"/></svg>`;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    actor.sheet?.render(true);
  });

  leftCol.appendChild(btn);
};

export const initTokenHudObserver = () => {
  const hudContainer = document.getElementById("hud") || document.body;
  const hudObserver = new MutationObserver(() => {
    const tokenHudEl = document.getElementById("token-hud");
    if (tokenHudEl) enhanceTokenHUD(tokenHudEl);
  });
  hudObserver.observe(hudContainer, { childList: true, subtree: true });
};
