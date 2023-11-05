import { useState } from "react";

const Paginate = ({ itemsPerPage, totalItems, currentPage, paginate, previousPage, nextPage }) => {

    let pageNumbers = useState<number>();
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div className="pagination-container">
            <ul className="pagination">
                <li onClick={() => previousPage()} className="page-number">
                    Prev
                </li>
                {pageNumbers.map((number: number) => (
                    <li key={number}
                        onClick={() => paginate(number)}
                        className={`page-number${number === currentPage ? " active" : ""}`} >
                        {number}
                    </li>
                ))}
                <li onClick={() => nextPage()} className="page-number">
                    Next
                </li>
            </ul>
        </div>
    );
};

export default Paginate;