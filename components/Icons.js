// Small hand-written SVG icons. No icon library is used.

const svgProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  focusable: "false",
  "aria-hidden": "true",
};

export function BookIcon() {
  return (
    <svg {...svgProps}>
      <path d="M11 6.5A2.5 2.5 0 0 0 8.5 4H4v14h4.5A2.5 2.5 0 0 1 11 20.5z" />
      <path d="M13 6.5A2.5 2.5 0 0 1 15.5 4H20v14h-4.5A2.5 2.5 0 0 0 13 20.5z" />
    </svg>
  );
}

export function LaptopIcon() {
  return (
    <svg {...svgProps}>
      <rect x="4" y="5" width="16" height="10" rx="1.5" />
      <path d="M2.5 18.5h19" />
    </svg>
  );
}

export function ChairIcon() {
  return (
    <svg {...svgProps}>
      <path d="M7 4h10v8H7z" />
      <path d="M5 12h14v3H5z" />
      <path d="M7 15v5" />
      <path d="M17 15v5" />
    </svg>
  );
}

export function PencilIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 20l1-4L16 5l3 3L8 19z" />
      <path d="M14 7l3 3" />
    </svg>
  );
}

export function ShirtIcon() {
  return (
    <svg {...svgProps}>
      <path d="M9 3l3 2 3-2 4 3-2 3-1-1v11H8V8L7 9 5 6z" />
    </svg>
  );
}

export function BallIcon() {
  return (
    <svg {...svgProps}>
      <circle cx="12" cy="12" r="8" />
      <path d="M4 12h16" />
      <path d="M12 4c3 3 3 13 0 16" />
    </svg>
  );
}

export function BoxIcon() {
  return (
    <svg {...svgProps}>
      <path d="M3 8l9-4 9 4v8l-9 4-9-4z" />
      <path d="M3 8l9 4 9-4" />
      <path d="M12 12v8" />
    </svg>
  );
}

export function ShopIcon() {
  return (
    <svg {...svgProps}>
      <path d="M4 9h16v10H4z" />
      <path d="M3 9l2-5h14l2 5" />
      <path d="M9.5 19v-5h5v5" />
    </svg>
  );
}

export function StarIcon({ filled }) {
  return (
    <svg
      {...svgProps}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
    >
      <path d="M12 3.6l2.6 5.3 5.8.8-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.8z" />
    </svg>
  );
}

export function MailIcon() {
  return (
    <svg {...svgProps}>
      <rect x="3" y="5" width="18" height="14" rx="1.5" />
      <path d="M3.5 6.5l8.5 6 8.5-6" />
    </svg>
  );
}

export function PhoneIcon() {
  return (
    <svg {...svgProps}>
      <path d="M6 3h3l1.5 4-2 1.5a11 11 0 0 0 5 5L15 11.5 19 13v3a2 2 0 0 1-2.2 2A15 15 0 0 1 4 5.2 2 2 0 0 1 6 3z" />
    </svg>
  );
}

export function PinIcon() {
  return (
    <svg {...svgProps}>
      <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}
