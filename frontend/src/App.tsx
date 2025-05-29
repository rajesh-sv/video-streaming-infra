import { Routes, Route, Navigate } from "react-router";
import { Home } from "@/pages/home";
import { Upload } from "@/pages/upload";
import { Signup } from "@/pages/signup";
import { Login } from "@/pages/login";
import { Toaster } from "sonner";
import { useAuthContext } from "@/contexts/authContext";
import { Logout } from "@/components/logout";
import { useEffect } from "react";

function App() {
  const { userAuthenticated, setUserAuthenticated } = useAuthContext();

  useEffect(() => {
    fetch("/api/auth/verify", { method: "POST" })
      .then((res) => res.json())
      .then((resObj) => setUserAuthenticated(!resObj.error));
  }, []);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex items-center gap-8">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          Video Streaming Infra
        </h1>
        {userAuthenticated && <Logout />}
      </div>
      <Routes>
        <Route
          path="/"
          element={userAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={userAuthenticated ? <Navigate to="/" /> : <Signup />}
        />
        <Route
          path="/login"
          element={userAuthenticated ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/upload"
          element={userAuthenticated ? <Upload /> : <Navigate to="/login" />}
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
