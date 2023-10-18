import { Component } from "react";
import Item from "./Item";

class List extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyword: this.props.keyword,
            list: this.props.list,
            selectedItems: [],
            isSelectAll: false
        }

        this.handleSelectAll = this.handleSelectAll.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleAction = this.handleAction.bind(this);
        this.clearCompleted = this.clearCompleted.bind(this);
        this.updateItemToList = this.updateItemToList.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    deleteItem(id) {
        const list = this.state.list.filter(item => item.id !== id);
        const selectedItems = this.state.selectedItems.filter(item => item !== id);
        this.setState((prevState) => ({ ...prevState, list, selectedItems }));
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
    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ ...this.state, list: nextProps.list });
    }

    render() {
        const { keyword } = this.props;
        let { list, selectedItems } = this.state;

        const isShowClear = list.filter(item => item.status === 1).length > 0;
        if (list && list.length > 0 && keyword !== '') {
            list = list.filter((item) => item.name?.toLowerCase().includes(keyword.trim().toLowerCase()));
        }

        let elmItem = <tr><td colSpan={4}>No record</td></tr>;
        if (list && list.length > 0) {
            list.sort((item1, item2) => item1.status - item2.status);
            elmItem = list.map((item, index) => {
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
                    )
                }
            </div>
        );
    }
}

export default List;
