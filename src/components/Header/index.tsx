import { useThemeContext } from "../../providers/ThemeProvider";
import styles from './styles.module.css';

const Header = () => {
    const { theme, toggleTheme } = useThemeContext();
    return (
        <header className={`${styles.header} ${theme}`}>
            <h2 className={styles.textLogo}>Todos</h2>
            <button className={styles.themeChangeBtn} onClick={() => toggleTheme()}>{theme} mode</button>
        </header>
    )
}

export default Header;