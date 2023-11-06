import { useState } from "react";
import styles from './styles.module.css';

const Paginate = ({ itemsPerPage, totalItems, currentPage, paginate, previousPage, nextPage }) => {

    let pageNumbers = useState<number>();
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div className={styles.paginationContainer}>
            <ul className={styles.pagination}>
                <li onClick={() => previousPage()} className={styles.pageNumber}>
                    Prev
                </li>
                {pageNumbers.map((number: number) => (
                    <li key={number}
                        onClick={() => paginate(number)}
                        className={`${styles.pageNumber}${number === currentPage ? ` ${styles.active}` : ""}`} >
                        {number}
                    </li>
                ))}
                <li onClick={() => nextPage()} className={styles.pageNumber}>
                    Next
                </li>
            </ul>
        </div>
    );
};

export default Paginate;