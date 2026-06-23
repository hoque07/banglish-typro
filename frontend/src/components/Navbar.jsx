import { LogOut, Sparkles } from "lucide-react";

export default function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <a className="brand" href="#">
        <span className="brand-icon"><Sparkles size={18} /></span>
        BANGLISH TYPRO
      </a>

      <div className="nav-links">
        <a href="#converter">Converter</a>
        <a href="#guides">Guides</a>
        <a href="#pricing">Pricing</a>
        {user ? (
          <button className="nav-user" onClick={onLogout}>
            {user.name} <LogOut size={15} />
          </button>
        ) : (
          <a href="#account">Login</a>
        )}
      </div>
    </nav>
  );
}
