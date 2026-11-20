import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { UserProvider } from "@/components/UserProvider";

export const metadata = {
  title: "Student Second-Hand Marketplace",
  description: "A simple marketplace for college students to buy, sell and exchange items.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          <div className="layout">
            <Sidebar />
            <main className="main">{children}</main>
          </div>
        </UserProvider>
      </body>
    </html>
  );
}
