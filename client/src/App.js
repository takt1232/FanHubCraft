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
import EditPost from "scenes/editPostPage.jsx";
import EditProfilePage from "scenes/editProfilePage";

function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuth = Boolean(useSelector((state) => state.token));

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
              element={
                isAuth ? <ProfilePage /> : <EditProfilePage to="/login" />
              }
            />
            <Route
              path="/post/:postId/:userPicturePath"
              element={isAuth ? <EditPost /> : <Navigate to="/login" />}
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
