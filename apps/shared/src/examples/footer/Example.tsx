const links = [
  { label: "Home", href: "/" },
  { label: "Docs", href: "/docs" },
  { label: "About", href: "/about" },
];

export function FooterExample({
  year = new Date().getFullYear(),
}: {
  year?: number;
}) {
  return (
    <footer className="footer_wrap simple spacing-small">
      <div className="footer_inner">
        <div className="footer_top">
          <div className="footer_brand">
            <a className="footer_logo" href="/" aria-label="Acme">
              <span className="footer_brand_text">Acme</span>
            </a>
          </div>
          <nav aria-label="Footer">
            <ul className="footer_links">
              {links.map((link) => (
                <li key={link.href}>
                  <a className="footer_link" href={link.href}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="footer_bottom">
          <p className="footer_copyright text-style-small">
            &copy; {year}&#160;Acme
          </p>
          <ul className="footer_legal text-style-small">
            <li>
              <a className="footer_link" href="/privacy">
                Privacy
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
