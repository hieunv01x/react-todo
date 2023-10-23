import { Component } from "react";
import Item from "./Item";
import Paginate from "./Paginate";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: this.props.keyword,
            list: this.props.list,
            selectedItems: [],
            isSelectAll: false,
            currentPage: 1,
            postsPerPage: 3
        }

        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
        this.updateItemToList = this.updateItemToList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.paginate = this.paginate.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    deleteItem(id) {
        const list = this.state.list.filter(item => item.id !== id);
        const selectedItems = this.state.selectedItems.filter(item => item !== id);
        this.setState((prevState) => {
            let { currentPage, postsPerPage } = prevState;
            if (Math.ceil(list.length / postsPerPage) < currentPage) currentPage = Math.ceil(list.length / postsPerPage);
            return { ...prevState, list, selectedItems, currentPage };
        });
        this.props.updateList(list);
    }

    clearCompleted() {
        const list = this.state.list.map(item => {
            return { ...item, status: 2 }
        });
        this.props.updateList(list);
    }

    handleSelect(id) {
        const { selectedItems, list } = this.state;
        const index = selectedItems.indexOf(id);
        if (index > -1) {
            selectedItems.splice(index, 1);
        } else {
            selectedItems.push(id);
        }

        this.setState(state => ({ ...state, selectedItems, isSelectAll: false }));
        if (selectedItems.length === list.length) {
            this.setState(state => ({ ...state, isSelectAll: true }));
        }
    }

    handleAction(action) {
        const { list, selectedItems } = this.state;
        if (selectedItems.length > 0) {
            const actionList = list.filter(item => selectedItems.includes(item.id)).map(item => {
                return { ...item, status: action === 'active' ? 2 : 1 };
            });

            const newList = list.reduce((newList, item) => {
                let itemsFromActionList = actionList.filter(({ id }) => id === item.id);
                if (itemsFromActionList.length > 0) {
                    newList.push(...itemsFromActionList);
                } else newList.push(item);
                return newList;
            }, []);
            this.props.updateList(newList);
        }
    }

    handleSelectAll() {
        if (!this.state.isSelectAll) {
            const selectedItems = this.state.list.map(item => item.id);
            this.setState(state => ({ ...state, selectedItems, isSelectAll: !state.isSelectAll }));
        } else {
            this.setState(state => ({ ...state, selectedItems: [], isSelectAll: !state.isSelectAll }));
        }
    }

    updateItemToList(item) {
        const list = this.state.list.map(i => {
            if (i.id === item.id) {
                return { ...i, name: item.name }
            }
            return i;
        });
        this.setState(state => ({ ...state, list }));
    }

    paginate(currentPage) {
        this.setState(state => ({ ...state, currentPage }));
    };

    previousPage() {
        if (this.state.currentPage !== 1) {
            this.setState(state => ({ ...state, currentPage: state.currentPage - 1 }));
        }
    };

    nextPage() {
        const { list, currentPage, postsPerPage } = this.state;
        if (currentPage !== Math.ceil(list.length / postsPerPage)) {
            this.setState(state => ({ ...state, currentPage: state.currentPage + 1 }));
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ ...this.state, list: nextProps.list });
    }

    render() {
        const { keyword } = this.props;
        let { list, selectedItems, postsPerPage, currentPage } = this.state;
        const isShowClear = list.filter(item => item.status === 1).length > 0;
        let elmItem = <tr><td colSpan={4}>No record</td></tr>;
        if (list && list.length > 0) {
            if (keyword !== '') {
                list = list.filter((item) => item.name?.toLowerCase().includes(keyword.trim().toLowerCase()));
            }
            list.sort((item1, item2) => item1.status - item2.status);
            if (Math.ceil(list.length / postsPerPage) < currentPage) currentPage = currentPage - 1;
            const indexOfLastPost = currentPage * postsPerPage;
            const indexOfFirstPost = indexOfLastPost - postsPerPage;
            const currentList = list.slice(indexOfFirstPost, indexOfLastPost);
            elmItem = currentList.map((item, index) => {
                return (
                    <Item key={index} item={item} selectedItems={selectedItems}
                        handleSelect={this.handleSelect}
                        updateItemToList={this.updateItemToList}
                        deleteItem={this.deleteItem}
                    />
                );
            });
        };

        return (
            <div className="panel">
                <table className="table table-bordered table-hover">
                    <tbody>
                        {elmItem}
                    </tbody>
                </table>
                {
                    list && list.length > 0 && (
                        <>
                            <div className="action-area">
                                <span>{list.length} items left</span>
                                <div className="action-left">
                                    <button type="button" className="btn btn-light" onClick={() => this.handleSelectAll()}>All</button>
                                    <button type="button" className="btn btn-light" onClick={() => this.handleAction('active')}>Active</button>
                                    <button type="button" className="btn btn-light" onClick={() => this.handleAction('completed')}>Completed</button>
                                </div>
                                <div className="action-right">
                                    <button type="button" className={`btn btn-light${!isShowClear ? ' isHide' : ''} `} onClick={() => this.clearCompleted()} >Clear Completed</button>
                                </div>
                            </div>

                            <Paginate
                                postsPerPage={postsPerPage}
                                totalPosts={list.length}
                                currentPage={currentPage}
                                paginate={this.paginate}
                                previousPage={this.previousPage}
                                nextPage={this.nextPage}
                            />
                        </>
                    )
                }
            </div>
        );
    }
}

export default List;