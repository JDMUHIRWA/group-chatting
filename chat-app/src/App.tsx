import { useEffect, useState } from "react";
import mysocket from "./utils/socket";

function App() {
  // States for input and messages
  const [input, setInput] = useState("");
  const [texts, setTexts] = useState<string[]>([]);

  // Function to handle sending messages
  const sendMessage = () => {
    if (input.trim()) {
      const newMessage = { sender: "me", message: input };

      // Add the message locally to the chat
      setTexts((prevTexts) => [...prevTexts, newMessage]);

      // Emit the message to the server
      mysocket.emit("message", newMessage);

      setInput(""); // Clear input field
    }
  };

  // Handle receiving messages
  useEffect(() => {
    mysocket.on("receive_message", (data) => {
      setTexts((prevTexts) => [...prevTexts, data]); // Add the received message
    });

    return () => {
      mysocket.off("receive_message"); // Cleanup listener on unmount
    };
  }, []);

  return (
    <>
      {/* Header Section */}
      <div className="flex flex-col items-center bg-gray-100 p-5 font-serif fixed w-full top-0">
        <h1 className="text-2xl font-bold">Chat App</h1>
        <p className="text-gray-600">Welcome to the chat app!</p>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col items-center bg-gray-200 p-24 mt-20 h-[calc(100vh-162px)] overflow-y-auto">
        {texts.length === 0 ? (
          <small className="text-gray-500">
            Chat messages will appear here.
          </small>
        ) : (
          <ul className="w-full max-w-md">
            {texts.map((text, index) => (
              <li
                key={index}
                className={`p-2 my-2 rounded-lg shadow-sm ${
                  text.sender === "me"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-white text-gray-800"
                }`}
              >
                {text.message}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Input Section */}
      <div className="flex items-center justify-center bg-gray-100 p-5 fixed bottom-0 w-full">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-3/4 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Type your message"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-lg ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </>
  );
}

export default App;
