import "./Textarea.scss";
import { users } from "../../users";
import { useEffect, useRef, useState } from "react";
import {
  createMirror,
  getCaretCoordinates,
  updateMirror,
  type Caret,
} from "../../utils";

function Textarea() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState(users);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [caret, setCaret] = useState<Caret | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const handleResize = () => {
      const textarea = textareaRef.current;
      const mirror = mirrorRef.current;

      if (!textarea || !mirror) return;

      mirror.style.width = textarea.offsetWidth + "px";

      const cursor = textarea.selectionStart;
      const value = textarea.value;

      updateMirror(mirror, textarea, value, cursor);

      const caretCoords = getCaretCoordinates(mirror, textarea);
      if (caretCoords) {
        setCaret(caretCoords);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const active = document.querySelector(".dropdown .active");
    active?.scrollIntoView({
      block: "nearest",
    });
  }, [activeIndex]);

  //Set states while symbol typing:
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    setText(value);

    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

    const beforeCursor = value.slice(0, cursor); //working with string before cursor
    const match = beforeCursor.match(/@(\w*)$/); //find "@" and any count ("*") of letters, numbers, or "-" ("\w") after it, at the string end ("$")

    if (!match) {
      setIsOpen(false);
      return;
    }

    if (!mirrorRef.current) {
      mirrorRef.current = createMirror(textarea);
    }

    const mirror = mirrorRef.current;
    updateMirror(mirror, textarea, value, cursor);
    const caretCoords = getCaretCoordinates(mirror, textarea);

    if (caretCoords) {
      setCaret(caretCoords);
    }

    const query = match[1]; // match[0] is a full match (ex.: "@to"), but we need a caption grop (ex.: "to")

    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.fullname.toLowerCase().includes(query.toLowerCase()),
    );

    setSuggestions(filtered);
    setActiveIndex(0);
    setIsOpen(filtered.length > 0);
  };

  //Insert the username:
  const insertMention = (username: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const cursor = textarea.selectionStart;
    const before = text.slice(0, cursor);
    const after = text.slice(cursor);
    const newText = before.replace(/@(\w*)$/, `@${username} `) + after;
    setText(newText);
    setIsOpen(false);
  };

  //List reactions on pressing keys:
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }

    if (e.key === "Enter") {
      e.preventDefault();
      insertMention(suggestions[activeIndex].username);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  //Hide the list if click outside it:
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (listRef.current && !listRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="wrapper wrapper_textarea">
      <textarea
        className="message message_textarea"
        ref={textareaRef}
        value={text}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
      />

      {isOpen && caret && (
        <ul
          className="dropdown"
          ref={listRef}
          style={{
            left: `${caret.left}px`,
            top: `${caret.top}px`,
          }}
        >
          {suggestions.map((user, index) => {
            const firstLetter = user.fullname[0];
            const secondLetterMatch = user.fullname.match(/\s(\w)/); //first letter after whitespace
            const secondLetter = secondLetterMatch ? secondLetterMatch[1] : "";

            return (
              <li
                key={user.username}
                className={index === activeIndex ? "active" : ""}
                onMouseDown={() => insertMention(user.username)}
              >
                <p className="avatar">
                  {user.avatar || (
                    <span>
                      {firstLetter}
                      {secondLetter}
                    </span>
                  )}
                </p>
                <p className="fullname">{user.fullname}</p>
                <p className="username">{"@" + user.username}</p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default Textarea;
