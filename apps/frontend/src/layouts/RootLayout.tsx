import ThemeToggle from "@/components/ToggleTheme";
import { Outlet, NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/devices", label: "Devices" },
  { to: "/sales", label: "Sales" },
];

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full  border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-16 items-center max-w-5xl mx-auto px-2 gap-8">
          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="p-6 max-w-5xl mx-auto">
        <Outlet />
      </main>
    </div>
  );
}
