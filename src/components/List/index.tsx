import { useEffect, useState } from "react";
import Item from "../Item/Item";
// import Paginate from "./Paginate";
import * as constants from '../../constants'
import { ItemType } from "../TodoList";

export type PropsType = {
    listProps: ItemType[],
    keyword: string,
    updateList: React.Dispatch<React.SetStateAction<ItemType[]>>
}

export type SearchType = {
    selectedItems: number[],
    isSelectAll: boolean,
    currentPage: number,
    itemsPerPage: number,
}

const defaultState: SearchType = {
    selectedItems: [],
    isSelectAll: false,
    currentPage: 1,
    itemsPerPage: constants.DEFAULT_ITEM_PER_PAGE,
}

const List = ({ listProps, keyword, updateList }: PropsType) => {
    const [currentState, setCurrentState] = useState(defaultState);
    const [list, setList] = useState<ItemType[]>([]);
    const [currentList, setCurrentList] = useState<ItemType[]>([]);
    const [numPages] = useState(Math.ceil(list.length / currentState.itemsPerPage))

    const deleteItem = (id: number) => {
        const selectedItems = currentState.selectedItems.filter((item: number) => item !== id);
        setCurrentState((prevState) => {
            let { currentPage } = prevState;
            if (numPages >  0 && numPages < currentPage) currentPage = numPages;
            return { ...prevState, selectedItems, currentPage };
        });
        const listUpdated = [...listProps];
        updateList(listUpdated.filter((item: ItemType) => item.id !== id));
    }

    const clearCompleted = () => {
        const listUpdated = [...listProps];
        updateList(listUpdated.map(item => ({ ...item, status: 2 })));
    }

    const handleSelect = (id: number) => {
        const { selectedItems } = currentState;
        const index = selectedItems.indexOf(id);
        if (index > -1) {
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(id);
        }

        setCurrentState(state => ({ ...state, selectedItems, isSelectAll: selectedItems.length === list.length ? true : false }));
    }

    const handleAction = (action: string) => {
        const { selectedItems } = currentState;
        if (selectedItems.length > 0) {
            const actionList = list.filter((item: ItemType) => selectedItems.includes(item.id)).map((item: ItemType) => {
                return { ...item, status: action === 'active' ? 2 : 1 };
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
        if (!currentState.isSelectAll) {
            const selectedItems = list.map((item: ItemType) => item.id);
            setCurrentState(state => ({ ...state, selectedItems, isSelectAll: !state.isSelectAll }));
        } else {
            setCurrentState(state => ({ ...state, selectedItems: [], isSelectAll: !state.isSelectAll }));
        }
    }

    const updateItemToList = (item: ItemType) => {
        const listUpdated = [...listProps];
        const newList = listUpdated.map(i => {
            if (i.id === item.id) {
                return { ...i, name: item.name }
            }
            return i;
        });
        updateList(newList);
    }

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
        if (e.currentTarget.scrollTop === 0) setCurrentState(state => ({ ...state, itemsPerPage: constants.DEFAULT_ITEM_PER_PAGE }))
        if (e.currentTarget.scrollTop > (currentState.itemsPerPage - constants.DEFAULT_ITEM_PER_PAGE) * 40 + 5) {
            setCurrentState(state => ({ ...state, itemsPerPage: state.itemsPerPage + constants.DEFAULT_ITEM_PER_PAGE }))
        }
    }

    useEffect(() => {
        setList(listProps);
    }, [listProps]);

    useEffect(() => {
        let searchResults = [...listProps];
        let { itemsPerPage, currentPage } = currentState;
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
            setCurrentList(currentList);
        } else {
            setCurrentList([]);
        }
        setList(searchResults);
    }, [currentState, listProps, keyword]);

    const isShowClear = list.filter((item: ItemType) => item.status === 1).length > 0;

    return (
        <div className="panel">
            <div className="panel-table" onScroll={(e: any) => handleScroll(e)}>
                <table className="table table-bordered table-hover">
                    <tbody>
                        {
                            currentList && currentList.length > 0 ? (
                                currentList.map((item, index) => {
                                    return (
                                        <Item key={index} itemProps={item} selectedItemsProps={currentState.selectedItems}
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
                        <div className="action-area">
                            <span>{list.length} items left</span>
                            <div className="action-left">
                                <button type="button" className="btn btn-light" onClick={() => handleSelectAll()}>All</button>
                                <button type="button" className="btn btn-light" onClick={() => handleAction('active')}>Active</button>
                                <button type="button" className="btn btn-light" onClick={() => handleAction('completed')}>Completed</button>
                            </div>
                            <div className="action-right">
                                <button type="button" className={`btn btn-light${!isShowClear ? ' isHide' : ''} `} onClick={() => clearCompleted()} >Clear Completed</button>
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