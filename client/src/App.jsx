import { lazy, Suspense } from "react";
import { Navigate, Outlet, Route, Routes, useLocation } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary/ErrorBoundary";
import Footer from "./components/Footer/Footer";
import NavBar from "./components/NavBar/NavBar";
import AsyncState from "./components/ui/AsyncState";
import { useAuth } from "./hooks/useAuth";
import ScrollToTop from "./ScrollToTop";

const About = lazy(() => import("./pages/About/About"));
const AlbumData = lazy(() => import("./pages/AlbumData/AlbumData"));
const AlbumPage = lazy(() => import("./pages/AlbumPage/AlbumPage"));
const HomePage = lazy(() => import("./components/HomePage/HomePage"));
const LikedSongPage = lazy(() => import("./pages/LikedSongPage/LikedSongPage"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const PlaylistData = lazy(() => import("./pages/PlaylistData/PlaylistData"));
const PlaylistPage = lazy(() => import("./pages/PlaylistPage/PlaylistPage"));
const Search = lazy(() => import("./components/Search/Search"));
const SongData = lazy(() => import("./pages/SongData/SongData"));

function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();

  if (status === "loading") {
    return <AsyncState loading loadingMessage="Checking your Spotify session…" />;
  }

  if (status !== "authenticated") {
    return (
      <main className="page page--centered">
        <section className="panel empty-state" aria-labelledby="signin-heading">
          <h1 id="signin-heading">Connect to view your library</h1>
          <p>Your library stays behind SongSeekr’s server-side Spotify session.</p>
          <a
            className="button button--primary"
            href={`/api/auth/start?returnTo=${encodeURIComponent(location.pathname)}`}
          >
            Connect Spotify
          </a>
        </section>
      </main>
    );
  }

  return <Outlet />;
}

function AppLayout() {
  return (
    <div className="app-shell">
      <ScrollToTop />
      <NavBar />
      <div className="app-content">
        <Suspense fallback={<AsyncState loading loadingMessage="Loading page…" />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/search" element={<Search />} />
            <Route path="/songs/:trackId" element={<SongData />} />
            <Route path="/albums/:albumId" element={<AlbumData />} />
            <Route path="/about" element={<About />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/playlists" element={<PlaylistPage />} />
              <Route path="/playlists/:playlistId" element={<PlaylistData />} />
              <Route path="/saved-albums" element={<AlbumPage />} />
              <Route path="/liked-songs" element={<LikedSongPage />} />
            </Route>

            <Route path="/songData" element={<Navigate to="/search" replace />} />
            <Route path="/albumData" element={<Navigate to="/saved-albums" replace />} />
            <Route path="/playlistData" element={<Navigate to="/playlists" replace />} />
            <Route path="/likedSongs" element={<Navigate to="/liked-songs" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  );
}
