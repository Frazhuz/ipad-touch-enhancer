import { applyPanelDisplay, isModuleEnabled, isSettingEnabled, panelState, savePanelState } from "./utilities.js";
import { findTokenAtPos, openTokenHudFor } from "./token-hud.js";

let activeMode = "none"; // "none" | "double" | "right"

export const getActiveMode = () => activeMode;

export const setActiveMode = (mode) => {
  activeMode = mode;
  document.querySelectorAll("#ipad-touch-toggles button[data-mode]").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === activeMode);
  });
};

const distToSegment = (p, v, w) => {
  const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
  if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
  let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
  t = Math.max(0, Math.min(1, t));
  return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
};

const findObjectAtScenePos = (pos) => {
  const activeLayerName = canvas.activeLayer?.options?.name;

  if (activeLayerName === "walls" && canvas.walls?.placeables) {
    let closestWall = null;
    let minWallDist = 36;
    for (const w of canvas.walls.placeables) {
      const [x1, y1, x2, y2] = w.document.c;
      const d = distToSegment(pos, { x: x1, y: y1 }, { x: x2, y: y2 });
      if (d <= minWallDist) {
        minWallDist = d;
        closestWall = w;
      }
    }
    if (closestWall) return { obj: closestWall, type: "wall" };
  }

  if (activeLayerName === "regions" && canvas.regions?.placeables) {
    const hitRegion = canvas.regions.placeables.find((r) => {
      if (typeof r.testPoint === "function") return r.testPoint(pos);
      const b = r.bounds;
      return b && pos.x >= b.x && pos.x <= b.x + b.width && pos.y >= b.y && pos.y <= b.y + b.height;
    });
    if (hitRegion) return { obj: hitRegion, type: "region" };
  }

  const layerPlaceables = canvas.activeLayer?.placeables || [];
  const hitInActive = [...layerPlaceables]
    .sort((a, b) => (b.zIndex || 0) - (a.zIndex || 0))
    .find((item) => {
      if (item.visible === false) return false;
      if (item.center && (!item.bounds || item.bounds.width < 12)) {
        return Math.hypot(pos.x - item.center.x, pos.y - item.center.y) <= 36;
      }
      const b = item.bounds;
      return b && pos.x >= b.x && pos.x <= b.x + b.width && pos.y >= b.y && pos.y <= b.y + b.height;
    });

  if (hitInActive) {
    return { obj: hitInActive, type: activeLayerName || "placeable" };
  }

  const hitToken = findTokenAtPos(pos);
  if (hitToken) return { obj: hitToken, type: "tokens" };

  return { obj: null, type: null };
};

const dismissTouchVttMenu = () => {
  document.querySelectorAll(".touch-vtt-context-menu, #touch-vtt-context-menu").forEach((el) => el.remove());
};

export const executeCanvasAction = (pos, mode) => {
  dismissTouchVttMenu();
  const { obj, type } = findObjectAtScenePos(pos);

  if (mode === "double") {
    if (obj) {
      if (typeof obj.control === "function") obj.control({ releaseOthers: true });
      const sheet = obj.actor?.sheet || obj.sheet || obj.document?.sheet;
      if (sheet) sheet.render(true);
    }
  } else if (mode === "right") {
    if (obj) {
      if (typeof obj.control === "function") obj.control({ releaseOthers: true });
      if (type === "tokens" && canvas.hud?.token) {
        canvas.hud.token.bind(obj);
      } else if (type === "tiles" && canvas.hud?.tile) {
        canvas.hud.tile.bind(obj);
      } else if (type === "drawings" && canvas.hud?.drawing) {
        canvas.hud.drawing.bind(obj);
      } else {
        const sheet = obj.sheet || obj.document?.sheet;
        if (sheet) sheet.render(true);
      }
    } else if (canvas.ping) {
      canvas.ping(pos);
    }
  }
};

export const initTouchBar = () => {
  document.getElementById("ipad-touch-toggles")?.remove();

  const panel = document.createElement("div");
  panel.id = "ipad-touch-toggles";
  panel.innerHTML = `
    <span class="drag-handle" title="Drag bar"><i class="fas fa-grip-vertical"></i></span>
    <button type="button" data-mode="double" title="Next tap = Double-Click">
      <i class="fas fa-hand-pointer"></i>
    </button>
    <button type="button" data-mode="right" title="Next tap = Right-Click">
      <i class="fas fa-mouse"></i>
    </button>
    <button type="button" class="lock-btn" title="Lock / Unlock position">
      <i class="fas fa-lock-open"></i>
    </button>
  `;
  document.body.appendChild(panel);
  applyPanelDisplay(() => setActiveMode("none"));

  const lockBtn = panel.querySelector(".lock-btn");
  const updateLockUI = () => {
    panel.classList.toggle("locked", panelState.locked);
    lockBtn.innerHTML = panelState.locked
      ? '<i class="fas fa-lock"></i>'
      : '<i class="fas fa-lock-open"></i>';
  };

  updateLockUI();
  window.addEventListener("resize", () => applyPanelDisplay(() => setActiveMode("none")));

  ["touchstart", "touchend", "pointerdown", "pointerup", "click"].forEach((evt) => {
    panel.addEventListener(evt, (e) => e.stopPropagation());
  });

  const handle = panel.querySelector(".drag-handle");
  handle.addEventListener(
    "touchstart",
    (e) => {
      if (panelState.locked || e.touches.length !== 1) return;
      e.preventDefault();
      e.stopPropagation();

      const touch = e.touches[0];
      const rect = panel.getBoundingClientRect();
      const offsetX = touch.clientX - rect.left;
      const offsetY = touch.clientY - rect.top;

      const onTouchMove = (moveEvt) => {
        if (moveEvt.touches.length !== 1) return;
        const t = moveEvt.touches[0];
        panelState.left = t.clientX - offsetX;
        panelState.top = t.clientY - offsetY;
        applyPanelDisplay(() => setActiveMode("none"));
      };

      const onTouchEnd = () => {
        document.removeEventListener("touchmove", onTouchMove);
        document.removeEventListener("touchend", onTouchEnd);
        document.removeEventListener("touchcancel", onTouchEnd);
        savePanelState(panelState);
      };

      document.addEventListener("touchmove", onTouchMove, { passive: true });
      document.addEventListener("touchend", onTouchEnd);
      document.addEventListener("touchcancel", onTouchEnd);
    },
    { passive: false }
  );

  lockBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    panelState.locked = !panelState.locked;
    updateLockUI();
    applyPanelDisplay(() => setActiveMode("none"));
    savePanelState(panelState);
  });

  panel.querySelectorAll("button[data-mode]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const clickedMode = btn.dataset.mode;
      setActiveMode(activeMode === clickedMode ? "none" : clickedMode);
    });
  });

  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.addEventListener(
      "click",
      (e) => {
        if (!isSettingEnabled("enableTouchBar") || activeMode === "none") return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const chosenMode = activeMode;
        setActiveMode("none");

        const target = e.target;
        const opts = {
          bubbles: true,
          cancelable: true,
          view: window,
          clientX: e.clientX,
          clientY: e.clientY
        };

        if (chosenMode === "double") {
          target.dispatchEvent(new MouseEvent("dblclick", { ...opts, button: 0 }));
        } else if (chosenMode === "right") {
          target.dispatchEvent(new MouseEvent("mousedown", { ...opts, button: 2, buttons: 2 }));
          target.dispatchEvent(new MouseEvent("mouseup", { ...opts, button: 2, buttons: 0 }));
          target.dispatchEvent(new MouseEvent("contextmenu", { ...opts, button: 2 }));
        }
      },
      { capture: true }
    );
  }
};

export const attachStageTouchListener = () => {
  let downPos = null;

  const onStageDown = (event) => {
    if (!isModuleEnabled()) return;
    downPos = event.getLocalPosition(canvas.stage);
  };

  const onStageUp = (event) => {
    if (!downPos) return;
    const upPos = event.getLocalPosition(canvas.stage);
    const dist = Math.hypot(upPos.x - downPos.x, upPos.y - downPos.y);
    downPos = null;

    if (!isModuleEnabled() || dist > 25) return;

    if (isSettingEnabled("enableTouchBar") && activeMode !== "none") {
      const chosenMode = activeMode;
      setActiveMode("none");
      setTimeout(() => {
        executeCanvasAction(upPos, chosenMode);
      }, 40);
      return;
    }

    if (
      isSettingEnabled("enableSingleTapHud") &&
      canvas.activeLayer?.options?.name === "tokens" &&
      canvas.hud?.token
    ) {
      const hitToken = findTokenAtPos(upPos);
      if (hitToken) {
        openTokenHudFor(hitToken);
      }
    }
  };

  canvas.stage.on("pointerdowncapture", onStageDown);
  canvas.stage.on("pointerupcapture", onStageUp);
};
