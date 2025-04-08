import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Amplify } from "aws-amplify";

Amplify.configure({
  Interactions: {
    LexV2: {
      jcandbot: {
        aliasId: "TSTALIASID",
        botId: "2J7WFDYDMG",
        localeId: "en_US",
        region: "us-east-1",
      },
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
