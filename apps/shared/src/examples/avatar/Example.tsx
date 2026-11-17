const portrait =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 88 88'%3E%3Crect width='88' height='88' fill='%23453e42'/%3E%3Ccircle cx='44' cy='34' r='16' fill='%23ebe65b'/%3E%3Cpath d='M14 88C14 66 28 56 44 56S74 66 74 88Z' fill='%23ebe65b'/%3E%3C/svg%3E";

/** Photos, initials, a decorative avatar next to a name, and a group. */
export function AvatarExample() {
  return (
    <div className="flex-vertical-nowrap gap-5">
      <div className="flex-horizontal-wrap gap-4">
        <span className="avatar small">
          <img src={portrait} alt="Ada Lovelace" width="32" height="32" />
        </span>
        <span className="avatar">
          <img src={portrait} alt="Ada Lovelace" width="44" height="44" />
        </span>
        <span className="avatar large">
          <img src={portrait} alt="Ada Lovelace" width="64" height="64" />
        </span>
        <span className="avatar" role="img" aria-label="Grace Hopper">
          GH
        </span>
        <span
          className="avatar square"
          role="img"
          aria-label="Katherine Johnson"
        >
          KJ
        </span>
      </div>

      <p className="text flex-horizontal-wrap gap-3">
        <span className="avatar small" aria-hidden="true">
          GH
        </span>
        <span>Grace Hopper replied 2 hours ago</span>
      </p>

      <div className="avatar_group" role="group" aria-label="Project members">
        <span className="avatar">
          <img src={portrait} alt="Ada Lovelace" width="44" height="44" />
        </span>
        <span className="avatar" role="img" aria-label="Grace Hopper">
          GH
        </span>
        <span className="avatar" role="img" aria-label="Katherine Johnson">
          KJ
        </span>
        <span className="avatar" role="img" aria-label="3 more members">
          +3
        </span>
      </div>
    </div>
  );
}
