const plans = [
  {
    name: "Starter",
    for: "One person and a side project",
    seats: "1",
    price: "$0",
  },
  {
    name: "Team",
    for: "A small team shipping every week",
    seats: "10",
    price: "$49",
  },
  {
    name: "Studio",
    for: "Agencies with several client sites",
    seats: "50",
    price: "$199",
  },
  {
    name: "Enterprise",
    for: "Single sign-on, audit logs and support",
    seats: "500",
    price: "$1,200",
  },
];

/** The wrapper scrolls on narrow screens and is labelled by the caption. */
export function TableExample() {
  return (
    <div
      className="table_wrap"
      role="region"
      aria-labelledby="plans-caption"
      tabIndex={0}
    >
      <table className="table striped">
        <caption id="plans-caption">Plans and prices</caption>
        <thead>
          <tr>
            <th scope="col">Plan</th>
            <th scope="col">For</th>
            <th scope="col" className="is-numeric">
              Seats
            </th>
            <th scope="col" className="is-numeric">
              Price per month
            </th>
          </tr>
        </thead>
        <tbody>
          {plans.map((plan) => (
            <tr key={plan.name}>
              <th scope="row">{plan.name}</th>
              <td>{plan.for}</td>
              <td className="is-numeric">{plan.seats}</td>
              <td className="is-numeric">{plan.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
