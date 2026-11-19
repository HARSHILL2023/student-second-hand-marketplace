"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CURRENT_USER_ID, sellers } from "@/lib/data";

const links = [
  { href: "/", label: "Marketplace" },
  { href: "/favorites", label: "Favorites" },
  { href: "/create", label: "Sell an Item" },
  { href: "/my-listings", label: "My Listings" },
  { href: "/enquiries", label: "Enquiries" },
  { href: "/seller/" + CURRENT_USER_ID, label: "My Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const user = sellers[CURRENT_USER_ID];

  return (
    <aside className="sidebar">
      <div className="brand">
        <img className="brand-photo" src="/images/brand.jpg" alt="Campus library" />
        <div>
          <h1>Student Marketplace</h1>
          <p>Buy, sell and exchange on campus</p>
        </div>
      </div>

      <nav>
        {links.map((link) => {
          const isActive =
            link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);

          return (
            <Link key={link.href} href={link.href} className={isActive ? "active" : ""}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-user">
        <strong>{user.name}</strong>
        {user.year} - {user.branch}
      </div>
    </aside>
  );
}
