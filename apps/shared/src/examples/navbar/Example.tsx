import { useEffect, useId, useRef } from "react";
import { initNavbar } from "constella/behaviors/navbar";

const links = [
  { label: "Home", href: "/", current: true },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
];

export function NavbarExample() {
  const root = useRef<HTMLElement>(null);
  const menuId = useId(); // unique per instance, stable between server and client

  useEffect(() => (root.current ? initNavbar(root.current) : undefined), []);

  return (
    <header className="nav_wrap" data-navbar ref={root}>
      <div className="nav_inner">
        <a className="nav_logo" href="/" aria-label="Acme">
          <span className="nav_brand_text">Acme</span>
        </a>
        <button
          className="nav_toggle"
          type="button"
          aria-label="Menu"
          aria-expanded="false"
          aria-controls={menuId}
          data-navbar-toggle
        >
          <span className="nav_toggle_icon" />
        </button>
        <nav
          className="nav_menu"
          id={menuId}
          aria-label="Main"
          data-navbar-menu
        >
          <div className="nav_menu_inner">
            <ul className="nav_links">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className="nav_link"
                    href={link.href}
                    aria-current={link.current ? "page" : undefined}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
