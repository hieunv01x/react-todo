import Header from "../components/Header";
import Footer from "../components/Footer";
import TodoList from "../components/TodoList";

export default function Home() {
    return (
        <div className="containers">
            <Header />
            <TodoList />
            <Footer />
        </div>
    )
}