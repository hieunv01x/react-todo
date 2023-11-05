import React, { useContext, useState } from "react";

interface Props {
    children: React.ReactNode;
}

export const ThemeContext = React.createContext({
    theme: "light",
    toggleTheme: () => { }
});

const ThemeProvider: React.FC<Props> = ({ children }) => {

    const [theme, toggleTheme] = useState("light");

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme: () => toggleTheme(theme === "light" ? "dark" : "light") }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    return useContext(ThemeContext);
}

export default ThemeProvider;