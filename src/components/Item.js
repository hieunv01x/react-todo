import { Component } from "react";

class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInputEle: false,
            item: this.props.item
        }
        this.handleShowInputEle = this.handleShowInputEle.bind(this);
    }

    deleteItem(id) {
        this.props.deleteItem(id);
    }

    toggleCheck(id) {
        this.props.handleSelect(id);
    }

    handleShowInputEle() {
        this.setState(state => ({ ...state, showInputEle: !state.showInputEle }));
        this.state.showInputEle && this.props.updateItemToList(this.state.item);
    }

    updateItem(e) {
        this.setState((prevState) => {
            const { item } = this.props;
            item.name = e.target.value;
            return { ...prevState, item };
        });
    }

    render() {
        const { item, selectedItems } = this.props;
        const isChecked = selectedItems.length > 0 && selectedItems.includes(item.id);

        return (
            <tr>
                <td className={`item${item.status === 1 ? " isChecked" : ""}`}>
                    <input type="checkbox" className="item-checkbox" checked={isChecked} onChange={() => this.toggleCheck(item.id)} />
                    {
                        this.state.showInputEle ? (
                            <input
                                type="text"
                                className="form-control"
                                value={item.name}
                                onChange={(e) => this.updateItem(e)}
                                onBlur={() => this.handleShowInputEle()}
                                autoFocus
                            />
                        ) : (
                            <span className={`item-label${item.status === 1 ? " isChecked" : ""}`} onDoubleClick={() => this.handleShowInputEle()}>
                                {item.name}
                            </span>
                        )
                    }
                    <span className="icon-delete" onClick={() => this.deleteItem(item.id)}>x</span>
                </td>
            </tr>
        );
    }
}

export default Item;
