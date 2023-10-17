import { Component } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoList from "../components/TodoList";

class Home extends Component {
    render() {
        return (
            <div className="containers">
                <Header />
                <TodoList />
                <Footer />
            </div>
        )
    }
}

export default Home;