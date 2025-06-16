import React, { useState } from "react";
import MainView from "./components/MainView";

// Dummy user for demonstration.
// Replace with your real login logic/user management.
const DEMO_USER = { userId: "123456", username: "JohnDoe" };

function App() {
  const [user, setUser] = useState(DEMO_USER);

  // For a real app, show a login page when user is null.
  if (!user) return <div>Login here...</div>;

  return (
    <MainView
      currentUser={user}
      onLogout={() => setUser(null)}
      onOpenPostCreation={() => alert("Show Post Creation form!")}
    />
  );
}

export default App;