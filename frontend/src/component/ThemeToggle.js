const ThemeToggle = ({ darkMode, onToggle, }) => {
    return (<button type="button" className="theme-toggle" onClick={onToggle} aria-label="Toggle dark and light mode" title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
      <span className="theme-icon">
        {darkMode ? "☀" : "☾"}
      </span>

      <span className="theme-text">
        {darkMode ? "Light" : "Dark"}
      </span>
    </button>);
};
export default ThemeToggle;
