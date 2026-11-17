const trail = [
  { label: "Home", href: "#home" },
  { label: "Guides", href: "#guides" },
  { label: "Installing Constella in an existing project", href: "#install" },
];

/** A trail ending in a link to the current page, and one ending in text. */
export function BreadcrumbsExample() {
  return (
    <div className="flex-vertical-nowrap gap-5">
      <nav className="breadcrumbs" aria-label="Breadcrumb">
        <ol className="breadcrumbs_list">
          {trail.map((item, index) => (
            <li className="breadcrumbs_item" key={item.href}>
              <a
                className="breadcrumbs_link"
                href={item.href}
                aria-current={index === trail.length - 1 ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <nav className="breadcrumbs" aria-label="Search breadcrumb">
        <ol className="breadcrumbs_list">
          <li className="breadcrumbs_item">
            <a className="breadcrumbs_link" href="#home">
              Home
            </a>
          </li>
          <li className="breadcrumbs_item">
            <span className="breadcrumbs_link" aria-current="page">
              Search results
            </span>
          </li>
        </ol>
      </nav>
    </div>
  );
}
