import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="text-center text-blue-500">
      <h1 className="text-3xl font-bold">Hello, Tailwind!</h1>
    </div>
  );
}

export default App;
