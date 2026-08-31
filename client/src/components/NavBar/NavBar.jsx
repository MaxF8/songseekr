import { MenuIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import Brand from "../Brand/Brand";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { useAuth } from "../../hooks/useAuth";

function activeClass({ isActive }) {
  return isActive ? "nav-link nav-link--active" : "nav-link";
}

function NavItem({ to, children, closeMenu }) {
  return (
    <NavLink className={activeClass} to={to} onClick={closeMenu}>
      {children}
    </NavLink>
  );
}

export default function NavBar() {
  const [open, setOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const { authenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setOpen(false);
  const handleLogout = async () => {
    try {
      await logout();
      closeMenu();
      navigate("/");
    } catch (error) {
      setLogoutError(error.message || "Could not disconnect from Spotify.");
    }
  };

  const items = authenticated
    ? [
        ["/", "Home"],
        ["/playlists", "Playlists"],
        ["/saved-albums", "Albums"],
        ["/liked-songs", "Liked Songs"],
        ["/search", "Search"],
        ["/about", "About"],
      ]
    : [
        ["/search", "Search"],
        ["/about", "About"],
      ];

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Primary navigation">
        <Brand onClick={closeMenu} />

        <div className="desktop-nav-links">
          {!authenticated && (
            <Button asChild className="nav-button nav-button--primary">
              <a href={`/api/auth/start?returnTo=${encodeURIComponent(location.pathname)}`}>Connect</a>
            </Button>
          )}
          {items.map(([to, label]) => (
            <NavItem key={to} to={to} closeMenu={closeMenu}>
              {label}
            </NavItem>
          ))}
          {authenticated ? (
            <Button className="nav-button nav-button--primary" type="button" onClick={handleLogout}>
              Log Out
            </Button>
          ) : null}
          <ThemeToggle />
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button className="menu-toggle" variant="ghost" size="icon" aria-label="Open menu">
              <MenuIcon aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" showCloseButton={false} className="mobile-sheet">
            <SheetHeader className="mobile-sheet__header">
              <SheetTitle className="sr-only">Menu</SheetTitle>
              <SheetDescription className="sr-only">
                Navigate around SongSeekr.
              </SheetDescription>
              <SheetClose asChild>
                <Button className="mobile-sheet__close" variant="ghost" size="icon" aria-label="Close menu">
                  <XIcon aria-hidden="true" />
                </Button>
              </SheetClose>
            </SheetHeader>
            <div className="mobile-sheet__links">
              {items.map(([to, label]) => (
                <SheetClose asChild key={to}>
                  <NavLink className={activeClass} to={to}>
                    {label}
                  </NavLink>
                </SheetClose>
              ))}
            </div>
            <div className="mobile-sheet__footer">
              <ThemeToggle className="theme-toggle--mobile" />
              {authenticated ? (
                <Button className="nav-button nav-button--primary" type="button" onClick={handleLogout}>
                  Log Out
                </Button>
              ) : (
                <SheetClose asChild>
                  <Button asChild className="nav-button nav-button--primary">
                    <a href={`/api/auth/start?returnTo=${encodeURIComponent(location.pathname)}`}>
                      Connect
                    </a>
                  </Button>
                </SheetClose>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </nav>
      {logoutError && (
        <p className="nav-error" role="alert">
          {logoutError}
        </p>
      )}
    </header>
  );
}
