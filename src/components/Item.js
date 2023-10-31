import { useEffect, useState } from "react";
import * as constants from '../constants'

const Item = ({ itemProps, selectedItemsProps, deleteItem, handleSelect, updateItemToList }) => {
    const [showInputEle, setShowInputEle] = useState(false);
    const [item, setItem] = useState({});
    const [selectedItems, setSelectedItems] = useState([])

    const handleShowInputEle = () => {
        setShowInputEle(!showInputEle);
        showInputEle && updateItemToList(item);
    }

    const updateItem = (e) => {
        setItem({ ...item, name: e.target.value });
    }

    useEffect(() => {
        setItem(itemProps);
    }, [itemProps])

    useEffect(() => {
        setSelectedItems(selectedItemsProps);
    }, [selectedItemsProps])

    const isChecked = selectedItems.length > 0 && selectedItems.includes(item.id);

    return (
        <tr>
            <td className={`item${item.status === constants.COMPLETED_STATUS ? " isChecked" : ""}`}>
                <input type="checkbox" className="item-checkbox" checked={isChecked} onChange={() => handleSelect(item.id)} />
                {
                    showInputEle ? (
                        <input
                            type="text"
                            className="form-control"
                            value={item.name}
                            onChange={(e) => updateItem(e)}
                            onBlur={() => handleShowInputEle()}
                            autoFocus
                        />
                    ) : (
                        <span className={`item-label${item.status === constants.COMPLETED_STATUS ? " isChecked" : ""}`} onDoubleClick={() => handleShowInputEle()}>
                            {item.name}
                        </span>
                    )
                }
                <span className="icon-delete" onClick={() => deleteItem(item.id)}>x</span>
            </td>
        </tr>
    );
}

export default Item;
