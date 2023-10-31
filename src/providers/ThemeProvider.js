import React, { useContext } from "react";

export const ThemeContext = React.createContext({
    themes: "light",
    toggleTheme: () => null
});

class ThemeProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            theme: "light",
        };

        this.toggleTheme = this.toggleTheme.bind(this);
    }

    toggleTheme() {
        this.setState(state => ({
            theme: state.theme === "light" ? "dark" : "light",
        }));
    };

    render() {
        return (
            <ThemeContext.Provider value={{ theme: this.state.theme, toggleTheme: this.toggleTheme }}>
                {this.props.children}
            </ThemeContext.Provider>
        );
    }
}

export function useThemeContext() {
    return useContext(ThemeContext);
}

export default ThemeProvider;