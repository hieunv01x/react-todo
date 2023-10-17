import { Component, createRef } from "react";
import List from "./List";

class TodoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: '',
            list: [
                { id: 1, name: 'Làm việc', status: 2},
                { id: 2, name: 'Đi ngủ', status: 1 },
                { id: 3, name: 'Ăn cơm', status: 2 },
                { id: 4, name: 'Netflix and Chill', status: 1 }
            ]
        }
        this.inputRef = createRef();
        this.handleSearch = this.handleSearch.bind(this);
    }

    handleSearch() {
        const keyword = this.inputRef.current.value.trim();
        this.setState({ ...this.state, keyword });
    }

    render() {
        return (
            <main className="main">
                <div className="content">
                    <div className="search-area">
                        <div className="input-group">
                            <input ref={this.inputRef} onChange={this.handleSearch} type="text" className="form-control" placeholder="What needs to be done?" />
                        </div>
                        <List list={this.state.list} keyword={this.state.keyword} />
                    </div>
                </div>
            </main>
        );
    }
}

export default TodoList;
