import { useEffect, useState } from "react";
import Item from "./Item";
// import Paginate from "./Paginate";
import * as constants from '../constants'

const defaultState = {
    selectedItems: [],
    isSelectAll: false,
    currentPage: 1,
    itemsPerPage: constants.DEFAULT_ITEM_PER_PAGE,
}

const List = ({ listProps, keyword, updateList }) => {
    const [currentState, setCurrentState] = useState(defaultState);
    const [list, setList] = useState([]);
    const [elmItem, setElmItem] = useState(<></>);

    const deleteItem = (id) => {
        const newList = list.filter(item => item.id !== id);
        const selectedItems = currentState.selectedItems.filter(item => item !== id);
        setCurrentState((prevState) => {
            let { currentPage, itemsPerPage } = prevState;
            if (Math.ceil(newList.length / itemsPerPage) < currentPage) currentPage = Math.ceil(newList.length / itemsPerPage);
            return { ...prevState, selectedItems, currentPage };
        });
        const listUpdated = [...listProps];
        updateList(listUpdated.filter(item => item.id !== id));
    }

    const clearCompleted = () => {
        const listUpdated = [...listProps];
        updateList(listUpdated.map(item => ({ ...item, status: 2 })));
    }

    const handleSelect = (id) => {
        const { selectedItems } = currentState;
        const index = selectedItems.indexOf(id);
        if (index > -1) {
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(id);
        }

        setCurrentState(state => ({ ...state, selectedItems, isSelectAll: selectedItems.length === list.length ? true : false }));
    }

    const handleAction = (action) => {
        const { selectedItems } = currentState;
        if (selectedItems.length > 0) {
            const actionList = list.filter(item => selectedItems.includes(item.id)).map(item => {
                return { ...item, status: action === 'active' ? 2 : 1 };
            });
            const listUpdated = [...listProps];
            const newList = listUpdated.reduce((newList, item) => {
                let itemsFromActionList = actionList.filter(({ id }) => id === item.id);
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
            const selectedItems = list.map(item => item.id);
            setCurrentState(state => ({ ...state, selectedItems, isSelectAll: !state.isSelectAll }));
        } else {
            setCurrentState(state => ({ ...state, selectedItems: [], isSelectAll: !state.isSelectAll }));
        }
    }

    const updateItemToList = (item) => {
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

    const handleScroll = (e) => {
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
        let { selectedItems, itemsPerPage, currentPage } = currentState;
        let elmItem = <tr><td colSpan={4}>No record</td></tr>;
        if (keyword !== '') {
            searchResults = searchResults.filter((item) => item.name?.toLowerCase().includes(keyword.trim().toLowerCase()));
        }
        searchResults.sort((item1, item2) => {
            return item1.status - item2.status || item1.id - item2.id;
        });
        if (searchResults && searchResults.length > 0) {
            if (Math.ceil(searchResults.length / itemsPerPage) < currentPage) currentPage = currentPage - 1;
            const indexOfLastPost = currentPage * itemsPerPage;
            const indexOfFirstPost = indexOfLastPost - itemsPerPage;
            const currentList = searchResults.slice(indexOfFirstPost, indexOfLastPost);
            elmItem = currentList.map((item, index) => {
                return (
                    <Item key={index} itemProps={item} selectedItemsProps={selectedItems}
                        handleSelect={handleSelect}
                        updateItemToList={updateItemToList}
                        deleteItem={deleteItem}
                    />
                );
            });
        };
        setList(searchResults);
        setElmItem(elmItem);
    }, [currentState, listProps, keyword]);

    const isShowClear = list.filter(item => item.status === 1).length > 0;

    return (
        <div className="panel">
            <div className="panel-table" onScroll={(e) => handleScroll(e)}>
                <table className="table table-bordered table-hover">
                    <tbody>
                        {elmItem}
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