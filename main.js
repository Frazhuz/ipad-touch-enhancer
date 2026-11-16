const MODULE_ID = "ipad-touch-enchancer-main";
const STORAGE_KEY = "ipad-touch-toggles-state-v5";
let activeMode = "none"; // "none" | "double" | "right"

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

const savePanelState = (state) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {}
};

const panelState = loadPanelState();

const isModuleEnabled = () => {
  try {
    return Boolean(game.settings.get(MODULE_ID, "enableModule"));
  } catch {
    return true;
  }
};

const isSettingEnabled = (key) => {
  if (!isModuleEnabled()) return false;
  try {
    return Boolean(game.settings.get(MODULE_ID, key));
  } catch {
    return true;
  }
};

const syncBodyFeatureClasses = () => {
  if (!document.body) return;
  document.body.classList.toggle("ipad-enhancer-hide-arrow", isSettingEnabled("hideHudElevationArrow"));
  document.body.classList.toggle("ipad-enhancer-fix-windows", isSettingEnabled("fixSafariWindows"));
  document.body.classList.toggle("ipad-enhancer-fix-inputs", isSettingEnabled("fixSafariInputs"));
};

const setPanelVisibility = (isVisible) => {
  panelState.visible = Boolean(isVisible);
  savePanelState(panelState);

  const panel = document.getElementById("ipad-touch-toggles");
  const barEnabled = isSettingEnabled("enableTouchBar");
  if (panel) {
    panel.style.display = barEnabled && panelState.visible ? "flex" : "none";
  }

  if ((!barEnabled || !panelState.visible) && activeMode !== "none") {
    activeMode = "none";
    panel?.querySelectorAll("button[data-mode]").forEach((btn) => btn.classList.remove("active"));
  }
};

const applyMasterToggleState = () => {
  syncBodyFeatureClasses();
  setPanelVisibility(panelState.visible);
  ui.controls?.render();
  canvas.hud?.token?.render();
};

// 1. Register client-scoped settings
Hooks.once("init", () => {
  game.settings.register(MODULE_ID, "enableModule", {
    name: "Enable iPadOS Safari Touch & UI Enhancer",
    hint: "Master switch to enable or disable all features and visual fixes of this module for your client.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: applyMasterToggleState
  });

  game.settings.register(MODULE_ID, "enableTouchBar", {
    name: "Floating Touch Modifier Bar (2x / Right-Click)",
    hint: "Displays a compact, draggable bar for emulating Double-Click and Right-Click, along with a visibility toggle button in the left Scene Controls.",
    scope: "client",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      setPanelVisibility(panelState.visible);
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
});

// 2. Add top-level toggle button to left Scene Controls
Hooks.on("getSceneControlButtons", (controls) => {
  if (!isSettingEnabled("enableTouchBar")) return;

  const toggleControl = {
    name: "ipad-touch-panel",
    title: "Touch Modifier Bar (2x / Right-Click)",
    icon: "fa-solid fa-hand-pointer",
    layer: "tokens",
    order: 99,
    toggle: true,
    active: panelState.visible,
    visible: true,
    tools: {},
    onChange: (_event, active) => {
      const nextState = typeof active === "boolean" ? active : !panelState.visible;
      setPanelVisibility(nextState);
    },
    onClick: () => {
      setPanelVisibility(!panelState.visible);
    }
  };

  if (Array.isArray(controls)) {
    controls.push(toggleControl);
  } else if (controls && typeof controls === "object") {
    controls["ipad-touch-panel"] = toggleControl;
  }
});

// 3. Initialize UI and canvas/sidebar listeners
Hooks.once("ready", () => {
  syncBodyFeatureClasses();
  document.getElementById("ipad-touch-toggles")?.remove();

  // Floating bar markup (2x, Right-Click, Lock)
  const panel = document.createElement("div");
  panel.id = "ipad-touch-toggles";
  panel.style.display = isSettingEnabled("enableTouchBar") && panelState.visible ? "flex" : "none";
  panel.innerHTML = `
    <span class="drag-handle" title="Drag bar"><i class="fas fa-grip-vertical"></i></span>
    <button type="button" data-mode="double" title="Next tap = Double-Click">
      <i class="fas fa-hand-pointer"></i> 2x
    </button>
    <button type="button" data-mode="right" title="Next tap = Right-Click">
      <i class="fas fa-mouse"></i> RMB
    </button>
    <button type="button" class="lock-btn" title="Lock / Unlock position">
      <i class="fas fa-lock-open"></i>
    </button>
  `;
  document.body.appendChild(panel);

  const applyPosition = () => {
    if (panel.style.display === "none") return;
    const rect = panel.getBoundingClientRect();
    const maxX = Math.max(8, window.innerWidth - (rect.width || 170) - 8);
    const maxY = Math.max(8, window.innerHeight - (rect.height || 44) - 8);
    panelState.left = Math.min(Math.max(8, panelState.left), maxX);
    panelState.top = Math.min(Math.max(8, panelState.top), maxY);
    panel.style.left = `${Math.round(panelState.left)}px`;
    panel.style.top = `${Math.round(panelState.top)}px`;
  };

  const lockBtn = panel.querySelector(".lock-btn");
  const updateLockUI = () => {
    panel.classList.toggle("locked", panelState.locked);
    lockBtn.innerHTML = panelState.locked
      ? '<i class="fas fa-lock"></i>'
      : '<i class="fas fa-lock-open"></i>';
  };

  updateLockUI();
  applyPosition();
  window.addEventListener("resize", applyPosition);

  ["touchstart", "touchend", "pointerdown", "pointerup", "click"].forEach((evt) => {
    panel.addEventListener(evt, (e) => e.stopPropagation());
  });

  // Drag handle logic
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
        applyPosition();
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

  // Position lock toggle
  lockBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    panelState.locked = !panelState.locked;
    updateLockUI();
    applyPosition();
    savePanelState(panelState);
  });

  // Scene hit-testing helpers
  const distToSegment = (p, v, w) => {
    const l2 = (v.x - w.x) ** 2 + (v.y - w.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  };

  const findTokenAtPos = (pos) => {
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

  const modeButtons = panel.querySelectorAll("button[data-mode]");
  const setMode = (mode) => {
    activeMode = mode;
    modeButtons.forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.mode === activeMode);
    });
  };

  const executeCanvasAction = (pos, mode) => {
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

  // PixiJS capture-phase stage listener
  const attachStageListener = () => {
    if (!canvas?.stage || canvas.stage._ipadTogglesHooked) return;
    canvas.stage._ipadTogglesHooked = true;

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
        setMode("none");
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
          if (!hitToken.controlled) {
            hitToken.control({ releaseOthers: true });
          }
          if (canvas.tokens.controlled.length === 1 && canvas.hud.token.object !== hitToken) {
            canvas.hud.token.bind(hitToken);
          }
        }
      }
    };

    canvas.stage.on("pointerdowncapture", onStageDown);
    canvas.stage.on("pointerupcapture", onStageUp);
  };

  attachStageListener();
  Hooks.on("canvasReady", attachStageListener);

  // Instant Token HUD enhancement via MutationObserver
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

  const hudContainer = document.getElementById("hud") || document.body;
  const hudObserver = new MutationObserver(() => {
    const tokenHudEl = document.getElementById("token-hud");
    if (tokenHudEl) enhanceTokenHUD(tokenHudEl);
  });
  hudObserver.observe(hudContainer, { childList: true, subtree: true });

  // Right sidebar (#sidebar: scenes, actors, etc.)
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.addEventListener(
      "click",
      (e) => {
        if (!isSettingEnabled("enableTouchBar") || activeMode === "none") return;

        e.stopImmediatePropagation();
        e.preventDefault();

        const chosenMode = activeMode;
        setMode("none");

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

  // Bar mode buttons
  modeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const clickedMode = btn.dataset.mode;
      setMode(activeMode === clickedMode ? "none" : clickedMode);
    });
  });
});
