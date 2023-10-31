import { useThemeContext } from "../providers/ThemeProvider";

const Footer = () => {
    const { theme } = useThemeContext();
    return (
        <footer className={`footer ${theme}`}>
            <p>Footer</p>
        </footer>
    )
}

export default Footer;