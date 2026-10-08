import { Link, useLocation } from "react-router-dom";
import { Compass, Home, User, Route, GitCompare } from "lucide-react";
import { useApp } from "../context/AppContext";

export default function Navbar() {
  const location = useLocation();
  const { analysis } = useApp();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/profile", label: "My Profile", icon: User },
    { to: analysis ? "/results" : "/profile", label: "Career Paths", icon: Route },
    { to: analysis ? "/compare" : "/profile", label: "Compare", icon: GitCompare },
  ];

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-navy-950/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-navy-400 to-accent-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              CareerPath <span className="gradient-text">AI</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || (link.to === "/" && location.pathname === "/");
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-navy-200 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </div>

          <div className="md:hidden flex items-center gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to || (link.to === "/" && location.pathname === "/");
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`p-2 rounded-lg transition-all ${isActive ? "bg-white/10 text-white" : "text-navy-300 hover:text-white"}`}
                  title={link.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
}
