import ReactDOM from "react-dom/client";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useState } from "react";

import App from "./App";
import "./index.css";
import { getTheme } from "./theme";

const httpLink = createHttpLink({
  uri: import.meta.env.VITE_API_URL
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ""
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

// ✅ ROOT COMPONENT
function Root() {
  const [mode, setMode] = useState(
    localStorage.getItem("theme") || "light"
  );

  const toggleTheme = () => {
    const next = mode === "light" ? "dark" : "light";
    setMode(next);
    localStorage.setItem("theme", next);
  };

  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={getTheme(mode)}>
        <CssBaseline />
        <App toggleTheme={toggleTheme} mode={mode} />
      </ThemeProvider>
    </ApolloProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
