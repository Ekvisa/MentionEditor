export function createMirror(textarea: HTMLTextAreaElement) {
  const mirror = document.createElement("div");
  mirror.className = "mirror";

  const style = window.getComputedStyle(textarea);

  mirror.style.position = "absolute";
  mirror.style.top = "0";
  mirror.style.right = "0";
  //   mirror.style.top = textarea.offsetTop + "px";
  //   mirror.style.left = textarea.offsetLeft + "px";

  //   mirror.style.width = textarea.offsetWidth + "px";
  //   mirror.style.height = textarea.offsetHeight + "px";
  //    mirror.scrollTop = textarea.scrollTop;

  mirror.style.fontFamily = style.fontFamily;
  mirror.style.fontSize = style.fontSize;
  mirror.style.lineHeight = style.lineHeight;
  mirror.style.padding = style.padding;

  mirror.style.boxSizing = "border-box";
  //   mirror.style.border = style.border;

  mirror.style.whiteSpace = "pre-wrap";

  //   mirror.style.visibility = "hidden"; - return at the end

  textarea.parentElement?.appendChild(mirror);

  return mirror;
}

//If someone enter "<span id="caret"></span>" or so:
function escapeHtml(text: string) {
  return text
    .replace(/&/g, "&amp;") //
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
}

export function updateMirror( // +resize
  mirror: HTMLDivElement,
  textarea: HTMLTextAreaElement,
  value: string,
  cursor: number,
) {
  //   mirror.style.top = textarea.offsetTop + "px";
  //   mirror.style.left = textarea.offsetLeft + "px";
  mirror.style.width = textarea.offsetWidth + "px";
  mirror.style.height = textarea.offsetHeight + "px";
  mirror.scrollTop = textarea.scrollTop; //
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  mirror.innerHTML =
    escapeHtml(before) + '<span id="caret"></span>' + escapeHtml(after);
}

export function getCaretCoordinates(mirror: HTMLDivElement) {
  const caret = mirror.querySelector("#caret");

  if (!caret) return null;

  const rect = caret.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
  };
}
