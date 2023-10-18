import { Component, createRef } from "react";
import List from "./List";

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            list: [
                { id: 1, name: 'Làm việc', status: 2 },
                { id: 2, name: 'Đi ngủ', status: 1 },
                { id: 3, name: 'Ăn cơm', status: 2 },
                { id: 4, name: 'Netflix and Chill', status: 1 }
            ]
        }
        this.inputRef = createRef();
        this.handleSearch = this.handleSearch.bind(this);
        this.checkKeyDown = this.checkKeyDown.bind(this);
    }

    handleSearch(e) {
        const keyword = e.target.value;
        this.setState({ ...this.state, keyword });
    }

    checkKeyDown(e) {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            const newItem = { id: this.state.list.length + 1, name: e.target.value, status: 2 };
            this.setState((prevState) => {
                const { list } = this.state;
                const newList = [...list, newItem];
                return { ...prevState, keyword: '', list: newList };
            });
            e.target.value = '';
        }
    }

    render() {
        let { list, keyword } = this.state;
        return (
            <main className="main">
                <div className="content">
                    <div className="search-area">
                        <div className="input-group">
                            <input type="text" className="form-control" placeholder="What needs to be done?"
                                onChange={(e) => this.handleSearch(e)}
                                onKeyDown={(e) => this.checkKeyDown(e)} />
                        </div>
                        <List list={list} keyword={keyword} />
                    </div>
                </div>
            </main>
        );
    }
}

export default TodoList;