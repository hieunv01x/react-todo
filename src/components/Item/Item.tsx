import { useEffect, useState } from "react";
import * as constants from '../../constants'
import { ItemType } from "../TodoList";
import styles from './styles.module.css';

export type PropsType = {
    itemProps: ItemType,
    selectedItemsProps: number[],
    deleteItem: React.Dispatch<React.SetStateAction<number>>,
    handleSelect: React.Dispatch<React.SetStateAction<number>>,
    updateItemToList: React.Dispatch<React.SetStateAction<ItemType>>
}

const Item = ({ itemProps, selectedItemsProps, deleteItem, handleSelect, updateItemToList }: PropsType) => {
    const [showInputEle, setShowInputEle] = useState(false);
    const [item, setItem] = useState<ItemType>({ id: -1, name: '', status: constants.ACTIVE_STATUS });

    const handleShowInputEle = () => {
        setShowInputEle(!showInputEle);
        showInputEle && updateItemToList(item);
    }

    const updateItem = (e: any) => {
        setItem({ ...item, name: e.target.value });
    }

    useEffect(() => {
        setItem(itemProps);
    }, [itemProps])

    const isChecked = selectedItemsProps.length > 0 && selectedItemsProps.includes(item.id);
    console.log("item", item.id);
    
    return (
        <tr>
            <td className={`${styles.item}${item.status === constants.COMPLETED_STATUS ? ` ${styles.isChecked}` : ""}`}>
                <input type="checkbox" className={styles.itemCheckbox} checked={isChecked} onChange={() => handleSelect(item.id)} />
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
                        <span className={`${styles.itemLabel}${item.status === constants.COMPLETED_STATUS ? ` ${styles.isChecked}` : ""}`} onDoubleClick={() => handleShowInputEle()}>
                            {item.name}
                        </span>
                    )
                }
                <span className={styles.iconDelete} onClick={() => deleteItem(item.id)}>x</span>
            </td>
        </tr>
    );
}

export default Item;
