"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useUser } from "./UserProvider";

const baseLinks = [
  { href: "/", label: "Marketplace" },
  { href: "/favorites", label: "Favorites" },
  { href: "/create", label: "Sell an Item" },
  { href: "/my-listings", label: "My Listings" },
  { href: "/enquiries", label: "Enquiries" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, logout } = useUser();

  const links = user
    ? [...baseLinks, { href: "/seller/" + user.id, label: "My Profile" }]
    : baseLinks;

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      // The session is gone either way, so continue to the marketplace.
    }

    router.push("/");
  }

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
        {loading ? (
          <p style={{ margin: 0 }}>Checking your session...</p>
        ) : user ? (
          <>
            <strong>{user.name}</strong>
            <p style={{ margin: "2px 0 0" }}>Logged in</p>
            <div className="sidebar-actions">
              <Link href={"/seller/" + user.id}>View Profile</Link>
              <button type="button" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          </>
        ) : (
          <>
            <strong>Guest</strong>
            <p style={{ margin: "2px 0 0" }}>Log in to buy and sell.</p>
            <div className="sidebar-actions">
              <Link className="primary" href="/login">
                Log In
              </Link>
              <Link href="/register">Create Account</Link>
            </div>
          </>
        )}
      </div>
    </aside>
  );
}
