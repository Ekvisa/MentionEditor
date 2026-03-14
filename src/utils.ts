import type { RefObject } from "react";

export function createMirror(textarea: HTMLTextAreaElement) {
  const mirror = document.createElement("div");
  mirror.className = "mirror";

  const style = window.getComputedStyle(textarea);

  mirror.style.position = "absolute";
  mirror.style.top = textarea.offsetTop + "px";
  mirror.style.left = textarea.offsetLeft + "px";

  mirror.style.width = textarea.offsetWidth + "px";

  mirror.style.fontFamily = style.fontFamily;
  mirror.style.fontSize = style.fontSize;
  mirror.style.lineHeight = style.lineHeight;
  mirror.style.padding = style.padding;

  mirror.style.boxSizing = "border-box";
  mirror.style.border = style.border;

  mirror.style.whiteSpace = "pre-wrap";
  //   mirror.style.wordWrap = "break-word";

  //   mirror.style.visibility = "hidden"; - return at the end

  textarea.parentElement?.appendChild(mirror);

  return mirror;
}

export function updateMirror(
  mirror: HTMLDivElement,
  value: string,
  cursor: number,
) {
  const before = value.slice(0, cursor);
  const after = value.slice(cursor);

  mirror.innerHTML = before + '<span id="caret"></span>' + after; //before.replace(/\n/g, "<br>") for word wrap
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

export function putMirrorDiv(
  textareaRef: RefObject<HTMLTextAreaElement | null>,
  //   textarea: HTMLTextAreaElement,
  //   cursor: number,
  beforeCursor: string,
) {
  const textarea = textareaRef.current;
  if (!textarea) {
    return;
  }

  const textareaStyle = window.getComputedStyle(textarea);

  const mirrorDiv = document.createElement("div");

  mirrorDiv.className = "mirror";

  mirrorDiv.style.fontFamily = textareaStyle.fontFamily;
  mirrorDiv.style.fontSize = textareaStyle.fontSize;
  mirrorDiv.style.fontWeight = textareaStyle.fontWeight;
  mirrorDiv.style.fontStyle = textareaStyle.fontStyle;
  mirrorDiv.style.letterSpacing = textareaStyle.letterSpacing;
  mirrorDiv.style.lineHeight = textareaStyle.lineHeight;
  mirrorDiv.style.padding = textareaStyle.padding;
  mirrorDiv.style.whiteSpace = textareaStyle.whiteSpace;
  //word-wrap
  mirrorDiv.style.width = textarea.offsetWidth + "px";

  mirrorDiv.innerHTML =
    beforeCursor.replace(/\n/g, "<br/>").replace(/ /g, "&nbsp;") +
    '<span id="caret"></span>';

  document.body.appendChild(mirrorDiv);
}

export function setCaretPosition() {}
