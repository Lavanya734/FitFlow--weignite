import { Dumbbell } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";


const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    const html = document.documentElement;
    const newTheme = html.classList.toggle("dark");

    setIsDark(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");
  };

  return (
    <nav className="border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <Dumbbell className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            FitFlow
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className={`transition-colors ${isActive('/') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
          >
            Home
          </Link>
          <Link
            to="/exercises"
            className={`transition-colors ${isActive('/exercises') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
          >
            Exercises
          </Link>
          <Link
            to="/modules"
            className={`transition-colors ${isActive('/modules') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
          >
            Modules
          </Link>
          <Link
            to="/recipes"
            className={`transition-colors ${isActive('/recipes') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
          >
            Recipes
          </Link>
          <Link
            to="/profile"
            className={`transition-colors ${isActive('/profile') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
          >
            Profile
          </Link>
          <Link
            to="/auth"
            className={`transition-colors ${isActive('/auth') ? 'text-primary font-medium' : 'text-foreground hover:text-primary'}`}
          >
            Login
          </Link>
          <button
            onClick={toggleTheme}
            className="px-3 py-1.5 rounded-lg border border-border text-sm hover:bg-muted transition"
          >
            {isDark ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Header;