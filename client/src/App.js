import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import HomePage from "scenes/homePage";
import LoginPage from "scenes/loginPage";
import ProfilePage from "scenes/profilePage";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material";
import { themeSettings } from "theme";
import AnimeHomePage from "scenes/animePage";
import GameHomePage from "scenes/gamePage";
import EditProfilePage from "scenes/editProfilePage";
import AdminLoginPage from "scenes/admin/adminLoginPage";
import AdminHomePage from "scenes/admin/adminHomePage";
import ManageUserPage from "scenes/admin/manageUser.jsx";
import ManagePostsPage from "scenes/admin/managePostPage";
import AdminViewPostPage from "scenes/admin/viewPostPage.jsx";
import ProtectedRoute from "ProtectedRoutes";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));
  const role = useSelector((state) => state.role);

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuth ? <HomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/home/anime"
              element={isAuth ? <AnimeHomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/home/game"
              element={isAuth ? <GameHomePage /> : <Navigate to="/login" />}
            />
            <Route
              path="/profile/:userId"
              element={isAuth ? <ProfilePage /> : <Navigate to="/login" />}
            />

            <Route
              path="/profile/manage/:userId"
              element={isAuth ? <EditProfilePage /> : <Navigate to="/login" />}
            />

            {/*Admin Routes */}
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute role={role} isAuth={isAuth} />}>
              <Route path="/admin/home" element={<AdminHomePage />} />
              <Route path="/admin/manage/users" element={<ManageUserPage />} />
              <Route path="/admin/manage/posts" element={<ManagePostsPage />} />
              <Route
                path="/admin/view/post/:postId"
                element={<AdminViewPostPage />}
              />
            </Route>
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
