import Hint from "../Hint/Hint";
import Textarea from "../Textarea/Textarea";
import "./App.scss";

function App() {
  return (
    <div className="app">
      <h1>Mention Editor</h1>
      <Hint />
      <Textarea />
    </div>
  );
}

export default App;
