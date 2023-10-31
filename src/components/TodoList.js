import List from "./List";
import { items } from "../mocks/items";
import { useEffect, useState } from "react";

const TodoList = () => {
    // list: itemsPagingTest
    const [keyword, setKeyword] = useState('');
    const [list, setList] = useState([]);

    const updateList = (list) => {
        setList([...list]);
    }

    const handleSearch = (e) => {
        const keyword = e.target.value;
        setKeyword(keyword);
    }

    const checkKeyDown = (e) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            const maxItem = list.reduce((currentItem, nextItem) => {
                return currentItem.id > nextItem.id ? currentItem : nextItem;
            });
            const newList = { id: maxItem.id + 1, name: e.target.value, status: 2 };
            setKeyword('');
            setList(newList);
            e.target.value = '';
        }
    }

    useEffect(() => {
        setList(items);
    }, []);

    return (
        <main className="main">
            <div className="content">
                <div className="search-area">
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="What needs to be done?"
                            onChange={(e) => handleSearch(e)}
                            onKeyDown={(e) => checkKeyDown(e)} />
                    </div>
                    <List listProps={list} keyword={keyword} updateList={updateList} />
                </div>
            </div>
        </main>
    );
}

export default TodoList;
