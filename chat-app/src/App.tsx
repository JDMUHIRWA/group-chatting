import { useEffect, useState } from "react";
import mysocket from "./utils/socket";

function App() {
  const [messages, setMessages] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");
  const [group, setGroup] = useState("");

  const joinGroup = () => {
    if (group !== "") {
      mysocket.emit("join_group", group);
    }
  };

  const sendMessage = () => {
    mysocket.emit("message", { messages, group });
  };

  useEffect(() => {
    mysocket.on("receive_message", (data) => {
      setReceivedMessage(data.messages);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        {/* Header */}
        <div className="bg-blue-600 rounded-t-xl p-6">
          <h1 className="text-2xl font-bold text-white">Chat App</h1>
        </div>

        {/* Group Join Section */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter group number"
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={joinGroup}
              className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors duration-200"
            >
              Join Group
            </button>
          </div>
        </div>

        {/* Chat Section */}
        <div className="p-6">
          {/* Messages Display */}
          <div className="mb-6 h-[400px] bg-gray-50 rounded-lg p-4 overflow-y-auto">
            {receivedMessage && (
              <div className="bg-blue-100 rounded-lg p-3 mb-2 max-w-[80%]">
                <h2 className="text-gray-800">{receivedMessage}</h2>
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Type your message here"
              value={messages}
              onChange={(e) => setMessages(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={sendMessage}
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
