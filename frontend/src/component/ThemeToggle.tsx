interface ThemeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle = ({
  darkMode,
  onToggle,
}: ThemeToggleProps) => {
  return (
    <button
      className="theme-toggle"
      onClick={onToggle}
      type="button"
      aria-label="Toggle theme"
    >
      <span className="theme-icon">
        {darkMode ? "☀" : "☾"}
      </span>

      <span className="theme-text">
        {darkMode ? "Light" : "Dark"}
      </span>
    </button>
  );
};

export default ThemeToggle;