export type Caret = { top: number; left: number; bottom: number };

function copyProperties(
  source: HTMLElement,
  target: HTMLElement,
  properties: string[],
) {
  const computedStyle = getComputedStyle(source);
  properties.forEach((property) => {
    target.style.setProperty(
      property,
      computedStyle.getPropertyValue(property),
    );
  });
}

export function createMirror(textarea: HTMLTextAreaElement) {
  const mirror = document.createElement("div");
  mirror.className = "mirror";

  const ImportantProperties = [
    "fontFamily",
    "fontSize",
    "fontWeight",
    "fontStyle",
    "letterSpacing",
    "lineHeight",
    "padding",
    "textTransform",
    "textIndent",
  ];
  copyProperties(textarea, mirror, ImportantProperties);
  textarea.parentElement?.appendChild(mirror);
  return mirror;
}

//If someone would enter "<span id="caret"></span>" or so:
function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;") //
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

export function updateMirror(
  mirror: HTMLDivElement,
  textarea: HTMLTextAreaElement,
  value: string,
  cursor: number,
) {
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);
  mirror.innerHTML =
    escapeHtml(before) + '<span id="caret"></span>' + escapeHtml(after);
  mirror.style.width = textarea.offsetWidth + "px";
  mirror.style.height = textarea.offsetHeight + "px";
  mirror.scrollTop = textarea.scrollTop;
}

export function getCaretCoordinates(
  mirror: HTMLDivElement,
  textarea: HTMLTextAreaElement,
) {
  const parent = textarea.parentElement;
  const caret = mirror.querySelector("#caret");
  if (!caret || !parent) return null;
  const caretRect = caret.getBoundingClientRect();
  const parentRect = parent.getBoundingClientRect();
  return {
    top: caretRect.top - parentRect.top,
    left: caretRect.left - parentRect.left,
    bottom: caretRect.bottom - parentRect.top,
  };
}
