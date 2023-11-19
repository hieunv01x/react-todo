import { memo, useCallback, useEffect, useState } from "react";
import Item from "../Item/Item";
// import Paginate from "./Paginate";
import * as constants from '../../constants'
import { ItemType } from "../TodoList";
import styles from './styles.module.css';

export type PropsType = {
    listProps: ItemType[],
    keyword: string,
    updateList: React.Dispatch<React.SetStateAction<ItemType[]>>
}

const ItemMemo = memo(Item);

const List = ({ listProps, keyword, updateList }: PropsType) => {
    const [itemsPerPage, setItemsPerPage] = useState(constants.DEFAULT_ITEM_PER_PAGE);
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [isSelectAll, setIsSelectAll] = useState(false);
    const [currentPage] = useState(1);
    const [list, setList] = useState<ItemType[]>([]);
    const [currentList, setCurrentList] = useState<ItemType[]>([]);
    // const [numPages] = useState(Math.ceil(list.length / itemsPerPage))

    const deleteItem = useCallback((id: number) => {
        setSelectedItems((prev) => {
            const selectedItems = prev.filter((item: number) => item !== id);
            return [...selectedItems];
        })
        // Sử dụng khi phân trang dạng số, xóa phần tử ở trang cuối sẽ set lại currentpage
        // if (numPages > 0 && numPages < currentPage) setCurrentPage(numPages);
        const listUpdated = [...listProps];
        updateList(listUpdated.filter((item: ItemType) => item.id !== id));
    }, [listProps, updateList])

    const clearCompleted = () => {
        const listUpdated = [...listProps];
        updateList(listUpdated.map(item => ({ ...item, status: 2 })));
    }

    const handleSelect = useCallback((id: number) => {
        const index = selectedItems.indexOf(id);
        if (index > -1) {
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(id);
        }

        setSelectedItems([...selectedItems]);
        setIsSelectAll(selectedItems.length === list.length ? true : false);
    }, [selectedItems, list.length])

    const handleAction = (action: string) => {
        if (selectedItems.length > 0) {
            const actionList = list.filter((item: ItemType) => selectedItems.includes(item.id)).map((item: ItemType) => {
                return { ...item, status: action === constants.ACTIVE ? constants.ACTIVE_STATUS : constants.COMPLETED_STATUS };
            });
            const listUpdated = [...listProps];
            const newList: Array<ItemType> = listUpdated.reduce((newList: Array<ItemType>, item: ItemType) => {
                let itemsFromActionList: Array<ItemType> = actionList.filter(({ id }) => id === item.id);
                if (itemsFromActionList.length > 0) {
                    newList.push(...itemsFromActionList);
                } else newList.push(item);
                return newList;
            }, []);

            updateList(newList);
        }
    }

    const handleSelectAll = () => {
        if (!isSelectAll) {
            const selectedItems = list.map((item: ItemType) => item.id);
            setSelectedItems([...selectedItems]);
        } else {
            setSelectedItems([]);
        }
        setIsSelectAll((prev) => (!prev));
    }

    const updateItemToList = useCallback((item: ItemType) => {
        const listUpdated = [...listProps];
        const newList = listUpdated.map(i => {
            if (i.id === item.id) {
                return { ...i, name: item.name }
            }
            return i;
        });
        updateList(newList);
    }, [listProps, updateList])

    // paginate(currentPage) {
    //     this.setState(state => ({ ...state, currentPage }));
    // };

    // previousPage() {
    //     if (this.state.currentPage !== 1) {
    //         this.setState(state => ({ ...state, currentPage: state.currentPage - 1 }));
    //     }
    // };

    // nextPage() {
    //     const { list, currentPage, itemsPerPage } = this.state;
    //     if (currentPage !== Math.ceil(list.length / itemsPerPage)) {
    //         this.setState(state => ({ ...state, currentPage: state.currentPage + 1 }));
    //     }
    // };

    const handleScroll = (e: any) => {
        // Chia mỗi đoạn là 3 item (itemsPerPage)
        // Check scrollTop > 5px của mỗi đoạn.(Tức là scroll qua 5px của item đầu tiên của đoạn)
        // VD để load 6 item thì cần scroll qua 5px của item thứ 4, tương tự load 9 item thì cần scroll qua 5px item thứ 7
        if (e.currentTarget.scrollTop === 0) setItemsPerPage(constants.DEFAULT_ITEM_PER_PAGE)
        if (e.currentTarget.scrollTop > (itemsPerPage - constants.DEFAULT_ITEM_PER_PAGE) * 40 + 5) {
            setItemsPerPage(prev => (prev + constants.DEFAULT_ITEM_PER_PAGE))
        }
    }

    useEffect(() => {
        setList(listProps);
    }, [listProps]);

    useEffect(() => {
        let searchResults = [...listProps];
        if (keyword !== '') {
            searchResults = searchResults.filter((item) => item.name?.toLowerCase().includes(keyword.trim().toLowerCase()));
        }
        searchResults.sort((item1, item2) => {
            return item1.status - item2.status || item1.id - item2.id;
        });
        if (searchResults && searchResults.length > 0) {
            const indexOfLastPost = currentPage * itemsPerPage;
            const indexOfFirstPost = indexOfLastPost - itemsPerPage;
            const currentList = searchResults.slice(indexOfFirstPost, indexOfLastPost);
            setCurrentList([...currentList]);
        } else {
            setCurrentList([]);
        }
        setList([...searchResults]);
    }, [currentPage, itemsPerPage, listProps, keyword]);

    const isShowClear = list.filter((item: ItemType) => item.status === 1).length > 0;

    return (
        <div className={styles.panel}>
            <div className={styles.panelTable} onScroll={(e: any) => handleScroll(e)}>
                <table className="table table-bordered table-hover">
                    <tbody>
                        {
                            currentList && currentList.length > 0 ? (
                                currentList.map((item) => {
                                    return (
                                        <ItemMemo key={item.id} itemProps={item} selectedItemsProps={selectedItems}
                                            handleSelect={handleSelect}
                                            updateItemToList={updateItemToList}
                                            deleteItem={deleteItem}
                                        />
                                    );
                                })
                            ) : (
                                <tr><td colSpan={4}>No record</td></tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
            {
                list && list.length > 0 && (
                    <>
                        <div className={styles.actionArea}>
                            <span>{list.length} items left</span>
                            <div className={styles.actionLeft}>
                                <button type="button" className="btn btn-light" onClick={() => handleSelectAll()}>All</button>
                                <button type="button" className="btn btn-light" onClick={() => handleAction(constants.ACTIVE)}>Active</button>
                                <button type="button" className="btn btn-light" onClick={() => handleAction(constants.COMPLETED)}>Completed</button>
                            </div>
                            <div className={styles.actionRight}>
                                <button type="button" className={`btn btn-light${!isShowClear ? ` ${styles.isHide}` : ''} `} onClick={() => clearCompleted()} >Clear Completed</button>
                            </div>
                        </div>

                        {/* <Paginate
                                itemsPerPage={itemsPerPage}
                                totalItems={list.length}
                                currentPage={currentPage}
                                paginate={this.paginate}
                                previousPage={this.previousPage}
                                nextPage={this.nextPage}
                            /> */}
                    </>
                )
            }
        </div>
    );
}

export default List;