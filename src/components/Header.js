import { useThemeContext } from "../providers/ThemeProvider";

const Header = () => {
    const { theme, toggleTheme } = useThemeContext();
    return (
        <header className={`header ${theme}`}>
            <h2>Todos</h2>
            <button className="theme-change-btn" onClick={() => toggleTheme()}>{theme} mode</button>
        </header>
    )
}

export default Header;