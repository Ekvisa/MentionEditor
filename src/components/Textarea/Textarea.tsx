import "./Textarea.scss";
import { users } from "../../users";
import { useRef, useState } from "react";
import { createMirror, getCaretCoordinates, updateMirror } from "../../utils";

function Textarea() {
  const [text, setText] = useState("");
  const [suggestions, setSuggestions] = useState(users);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const [caret, setCaret] = useState<{ left: number; top: number } | null>(
    null,
  );

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const mirrorRef = useRef<HTMLDivElement | null>(null);

  //   if (!mirrorRef.current) {
  //   mirrorRef.current = createMirror(textarea);
  // }

  // const mirror = mirrorRef.current;

  //Set states while symbol typing:
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursor = e.target.selectionStart;

    setText(value);

    const textarea = textareaRef.current; //duplication - ?
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";

    const beforeCursor = value.slice(0, cursor); //working with string before cursor
    const match = beforeCursor.match(/@(\w*)$/); //find "@" and any count ("*") of letters, numbers, or "-" ("\w") after it, at the string end ("$")

    if (!match) {
      setIsOpen(false);
      return;
    }

    //put mirrorDiv, mirrorDiv.text = beforeCursor
    // putMirrorDiv(textareaRef, cursor, beforeCursor);

    if (!mirrorRef.current) {
      mirrorRef.current = createMirror(textarea);
    }

    const mirror = mirrorRef.current;
    updateMirror(mirror, value, cursor);
    const caretCoords = getCaretCoordinates(mirror);

    if (caretCoords) {
      setCaret({
        left: caretCoords.left,
        top: caretCoords.bottom,
      });
    }

    const query = match[1]; // why not match[0]: match is array like ["@to", "to"], and we need text after "@".

    const filtered = users.filter(
      (u) =>
        u.username.toLowerCase().includes(query.toLowerCase()) ||
        u.fullname.toLowerCase().includes(query.toLowerCase()),
    );

    setSuggestions(filtered);
    setActiveIndex(0);
    setIsOpen(filtered.length > 0);
  };

  //Paste username:
  const insertMention = (username: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursor = textarea.selectionStart;

    const before = text.slice(0, cursor); //// text is ?
    const after = text.slice(cursor);

    const newBefore = before.replace(/@(\w*)$/, `@${username} `); ////

    const newText = newBefore + after;

    setText(newText);
    setIsOpen(false);
  };

  //Choosing a username by keys
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === "ArrowDown") {
      e.preventDefault(); //// to prevent reaction to textarea?
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) =>
        prev === 0 ? suggestions.length - 1 : prev - 1,
      );
    }

    if (e.key === "Enter") {
      e.preventDefault();
      insertMention(suggestions[activeIndex].username);
    }

    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

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
          style={{
            left: `${caret.left}px`,
            top: `${caret.top}px`,
            position: "fixed", // ?
          }}
        >
          {suggestions.map((user, index) => {
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
                      {user.fullname[0]}
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
