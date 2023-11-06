import List from "../List";
import { items } from "../../mocks/items";
import { useEffect, useState } from "react";
import { useThemeContext } from "../../providers/ThemeProvider";
import styles from './styles.module.css';

export type ItemType = {
    id: number,
    name: string,
    status: number
}

const TodoList = () => {
    const { theme } = useThemeContext();
    const [keyword, setKeyword] = useState('');
    const [list, setList] = useState<ItemType[]>([]);

    const handleSearch = (e: any) => {
        const keyword = e.target.value;
        setKeyword(keyword);
    }

    const checkKeyDown = (e: any) => {
        if (e.key === 'Enter' && e.target.value.trim() !== '') {
            const maxItem = list.reduce((currentItem, nextItem) => {
                return currentItem.id > nextItem.id ? currentItem : nextItem;
            });
            const newItem = { id: maxItem.id + 1, name: e.target.value, status: 2 };
            setKeyword('');
            setList([...list, newItem]);
            e.target.value = '';
        }
    }

    useEffect(() => {
        setList(items); //itemsPagingTest
    }, []);

    return (
        <main className={`${styles.main} ${theme}`}>
            <div className={styles.content}>
                <div className={styles.searchArea}>
                    <div className="input-group">
                        <input type="text" className="form-control" placeholder="What needs to be done?"
                            onChange={(e) => handleSearch(e)}
                            onKeyDown={(e) => checkKeyDown(e)} />
                    </div>
                    <List listProps={list} keyword={keyword} updateList={setList} />
                </div>
            </div>
        </main>
    );
}

export default TodoList;
