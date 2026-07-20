/* @ds-bundle: {"format":4,"namespace":"AlltagsmathematikDesignSystem_d0bd27","components":[{"name":"Badge","sourcePath":"components/display/Badge.jsx"},{"name":"Card","sourcePath":"components/display/Card.jsx"},{"name":"ProgressBar","sourcePath":"components/display/ProgressBar.jsx"},{"name":"ProgressRing","sourcePath":"components/display/ProgressRing.jsx"},{"name":"Tag","sourcePath":"components/display/Tag.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Button","sourcePath":"components/forms/Button.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"IconButton","sourcePath":"components/forms/IconButton.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Radio","sourcePath":"components/forms/Radio.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"Icon","sourcePath":"components/icons/Icon.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"}],"sourceHashes":{"components/display/Badge.jsx":"4d24205537cd","components/display/Card.jsx":"d8c150f2ed06","components/display/ProgressBar.jsx":"51760f2dbb2a","components/display/ProgressRing.jsx":"c8d5f92447b1","components/display/Tag.jsx":"a5f1cdb57d8f","components/feedback/Dialog.jsx":"03285e428dad","components/feedback/Toast.jsx":"1163387467f4","components/feedback/Tooltip.jsx":"4e7b44c247c9","components/forms/Button.jsx":"dc9ada3b64db","components/forms/Checkbox.jsx":"ddfb72e41eb4","components/forms/IconButton.jsx":"38ce6817e4d6","components/forms/Input.jsx":"7d0a4cda6f61","components/forms/Radio.jsx":"fd0e329405b0","components/forms/Select.jsx":"41d7b46885b8","components/forms/Switch.jsx":"1442eb41f908","components/icons/Icon.jsx":"a65a224babdf","components/navigation/Tabs.jsx":"4798eaa48d5d","ui_kits/website/ActivityScreen.jsx":"b257bf731d38","ui_kits/website/HomeScreen.jsx":"299944637890","ui_kits/website/Nav.jsx":"082612f99548","ui_kits/website/TopicScreen.jsx":"ba9c3226b4ce"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.AlltagsmathematikDesignSystem_d0bd27 = window.AlltagsmathematikDesignSystem_d0bd27 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/display/Badge.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-badge-css")) return;
  var s = document.createElement("style");
  s.id = "am-badge-css";
  s.textContent = `
.am-badge{display:inline-flex;align-items:center;gap:6px;height:24px;padding:0 10px;border-radius:var(--radius-full);font:500 var(--text-sm)/1 var(--font-brand);white-space:nowrap}
.am-badge--sm{height:20px;padding:0 8px;font-size:var(--text-xs)}
.am-badge--gray{background:var(--gray-100);color:var(--gray-700)}
.am-badge--brand{background:var(--brand-50);color:var(--brand-700)}
.am-badge--accent{background:var(--accent-50);color:var(--accent-700)}
.am-badge--success{background:var(--success-50);color:var(--success-700)}
.am-badge--error{background:var(--error-50);color:var(--error-700)}
.am-badge--outline{background:#fff;border:1px solid var(--border-default);color:var(--gray-700)}
`;
  document.head.appendChild(s);
})();
function Badge({
  color = "gray",
  size = "md",
  icon,
  style,
  children
}) {
  return React.createElement("span", {
    className: `am-badge am-badge--${color}${size === "sm" ? " am-badge--sm" : ""}`,
    style
  }, icon, children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Badge.jsx", error: String((e && e.message) || e) }); }

// components/display/Card.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-card-css")) return;
  var s = document.createElement("style");
  s.id = "am-card-css";
  s.textContent = `
.am-card{background:var(--surface-card);border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-xs);font-family:var(--font-brand);box-sizing:border-box}
.am-card--interactive{cursor:pointer;transition:box-shadow var(--dur-base) var(--ease-standard),border-color var(--dur-base) var(--ease-standard)}
.am-card--interactive:hover{box-shadow:var(--shadow-md);border-color:var(--brand-200)}
.am-card--inverse{background:var(--surface-inverse);border-color:var(--surface-inverse);color:#fff}
.am-card--subtle{background:var(--surface-subtle);box-shadow:none}
`;
  document.head.appendChild(s);
})();
function Card({
  variant = "default",
  interactive,
  padding = 24,
  onClick,
  style,
  children
}) {
  return React.createElement("div", {
    onClick,
    className: `am-card${interactive ? " am-card--interactive" : ""}${variant !== "default" ? ` am-card--${variant}` : ""}`,
    style: {
      padding,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Card.jsx", error: String((e && e.message) || e) }); }

// components/display/ProgressBar.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-progress-css")) return;
  var s = document.createElement("style");
  s.id = "am-progress-css";
  s.textContent = `
.am-progress{display:flex;align-items:center;gap:12px;font-family:var(--font-brand)}
.am-progress__track{flex:1;height:8px;border-radius:var(--radius-full);background:var(--gray-100);overflow:hidden}
.am-progress__fill{height:100%;border-radius:var(--radius-full);background:var(--accent-500);transition:width .4s var(--ease-standard)}
.am-progress--brand .am-progress__fill{background:var(--brand-600)}
.am-progress__label{font-size:var(--text-sm);font-weight:500;color:var(--text-secondary);min-width:40px;text-align:right}
`;
  document.head.appendChild(s);
})();
function ProgressBar({
  value = 0,
  max = 100,
  color = "accent",
  showLabel,
  label,
  style
}) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return React.createElement("div", {
    className: `am-progress${color === "brand" ? " am-progress--brand" : ""}`,
    style,
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max
  }, React.createElement("div", {
    className: "am-progress__track"
  }, React.createElement("div", {
    className: "am-progress__fill",
    style: {
      width: pct + "%"
    }
  })), showLabel ? React.createElement("span", {
    className: "am-progress__label"
  }, label ?? Math.round(pct) + "%") : null);
}
Object.assign(__ds_scope, { ProgressBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProgressBar.jsx", error: String((e && e.message) || e) }); }

// components/display/ProgressRing.jsx
try { (() => {
function ProgressRing({
  value = 0,
  max = 100,
  size = 56,
  strokeWidth = 6,
  color = "var(--accent-500)",
  track = "var(--gray-100)",
  label,
  style
}) {
  const r = (size - strokeWidth) / 2,
    c = 2 * Math.PI * r,
    pct = Math.max(0, Math.min(1, value / max));
  return React.createElement("div", {
    style: {
      position: "relative",
      width: size,
      height: size,
      flex: "none",
      fontFamily: "var(--font-brand)",
      ...style
    },
    role: "progressbar",
    "aria-valuenow": value,
    "aria-valuemax": max
  }, React.createElement("svg", {
    width: size,
    height: size,
    style: {
      transform: "rotate(-90deg)"
    }
  }, React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r,
    fill: "none",
    stroke: track,
    strokeWidth
  }), React.createElement("circle", {
    cx: size / 2,
    cy: size / 2,
    r,
    fill: "none",
    stroke: color,
    strokeWidth,
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: c * (1 - pct),
    style: {
      transition: "stroke-dashoffset .4s var(--ease-standard)"
    }
  })), React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: size / 4.2,
      fontWeight: 700,
      color: "var(--brand-800)"
    }
  }, label ?? Math.round(pct * 100) + "%"));
}
Object.assign(__ds_scope, { ProgressRing });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/ProgressRing.jsx", error: String((e && e.message) || e) }); }

// components/display/Tag.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-tag-css")) return;
  var s = document.createElement("style");
  s.id = "am-tag-css";
  s.textContent = `
.am-tag{display:inline-flex;align-items:center;gap:6px;height:26px;padding:0 10px;border:1px solid var(--border-default);border-radius:var(--radius-sm);background:#fff;font:500 var(--text-sm)/1 var(--font-brand);color:var(--gray-700)}
.am-tag button{all:unset;display:inline-flex;cursor:pointer;color:var(--gray-400)}
.am-tag button:hover{color:var(--gray-600)}
.am-tag--selected{background:var(--brand-50);border-color:var(--brand-300);color:var(--brand-700)}
`;
  document.head.appendChild(s);
})();
const x = React.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2.5,
  strokeLinecap: "round"
}, React.createElement("path", {
  d: "M18 6 6 18M6 6l12 12"
}));
function Tag({
  selected,
  onRemove,
  style,
  children
}) {
  return React.createElement("span", {
    className: `am-tag${selected ? " am-tag--selected" : ""}`,
    style
  }, children, onRemove ? React.createElement("button", {
    type: "button",
    "aria-label": "Entfernen",
    onClick: onRemove
  }, x) : null);
}
Object.assign(__ds_scope, { Tag });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/display/Tag.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-dialog-css")) return;
  var s = document.createElement("style");
  s.id = "am-dialog-css";
  s.textContent = `
.am-dialog__overlay{position:fixed;inset:0;background:rgba(14,22,41,.55);display:flex;align-items:center;justify-content:center;padding:24px;z-index:50}
.am-dialog{background:#fff;border-radius:var(--radius-xl);box-shadow:var(--shadow-xl);max-width:480px;width:100%;padding:24px;font-family:var(--font-brand);position:relative}
.am-dialog__title{font-size:var(--text-lg);font-weight:700;color:var(--brand-800);margin:0 0 8px}
.am-dialog__body{font-size:var(--text-md);line-height:var(--text-md-lh);color:var(--text-secondary)}
.am-dialog__actions{display:flex;gap:12px;justify-content:flex-end;margin-top:24px}
.am-dialog__close{all:unset;cursor:pointer;position:absolute;top:16px;right:16px;color:var(--gray-400);display:flex;padding:4px;border-radius:var(--radius-sm)}
.am-dialog__close:hover{color:var(--gray-600);background:var(--gray-100)}
`;
  document.head.appendChild(s);
})();
const x = React.createElement("svg", {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round"
}, React.createElement("path", {
  d: "M18 6 6 18M6 6l12 12"
}));
function Dialog({
  open,
  title,
  onClose,
  actions,
  inline,
  style,
  children
}) {
  if (!open) return null;
  const panel = React.createElement("div", {
    className: "am-dialog",
    role: "dialog",
    "aria-modal": !inline,
    style,
    onClick: e => e.stopPropagation()
  }, onClose ? React.createElement("button", {
    className: "am-dialog__close",
    "aria-label": "Schliessen",
    onClick: onClose
  }, x) : null, title ? React.createElement("h2", {
    className: "am-dialog__title"
  }, title) : null, React.createElement("div", {
    className: "am-dialog__body"
  }, children), actions ? React.createElement("div", {
    className: "am-dialog__actions"
  }, actions) : null);
  if (inline) return panel;
  return React.createElement("div", {
    className: "am-dialog__overlay",
    onClick: onClose
  }, panel);
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-toast-css")) return;
  var s = document.createElement("style");
  s.id = "am-toast-css";
  s.textContent = `
.am-toast{display:flex;align-items:flex-start;gap:12px;background:#fff;border:1px solid var(--border-default);border-radius:var(--radius-lg);box-shadow:var(--shadow-lg);padding:14px 16px;font-family:var(--font-brand);max-width:400px}
.am-toast__dot{width:10px;height:10px;border-radius:50%;flex:none;margin-top:5px}
.am-toast__title{font-size:var(--text-sm);font-weight:600;color:var(--brand-800)}
.am-toast__msg{font-size:var(--text-sm);color:var(--text-secondary);margin-top:2px}
.am-toast__close{all:unset;cursor:pointer;color:var(--gray-400);margin-left:auto;display:flex;padding:2px}
.am-toast__close:hover{color:var(--gray-600)}
`;
  document.head.appendChild(s);
})();
const colors = {
  success: "var(--success-500)",
  error: "var(--error-500)",
  warning: "var(--warning-500)",
  info: "var(--brand-500)"
};
const x = React.createElement("svg", {
  width: 16,
  height: 16,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round"
}, React.createElement("path", {
  d: "M18 6 6 18M6 6l12 12"
}));
function Toast({
  status = "info",
  title,
  message,
  onClose,
  style
}) {
  return React.createElement("div", {
    className: "am-toast",
    role: "status",
    style
  }, React.createElement("span", {
    className: "am-toast__dot",
    style: {
      background: colors[status]
    }
  }), React.createElement("div", null, title ? React.createElement("div", {
    className: "am-toast__title"
  }, title) : null, message ? React.createElement("div", {
    className: "am-toast__msg"
  }, message) : null), onClose ? React.createElement("button", {
    className: "am-toast__close",
    "aria-label": "Schliessen",
    onClick: onClose
  }, x) : null);
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-tooltip-css")) return;
  var s = document.createElement("style");
  s.id = "am-tooltip-css";
  s.textContent = `
.am-tooltip{position:relative;display:inline-flex}
.am-tooltip__tip{position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);background:var(--brand-900);color:#fff;font:500 var(--text-xs)/var(--text-xs-lh) var(--font-brand);padding:6px 10px;border-radius:var(--radius-md);white-space:nowrap;opacity:0;pointer-events:none;transition:opacity var(--dur-fast) var(--ease-standard);z-index:40}
.am-tooltip__tip::after{content:"";position:absolute;top:100%;left:50%;transform:translateX(-50%);border:5px solid transparent;border-top-color:var(--brand-900)}
.am-tooltip:hover .am-tooltip__tip,.am-tooltip:focus-within .am-tooltip__tip,.am-tooltip--open .am-tooltip__tip{opacity:1}
`;
  document.head.appendChild(s);
})();
function Tooltip({
  content,
  open,
  style,
  children
}) {
  return React.createElement("span", {
    className: `am-tooltip${open ? " am-tooltip--open" : ""}`,
    style
  }, children, React.createElement("span", {
    className: "am-tooltip__tip",
    role: "tooltip"
  }, content));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Button.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-btn-css")) return;
  var s = document.createElement("style");
  s.id = "am-btn-css";
  s.textContent = `
.am-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;border:1px solid transparent;border-radius:var(--radius-md);font-family:var(--font-brand);font-weight:600;cursor:pointer;transition:background var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard),border-color var(--dur-fast) var(--ease-standard);text-decoration:none;white-space:nowrap}
.am-btn:focus-visible{outline:none;box-shadow:var(--focus-ring)}
.am-btn--sm{height:36px;padding:0 14px;font-size:var(--text-sm)}
.am-btn--md{height:40px;padding:0 16px;font-size:var(--text-sm)}
.am-btn--lg{height:44px;padding:0 18px;font-size:var(--text-md)}
.am-btn--xl{height:48px;padding:0 20px;font-size:var(--text-md)}
.am-btn--primary{background:var(--action-primary);color:var(--text-on-brand)}
.am-btn--primary:hover{background:var(--action-primary-hover)}
.am-btn--primary:active{background:var(--action-primary-press)}
.am-btn--accent{background:var(--action-accent);color:var(--text-on-accent)}
.am-btn--accent:hover{background:var(--action-accent-hover)}
.am-btn--accent:active{background:var(--action-accent-press)}
.am-btn--secondary{background:var(--surface-card);border-color:var(--border-strong);color:var(--brand-800);box-shadow:var(--shadow-xs)}
.am-btn--secondary:hover{background:var(--gray-50)}
.am-btn--secondary:active{background:var(--gray-100)}
.am-btn--tertiary{background:transparent;color:var(--brand-700)}
.am-btn--tertiary:hover{background:var(--brand-50)}
.am-btn--tertiary:active{background:var(--brand-100)}
.am-btn--destructive{background:var(--error-600);color:#fff}
.am-btn--destructive:hover{background:var(--error-700)}
.am-btn[disabled]{cursor:not-allowed;background:var(--gray-100);border-color:transparent;color:var(--text-disabled);box-shadow:none}
`;
  document.head.appendChild(s);
})();
function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  iconLeading,
  iconTrailing,
  disabled,
  onClick,
  type = "button",
  style,
  children
}) {
  return React.createElement("button", {
    type,
    disabled,
    onClick,
    className: `am-btn am-btn--${size} am-btn--${variant}`,
    style: {
      width: fullWidth ? "100%" : undefined,
      ...style
    }
  }, iconLeading, children, iconTrailing);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-check-css")) return;
  var s = document.createElement("style");
  s.id = "am-check-css";
  s.textContent = `
.am-check{display:inline-flex;align-items:flex-start;gap:10px;cursor:pointer;font-family:var(--font-brand)}
.am-check input{position:absolute;opacity:0;width:0;height:0}
.am-check__box{width:20px;height:20px;flex:none;border:1px solid var(--border-strong);border-radius:var(--radius-sm);background:#fff;display:inline-flex;align-items:center;justify-content:center;transition:all var(--dur-fast) var(--ease-standard);margin-top:2px}
.am-check__box svg{opacity:0;transform:scale(.6);transition:all var(--dur-fast) var(--ease-standard)}
.am-check input:checked+.am-check__box{background:var(--brand-800);border-color:var(--brand-800)}
.am-check input:checked+.am-check__box svg{opacity:1;transform:scale(1)}
.am-check input:focus-visible+.am-check__box{box-shadow:var(--focus-ring)}
.am-check:hover .am-check__box{border-color:var(--brand-400)}
.am-check__text{font-size:var(--text-md);line-height:24px;color:var(--text-primary)}
.am-check--disabled{cursor:not-allowed}.am-check--disabled .am-check__text{color:var(--text-disabled)}
.am-check--disabled .am-check__box{background:var(--gray-50);border-color:var(--gray-200)}
`;
  document.head.appendChild(s);
})();
const tick = React.createElement("svg", {
  width: 12,
  height: 12,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "#fff",
  strokeWidth: 3.5,
  strokeLinecap: "round",
  strokeLinejoin: "round"
}, React.createElement("path", {
  d: "M20 6 9 17l-5-5"
}));
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  style
}) {
  return React.createElement("label", {
    className: `am-check${disabled ? " am-check--disabled" : ""}`,
    style
  }, React.createElement("input", {
    type: "checkbox",
    checked,
    defaultChecked,
    onChange,
    disabled
  }), React.createElement("span", {
    className: "am-check__box"
  }, tick), label ? React.createElement("span", {
    className: "am-check__text"
  }, label) : null);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/IconButton.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-iconbtn-css")) return;
  var s = document.createElement("style");
  s.id = "am-iconbtn-css";
  s.textContent = `
.am-iconbtn{display:inline-flex;align-items:center;justify-content:center;border:1px solid transparent;border-radius:var(--radius-md);background:transparent;color:var(--gray-600);cursor:pointer;transition:background var(--dur-fast) var(--ease-standard)}
.am-iconbtn:hover{background:var(--gray-100);color:var(--brand-800)}
.am-iconbtn:active{background:var(--gray-200)}
.am-iconbtn:focus-visible{outline:none;box-shadow:var(--focus-ring)}
.am-iconbtn--sm{width:36px;height:36px}.am-iconbtn--md{width:40px;height:40px}.am-iconbtn--lg{width:44px;height:44px}
.am-iconbtn--secondary{background:var(--surface-card);border-color:var(--border-strong);box-shadow:var(--shadow-xs);color:var(--brand-800)}
.am-iconbtn--secondary:hover{background:var(--gray-50)}
.am-iconbtn--primary{background:var(--action-primary);color:#fff}
.am-iconbtn--primary:hover{background:var(--action-primary-hover);color:#fff}
.am-iconbtn[disabled]{cursor:not-allowed;background:var(--gray-100);color:var(--text-disabled)}
`;
  document.head.appendChild(s);
})();
function IconButton({
  variant = "ghost",
  size = "md",
  label,
  disabled,
  onClick,
  style,
  children
}) {
  return React.createElement("button", {
    type: "button",
    "aria-label": label,
    disabled,
    onClick,
    className: `am-iconbtn am-iconbtn--${size}${variant !== "ghost" ? ` am-iconbtn--${variant}` : ""}`,
    style
  }, children);
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-field-css")) return;
  var s = document.createElement("style");
  s.id = "am-field-css";
  s.textContent = `
.am-field{display:flex;flex-direction:column;gap:6px;font-family:var(--font-brand)}
.am-field__label{font-size:var(--text-sm);font-weight:500;color:var(--gray-700)}
.am-field__wrap{position:relative;display:flex;align-items:center}
.am-field__icon{position:absolute;left:12px;color:var(--gray-500);display:inline-flex;pointer-events:none}
.am-input{width:100%;box-sizing:border-box;height:44px;padding:0 14px;border:1px solid var(--border-strong);border-radius:var(--radius-md);background:var(--surface-card);box-shadow:var(--shadow-xs);font:400 var(--text-md) var(--font-brand);color:var(--text-primary);transition:border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)}
.am-input::placeholder{color:var(--text-tertiary)}
.am-input:focus{outline:none;border-color:var(--accent-500);box-shadow:var(--focus-ring)}
.am-input--sm{height:40px;font-size:var(--text-sm)}
.am-input--icon{padding-left:40px}
.am-input[disabled]{background:var(--gray-50);color:var(--text-disabled);cursor:not-allowed}
.am-field--error .am-input{border-color:var(--error-500)}
.am-field--error .am-input:focus{box-shadow:0 0 0 4px rgba(240,68,56,.18)}
.am-field__hint{font-size:var(--text-sm);color:var(--text-tertiary)}
.am-field--error .am-field__hint{color:var(--error-600)}
`;
  document.head.appendChild(s);
})();
function Input({
  label,
  hint,
  error,
  size = "md",
  iconLeading,
  style,
  ...rest
}) {
  const cls = `am-input${size === "sm" ? " am-input--sm" : ""}${iconLeading ? " am-input--icon" : ""}`;
  return React.createElement("label", {
    className: `am-field${error ? " am-field--error" : ""}`,
    style
  }, label ? React.createElement("span", {
    className: "am-field__label"
  }, label) : null, React.createElement("span", {
    className: "am-field__wrap"
  }, iconLeading ? React.createElement("span", {
    className: "am-field__icon"
  }, iconLeading) : null, React.createElement("input", {
    className: cls,
    ...rest
  })), error || hint ? React.createElement("span", {
    className: "am-field__hint"
  }, error || hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Radio.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-radio-css")) return;
  var s = document.createElement("style");
  s.id = "am-radio-css";
  s.textContent = `
.am-radio{display:inline-flex;align-items:flex-start;gap:10px;cursor:pointer;font-family:var(--font-brand)}
.am-radio input{position:absolute;opacity:0;width:0;height:0}
.am-radio__dot{width:20px;height:20px;flex:none;border:1px solid var(--border-strong);border-radius:50%;background:#fff;display:inline-flex;align-items:center;justify-content:center;transition:all var(--dur-fast) var(--ease-standard);margin-top:2px}
.am-radio__dot::after{content:"";width:8px;height:8px;border-radius:50%;background:#fff;transform:scale(0);transition:transform var(--dur-fast) var(--ease-standard)}
.am-radio input:checked+.am-radio__dot{background:var(--brand-800);border-color:var(--brand-800)}
.am-radio input:checked+.am-radio__dot::after{transform:scale(1)}
.am-radio input:focus-visible+.am-radio__dot{box-shadow:var(--focus-ring)}
.am-radio:hover .am-radio__dot{border-color:var(--brand-400)}
.am-radio__text{font-size:var(--text-md);line-height:24px;color:var(--text-primary)}
.am-radio--card{border:1px solid var(--border-default);border-radius:var(--radius-lg);padding:14px 16px;width:100%;box-sizing:border-box;background:#fff;transition:all var(--dur-fast) var(--ease-standard)}
.am-radio--card:hover{border-color:var(--brand-300)}
.am-radio--card.am-radio--checked{border-color:var(--brand-800);box-shadow:0 0 0 1px var(--brand-800)}
`;
  document.head.appendChild(s);
})();
function Radio({
  label,
  name,
  value,
  checked,
  defaultChecked,
  onChange,
  disabled,
  card,
  style
}) {
  return React.createElement("label", {
    className: `am-radio${card ? " am-radio--card" : ""}${card && checked ? " am-radio--checked" : ""}`,
    style
  }, React.createElement("input", {
    type: "radio",
    name,
    value,
    checked,
    defaultChecked,
    onChange,
    disabled
  }), React.createElement("span", {
    className: "am-radio__dot"
  }), label ? React.createElement("span", {
    className: "am-radio__text"
  }, label) : null);
}
Object.assign(__ds_scope, { Radio });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Radio.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-select-css")) return;
  var s = document.createElement("style");
  s.id = "am-select-css";
  s.textContent = `
.am-select{appearance:none;width:100%;box-sizing:border-box;height:44px;padding:0 40px 0 14px;border:1px solid var(--border-strong);border-radius:var(--radius-md);background:var(--surface-card) url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="%236f7891" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>') no-repeat right 12px center;box-shadow:var(--shadow-xs);font:400 var(--text-md) var(--font-brand);color:var(--text-primary);cursor:pointer;transition:border-color var(--dur-fast) var(--ease-standard),box-shadow var(--dur-fast) var(--ease-standard)}
.am-select:focus{outline:none;border-color:var(--accent-500);box-shadow:var(--focus-ring)}
.am-select[disabled]{background-color:var(--gray-50);color:var(--text-disabled);cursor:not-allowed}
`;
  document.head.appendChild(s);
})();
function Select({
  label,
  hint,
  options = [],
  placeholder,
  value,
  onChange,
  disabled,
  style
}) {
  return React.createElement("label", {
    className: "am-field",
    style
  }, label ? React.createElement("span", {
    className: "am-field__label"
  }, label) : null, React.createElement("select", {
    className: "am-select",
    value: value ?? "",
    onChange,
    disabled
  }, placeholder ? React.createElement("option", {
    value: "",
    disabled: true
  }, placeholder) : null, options.map(o => {
    const v = typeof o === "string" ? {
      value: o,
      label: o
    } : o;
    return React.createElement("option", {
      key: v.value,
      value: v.value
    }, v.label);
  })), hint ? React.createElement("span", {
    className: "am-field__hint"
  }, hint) : null);
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-switch-css")) return;
  var s = document.createElement("style");
  s.id = "am-switch-css";
  s.textContent = `
.am-switch{display:inline-flex;align-items:center;gap:10px;cursor:pointer;font-family:var(--font-brand)}
.am-switch input{position:absolute;opacity:0;width:0;height:0}
.am-switch__track{width:40px;height:22px;flex:none;border-radius:var(--radius-full);background:var(--gray-200);position:relative;transition:background var(--dur-fast) var(--ease-standard)}
.am-switch__track::after{content:"";position:absolute;top:2px;left:2px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:var(--shadow-sm);transition:left var(--dur-fast) var(--ease-standard)}
.am-switch input:checked+.am-switch__track{background:var(--brand-800)}
.am-switch input:checked+.am-switch__track::after{left:20px}
.am-switch input:focus-visible+.am-switch__track{box-shadow:var(--focus-ring)}
.am-switch__text{font-size:var(--text-md);color:var(--text-primary)}
`;
  document.head.appendChild(s);
})();
function Switch({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled,
  style
}) {
  return React.createElement("label", {
    className: "am-switch",
    style
  }, React.createElement("input", {
    type: "checkbox",
    role: "switch",
    checked,
    defaultChecked,
    onChange,
    disabled
  }), React.createElement("span", {
    className: "am-switch__track"
  }), label ? React.createElement("span", {
    className: "am-switch__text"
  }, label) : null);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/icons/Icon.jsx
try { (() => {
(function () {
  if (typeof document !== "undefined" && !document.getElementById("am-lucide")) {
    var s = document.createElement("script");
    s.id = "am-lucide";
    s.src = "https://unpkg.com/lucide@0.462.0/dist/umd/lucide.min.js";
    document.head.appendChild(s);
  }
})();
function Icon({
  name,
  size = 20,
  strokeWidth = 2,
  color = "currentColor",
  style,
  className
}) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    let tries = 0;
    function draw() {
      const el = ref.current;
      if (!el) return;
      const lu = window.lucide;
      if (!lu || !lu.icons) {
        if (tries++ < 40) setTimeout(draw, 100);
        return;
      }
      const pascal = String(name).split("-").map(p => p.charAt(0).toUpperCase() + p.slice(1)).join("");
      const node = lu.icons[pascal];
      if (!node) return;
      el.innerHTML = "";
      const svg = lu.createElement(node);
      svg.setAttribute("width", size);
      svg.setAttribute("height", size);
      svg.setAttribute("stroke-width", strokeWidth);
      el.appendChild(svg);
    }
    draw();
  }, [name, size, strokeWidth]);
  return React.createElement("span", {
    ref,
    className,
    "aria-hidden": true,
    style: {
      display: "inline-flex",
      flex: "none",
      color,
      lineHeight: 0,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/icons/Icon.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
(function () {
  if (typeof document === "undefined" || document.getElementById("am-tabs-css")) return;
  var s = document.createElement("style");
  s.id = "am-tabs-css";
  s.textContent = `
.am-tabs{display:flex;gap:4px;border-bottom:1px solid var(--border-default);font-family:var(--font-brand)}
.am-tabs button{all:unset;cursor:pointer;padding:10px 14px;font-size:var(--text-sm);font-weight:600;color:var(--gray-500);border-bottom:2px solid transparent;margin-bottom:-1px;transition:color var(--dur-fast) var(--ease-standard)}
.am-tabs button:hover{color:var(--brand-700)}
.am-tabs button:focus-visible{box-shadow:var(--focus-ring);border-radius:var(--radius-sm)}
.am-tabs button[aria-selected="true"]{color:var(--brand-800);border-bottom-color:var(--accent-500)}
.am-tabs--pills{border-bottom:none;gap:8px}
.am-tabs--pills button{border:1px solid var(--border-default);border-radius:var(--radius-full);padding:8px 16px;margin-bottom:0}
.am-tabs--pills button[aria-selected="true"]{background:var(--brand-800);border-color:var(--brand-800);color:#fff}
`;
  document.head.appendChild(s);
})();
function Tabs({
  tabs = [],
  value,
  onChange,
  variant = "underline",
  style
}) {
  const [inner, setInner] = React.useState(tabs[0]?.value ?? tabs[0]);
  const cur = value ?? inner;
  return React.createElement("div", {
    className: `am-tabs${variant === "pills" ? " am-tabs--pills" : ""}`,
    role: "tablist",
    style
  }, tabs.map(t => {
    const o = typeof t === "string" ? {
      value: t,
      label: t
    } : t;
    return React.createElement("button", {
      key: o.value,
      role: "tab",
      "aria-selected": cur === o.value,
      onClick: () => {
        setInner(o.value);
        onChange && onChange(o.value);
      }
    }, o.label);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/ActivityScreen.jsx
try { (() => {
const {
  Button,
  Card,
  Radio,
  ProgressBar,
  Icon,
  IconButton,
  Toast
} = window.AlltagsmathematikDesignSystem_d0bd27 || {};
function ActivityScreen({
  onBack
}) {
  const [choice, setChoice] = React.useState(null);
  const [checked, setChecked] = React.useState(false);
  const correct = "63";
  const opts = [{
    v: "77",
    l: "CHF 77.– (90 − 13)"
  }, {
    v: "63",
    l: "CHF 63.– (90 − 27)"
  }, {
    v: "70",
    l: "CHF 70.– (90 − 20)"
  }];
  return /*#__PURE__*/React.createElement("main", {
    style: {
      background: "var(--gray-50)",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "0 auto",
      padding: "16px 32px",
      display: "flex",
      alignItems: "center",
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    label: "Zur\xFCck",
    onClick: onBack
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "x",
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(ProgressBar, {
    value: 3,
    max: 8,
    showLabel: true,
    label: "3 von 8"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 760,
      margin: "0 auto",
      padding: "40px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 13px var(--font-brand)",
      letterSpacing: ".06em",
      textTransform: "uppercase",
      color: "var(--text-accent)",
      marginBottom: 8
    }
  }, "Einkaufen \xB7 20% Rabatt"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "800 30px/38px var(--font-brand)",
      letterSpacing: "-0.02em",
      color: "var(--brand-800)",
      margin: "0 0 12px"
    }
  }, "Was kostet die Jacke jetzt?"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 18px/28px var(--font-brand)",
      color: "var(--text-secondary)",
      margin: "0 0 24px"
    }
  }, "Eine Jacke kostet CHF 90.\u2013. Im Schaufenster steht: \xAB30% Rabatt auf alles\xBB."), /*#__PURE__*/React.createElement(Card, {
    padding: 16,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      marginBottom: 24,
      background: "var(--brand-25)",
      border: "1px dashed var(--brand-200)",
      boxShadow: "none"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "lightbulb",
    size: 20,
    color: "var(--accent-600)"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 15px/22px var(--font-brand)",
      color: "var(--text-secondary)"
    }
  }, "Tipp: 10% von 90 sind 9. Rechnen Sie zuerst 10%, dann mal 3.")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10,
      marginBottom: 24
    }
  }, opts.map(o => /*#__PURE__*/React.createElement(Radio, {
    key: o.v,
    name: "answer",
    card: true,
    label: o.l,
    checked: choice === o.v,
    onChange: () => {
      setChoice(o.v);
      setChecked(false);
    }
  }))), checked && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, choice === correct ? /*#__PURE__*/React.createElement(Toast, {
    status: "success",
    title: "Richtig!",
    message: "90 \u2212 27 = 63. Die Jacke kostet CHF 63.\u2013."
  }) : /*#__PURE__*/React.createElement(Toast, {
    status: "error",
    title: "Noch nicht ganz",
    message: "30% von 90 sind 27. Versuchen Sie es nochmals."
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between"
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary",
    iconLeading: /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 18
    })
  }, "Video nochmals ansehen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "secondary",
    onClick: onBack
  }, "Sp\xE4ter weitermachen"), checked && choice === correct ? /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    iconTrailing: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    })
  }, "N\xE4chste Aufgabe") : /*#__PURE__*/React.createElement(Button, {
    disabled: !choice,
    onClick: () => setChecked(true)
  }, "Antwort pr\xFCfen")))));
}
Object.assign(window, {
  ActivityScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/ActivityScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
const {
  Button,
  Card,
  Badge,
  ProgressBar,
  Icon
} = window.AlltagsmathematikDesignSystem_d0bd27 || {};
const amTopics = [{
  id: "einkaufen",
  icon: "shopping-cart",
  title: "Einkaufen",
  desc: "Preise vergleichen, Rabatte, Wechselgeld",
  count: "8 Aufgaben · 2 Videos",
  done: 5,
  total: 8
}, {
  id: "zeit",
  icon: "clock",
  title: "Zeit und Fahrplan",
  desc: "Uhrzeiten, Dauer, den Zug erwischen",
  count: "10 Aufgaben · 3 Videos",
  done: 2,
  total: 10
}, {
  id: "geld",
  icon: "wallet",
  title: "Budget und Geld",
  desc: "Lohnabrechnung, Miete, ein Budget machen",
  count: "9 Aufgaben · 2 Videos",
  done: 0,
  total: 9
}, {
  id: "masse",
  icon: "ruler",
  title: "Masse und Gewichte",
  desc: "Kochen, Heimwerken, Distanzen schätzen",
  count: "7 Aufgaben · 2 Videos",
  done: 7,
  total: 7
}, {
  id: "prozente",
  icon: "pie-chart",
  title: "Prozente",
  desc: "Rabatte, Zinsen, Mehrwertsteuer",
  count: "8 Aufgaben · 2 Videos",
  done: 3,
  total: 8
}, {
  id: "daten",
  icon: "bar-chart-3",
  title: "Tabellen und Diagramme",
  desc: "Formulare lesen, Statistiken verstehen",
  count: "6 Aufgaben · 1 Video",
  done: 0,
  total: 6
}];
function Hero({
  onStart
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: "relative",
      overflow: "hidden",
      background: "var(--brand-800)"
    }
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 1280 420",
    preserveAspectRatio: "xMidYMid slice",
    style: {
      position: "absolute",
      inset: 0,
      width: "100%",
      height: "100%"
    },
    fill: "none",
    strokeLinecap: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "1120",
    cy: "60",
    r: "190",
    stroke: "rgba(255,255,255,.07)",
    strokeWidth: "56"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M960 480 v-200 a130 130 0 0 1 260 0 v80",
    stroke: "rgba(204,102,0,.5)",
    strokeWidth: "56"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "120",
    cy: "470",
    r: "150",
    stroke: "rgba(255,255,255,.05)",
    strokeWidth: "56"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "88px 32px 96px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 640
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 14px var(--font-brand)",
      letterSpacing: ".08em",
      textTransform: "uppercase",
      color: "var(--accent-300)",
      marginBottom: 16
    }
  }, "Kostenlos \xB7 Ohne Anmeldung starten"), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "800 60px/1.1 var(--font-brand)",
      letterSpacing: "-0.02em",
      color: "#fff",
      margin: 0
    }
  }, "Rechnen im Alltag. Schritt f\xFCr Schritt."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 20px/30px var(--font-brand)",
      color: "var(--brand-200)",
      margin: "20px 0 32px",
      maxWidth: 520
    }
  }, "Kurze Videos und \xDCbungen f\xFCr alles, was Sie im Alltag rechnen: einkaufen, Fahrplan lesen, Budget machen."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "xl",
    iconTrailing: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 20
    }),
    onClick: onStart
  }, "Jetzt \xFCben"), /*#__PURE__*/React.createElement(Button, {
    size: "xl",
    variant: "secondary",
    iconLeading: /*#__PURE__*/React.createElement(Icon, {
      name: "play",
      size: 20
    })
  }, "Video ansehen")))));
}
function HomeScreen({
  onTopic
}) {
  return /*#__PURE__*/React.createElement("main", null, /*#__PURE__*/React.createElement(Hero, {
    onStart: () => onTopic("einkaufen")
  }), /*#__PURE__*/React.createElement("section", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "64px 32px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "space-between",
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      font: "800 36px/44px var(--font-brand)",
      letterSpacing: "-0.02em",
      color: "var(--brand-800)",
      margin: 0
    }
  }, "W\xE4hlen Sie ein Thema"), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 18px/28px var(--font-brand)",
      color: "var(--text-secondary)",
      margin: "8px 0 0"
    }
  }, "Alle Themen kommen aus dem Alltag. Sie brauchen kein Vorwissen.")), /*#__PURE__*/React.createElement("a", {
    style: {
      font: "600 16px var(--font-brand)"
    },
    href: "#"
  }, "Alle Themen")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "repeat(3,1fr)",
      gap: 24
    }
  }, amTopics.map(t => /*#__PURE__*/React.createElement(Card, {
    key: t.id,
    interactive: true,
    onClick: () => onTopic(t.id)
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      marginBottom: 16
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 48,
      height: 48,
      borderRadius: "50%",
      background: t.done === t.total ? "var(--success-50)" : "var(--brand-50)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: t.done === t.total ? "var(--success-600)" : "var(--brand-700)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: t.icon,
    size: 24
  })), t.done === t.total ? /*#__PURE__*/React.createElement(Badge, {
    color: "success",
    icon: /*#__PURE__*/React.createElement(Icon, {
      name: "check",
      size: 12
    })
  }, "Fertig") : t.done > 0 ? /*#__PURE__*/React.createElement(Badge, {
    color: "accent"
  }, "Am \xDCben") : /*#__PURE__*/React.createElement(Badge, {
    color: "gray"
  }, "Neu")), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "700 20px var(--font-brand)",
      color: "var(--brand-800)"
    }
  }, t.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 15px/22px var(--font-brand)",
      color: "var(--text-secondary)",
      margin: "6px 0 16px"
    }
  }, t.desc), /*#__PURE__*/React.createElement(ProgressBar, {
    value: t.done,
    max: t.total,
    showLabel: true,
    label: t.done + " von " + t.total
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 13px var(--font-brand)",
      color: "var(--text-tertiary)",
      marginTop: 10
    }
  }, t.count))))), /*#__PURE__*/React.createElement("footer", {
    style: {
      borderTop: "1px solid var(--border-default)",
      padding: "32px",
      textAlign: "center",
      font: "400 14px var(--font-brand)",
      color: "var(--text-tertiary)"
    }
  }, "alltagsmathematik.ch \xB7 nach dem Orientierungsrahmen Mathematik (SBFI)"));
}
Object.assign(window, {
  HomeScreen,
  amTopics
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Nav.jsx
try { (() => {
const {
  Button
} = window.AlltagsmathematikDesignSystem_d0bd27 || {};
function Wordmark({
  dark,
  height = 30,
  onClick
}) {
  return /*#__PURE__*/React.createElement("a", {
    onClick: onClick,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10,
      cursor: "pointer",
      textDecoration: "none"
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: dark ? "../../assets/logo-white.svg" : "../../assets/logo-primary.svg",
    style: {
      height
    },
    alt: ""
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 18px var(--font-brand)",
      color: dark ? "#fff" : "var(--brand-800)",
      letterSpacing: "-0.01em"
    }
  }, "alltagsmathematik.ch"));
}
function Nav({
  onNav,
  active
}) {
  const link = (id, label) => /*#__PURE__*/React.createElement("a", {
    onClick: () => onNav(id),
    style: {
      font: "600 15px var(--font-brand)",
      color: active === id ? "var(--accent-600)" : "var(--gray-600)",
      textDecoration: "none",
      cursor: "pointer",
      padding: "8px 4px"
    }
  }, label);
  return /*#__PURE__*/React.createElement("header", {
    style: {
      position: "sticky",
      top: 0,
      zIndex: 30,
      background: "rgba(255,255,255,.95)",
      backdropFilter: "blur(4px)",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: "var(--container-max)",
      margin: "0 auto",
      padding: "0 32px",
      height: 72,
      display: "flex",
      alignItems: "center",
      gap: 32
    }
  }, /*#__PURE__*/React.createElement(Wordmark, {
    onClick: () => onNav("home")
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      display: "flex",
      gap: 24,
      marginLeft: 24
    }
  }, link("topic", "Themen"), link("videos", "Videos"), link("about", "Über uns")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginLeft: "auto",
      display: "flex",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "tertiary"
  }, "Anmelden"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent"
  }, "Jetzt \xFCben"))));
}
Object.assign(window, {
  Nav,
  Wordmark
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Nav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/TopicScreen.jsx
try { (() => {
const {
  Button,
  Card,
  Badge,
  Tabs,
  ProgressRing,
  Icon,
  Tooltip,
  IconButton
} = window.AlltagsmathematikDesignSystem_d0bd27 || {};
const einkaufenItems = [{
  type: "video",
  title: "Video: Preise vergleichen",
  meta: "4 min",
  state: "done"
}, {
  type: "task",
  title: "Wechselgeld kontrollieren",
  meta: "5 Fragen · leicht",
  state: "done"
}, {
  type: "task",
  title: "Angebote vergleichen: 500 g oder 1 kg?",
  meta: "6 Fragen · leicht",
  state: "done"
}, {
  type: "video",
  title: "Video: Rabatte verstehen",
  meta: "6 min",
  state: "done"
}, {
  type: "task",
  title: "20% Rabatt — was kostet es jetzt?",
  meta: "8 Fragen · mittel",
  state: "active"
}, {
  type: "task",
  title: "Aktionen im Prospekt lesen",
  meta: "5 Fragen · mittel",
  state: "open"
}, {
  type: "task",
  title: "Einkauf im Kopf überschlagen",
  meta: "6 Fragen · mittel",
  state: "open"
}, {
  type: "task",
  title: "Der grosse Einkaufstest",
  meta: "10 Fragen · schwer",
  state: "open"
}];
function Row({
  it,
  onOpen
}) {
  const done = it.state === "done";
  return /*#__PURE__*/React.createElement("div", {
    onClick: onOpen,
    style: {
      display: "flex",
      alignItems: "center",
      gap: 16,
      padding: "16px 20px",
      borderBottom: "1px solid var(--border-default)",
      cursor: "pointer",
      background: it.state === "active" ? "var(--accent-25)" : "#fff"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 40,
      height: 40,
      borderRadius: "50%",
      flex: "none",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: done ? "var(--success-50)" : it.state === "active" ? "var(--accent-100)" : "var(--gray-100)",
      color: done ? "var(--success-600)" : it.state === "active" ? "var(--accent-600)" : "var(--gray-500)"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: done ? "check" : it.type === "video" ? "play" : "pencil",
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 16px var(--font-brand)",
      color: "var(--brand-800)"
    }
  }, it.title), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "400 14px var(--font-brand)",
      color: "var(--text-tertiary)",
      marginTop: 2
    }
  }, it.meta)), it.state === "active" && /*#__PURE__*/React.createElement(Badge, {
    color: "accent"
  }, "Weiter \xFCben"), /*#__PURE__*/React.createElement(Icon, {
    name: "chevron-right",
    size: 20,
    color: "var(--gray-400)"
  }));
}
function TopicScreen({
  onHome,
  onActivity
}) {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      background: "var(--gray-50)",
      minHeight: "100vh"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      borderBottom: "1px solid var(--border-default)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: "0 auto",
      padding: "32px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("a", {
    onClick: onHome,
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6,
      font: "600 14px var(--font-brand)",
      cursor: "pointer",
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-left",
    size: 16
  }), "Alle Themen"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 24,
      paddingBottom: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 64,
      height: 64,
      borderRadius: "50%",
      background: "var(--brand-800)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff"
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "shopping-cart",
    size: 30
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement(Badge, {
    color: "brand"
  }, "Niveau A2\u2013B1"), /*#__PURE__*/React.createElement(Badge, {
    color: "outline"
  }, "8 Aufgaben \xB7 2 Videos")), /*#__PURE__*/React.createElement("h1", {
    style: {
      font: "800 30px/38px var(--font-brand)",
      letterSpacing: "-0.02em",
      color: "var(--brand-800)",
      margin: 0
    }
  }, "Einkaufen")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(ProgressRing, {
    value: 4,
    max: 8,
    size: 64,
    label: "4/8"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: "500 14px/20px var(--font-brand)",
      color: "var(--text-secondary)"
    }
  }, "Ihr", /*#__PURE__*/React.createElement("br", null), "Fortschritt"))), /*#__PURE__*/React.createElement(Tabs, {
    tabs: ["Alle", "Videos", "Aufgaben"]
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 960,
      margin: "0 auto",
      padding: "32px"
    }
  }, /*#__PURE__*/React.createElement(Card, {
    padding: 0,
    style: {
      overflow: "hidden"
    }
  }, einkaufenItems.map((it, i) => /*#__PURE__*/React.createElement(Row, {
    key: i,
    it: it,
    onOpen: onActivity
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      justifyContent: "center",
      marginTop: 32
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "lg",
    iconTrailing: /*#__PURE__*/React.createElement(Icon, {
      name: "arrow-right",
      size: 18
    }),
    onClick: onActivity
  }, "Weiter \xFCben: 20% Rabatt"))));
}
Object.assign(window, {
  TopicScreen
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/TopicScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.ProgressBar = __ds_scope.ProgressBar;

__ds_ns.ProgressRing = __ds_scope.ProgressRing;

__ds_ns.Tag = __ds_scope.Tag;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Radio = __ds_scope.Radio;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Tabs = __ds_scope.Tabs;

})();
