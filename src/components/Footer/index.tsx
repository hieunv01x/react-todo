import { useThemeContext } from "../../providers/ThemeProvider";
import styles from './styles.module.css';

const Footer = () => {
    const { theme } = useThemeContext();
    return (
        <footer className={`${styles.footer} ${theme}`} >
            <p>Footer</p>
        </footer>
    )
}

export default Footer;