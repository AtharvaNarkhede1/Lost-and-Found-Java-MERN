import React, { useState } from "react";
import MainView from './components/MainView';
import AdminView from './components/AdminView';
import LoginView from './components/LoginView';
import PostView from './components/PostView'; // Ensure this path is correct

function App() {
  const [user, setUser] = useState(null);
  const [showPostForm, setShowPostForm] = useState(false);
  const [reloadPosts, setReloadPosts] = useState(false);

  // Handler to trigger reload in MainView
  const handlePostSuccess = () => {
    setShowPostForm(false);
    setReloadPosts((r) => !r); // Toggle to force reload in MainView
  };

  // When not logged in, show the login/register view
  if (!user) {
    return (
      <LoginView onLoginSuccess={user => setUser({ ...user, userId: user._id })} />
    );
  }

  // If logged in user is admin, show admin view
  if (user.isAdmin) {
    return (
      <AdminView
        currentUser={user}
        onLogout={() => setUser(null)}
      />
    );
  }

  // When logged in as normal user, show the main app view
  return (
    <>
      <MainView
        currentUser={user}
        onLogout={() => setUser(null)}
        onOpenPostCreation={() => setShowPostForm(true)}
        reloadPosts={reloadPosts}
      />
      <PostView
        open={showPostForm}
        onClose={() => setShowPostForm(false)}
        currentUser={user}
        onSuccess={handlePostSuccess}
      />
    </>
  );
}

export default App;