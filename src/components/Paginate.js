import { Component } from 'react';

const Paginate = ({ itemsPerPage, totalItems, currentPage }) => {

    const paginate = (number) => {
        this.props.paginate(number);
    }

    const previousPage = () => {
        this.props.previousPage();
    }

    const nextPage = () => {
        this.props.nextPage();
    }

    // const pageNumbers = [...Array(nPages + 1).keys()].slice(1);

    let pageNumbers = [];
    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }
    return (
        <div className="pagination-container">
            <ul className="pagination">
                <li onClick={() => previousPage()} className="page-number">
                    Prev
                </li>
                {pageNumbers.map((number) => (
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