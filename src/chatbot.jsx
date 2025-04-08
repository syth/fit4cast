// Chatbot.jsx
import React, { useState } from "react";
import {
  LexRuntimeV2Client,
  RecognizeTextCommand,
} from "@aws-sdk/client-lex-runtime-v2";
import { Auth } from "aws-amplify";

// Replace with your actual Lex V2 details:
const botId = "2J7WFDYDMG";
const botAliasId = "TSTALIASID";
const localeId = "en_US";
const sessionId = "session-" + Date.now();
const Chatbot = () => {
  const [input, setInput] = useState("");
  const [conversation, setConversation] = useState([]);

  const sendMessage = async (message) => {
    // Obtain AWS credentials for signing the request
    const credentials = await Auth.currentCredentials();

    const client = new LexRuntimeV2Client({
      region: "us-east-1",
      credentials: Auth.essentialCredentials(credentials),
    });

    const params = {
      botId,
      botAliasId,
      localeId,
      sessionId,
      text: message,
    };

    const command = new RecognizeTextCommand(params);
    try {
      const response = await client.send(command);
      // Update conversation: add your message
      setConversation((prev) => [...prev, { from: "user", text: message }]);

      // Add each bot response message to your conversation.
      if (response.messages) {
        response.messages.forEach((msg) => {
          setConversation((prev) => [
            ...prev,
            { from: "bot", text: msg.content },
          ]);
        });
      }
    } catch (error) {
      console.error("Error communicating with Lex:", error);
      setConversation((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Sorry, there was an error processing your request.",
        },
      ]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input.trim());
      setInput("");
    }
  };

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "1rem", marginTop: "1rem" }}
    >
      <h2>Chat with the Bot</h2>
      <div
        style={{
          height: "200px",
          overflowY: "scroll",
          border: "1px solid #eee",
          padding: "0.5rem",
        }}
      >
        {conversation.map((msg, index) => (
          <div
            key={index}
            style={{
              textAlign: msg.from === "user" ? "right" : "left",
              margin: "0.5rem 0",
            }}
          >
            <span
              style={{
                background: msg.from === "user" ? "#dcf8c6" : "#f1f0f0",
                padding: "0.5rem",
                borderRadius: "4px",
              }}
            >
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} style={{ marginTop: "1rem" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          style={{ width: "80%", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chatbot;
