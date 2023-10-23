import { Component } from 'react';

class Paginate extends Component {
    constructor(props) {
        super(props);
        this.state = {}

        this.paginate = this.paginate.bind(this);
        this.previousPage = this.previousPage.bind(this);
        this.nextPage = this.nextPage.bind(this);
    }

    paginate(number) {
        this.props.paginate(number);
    }

    previousPage() {
        this.props.previousPage();
    }

    nextPage() {
        this.props.nextPage();
    }

    render() {
        
        const { postsPerPage, totalPosts, currentPage } = this.props;
        let pageNumbers = [];
        for (let i = 1; i <= Math.ceil(totalPosts / postsPerPage); i++) {
            pageNumbers.push(i);
        }
        return (
            <div className="pagination-container">
                <ul className="pagination">
                    <li onClick={() => this.previousPage()} className="page-number">
                        Prev
                    </li>
                    {pageNumbers.map((number) => (
                        <li key={number}
                            onClick={() => this.paginate(number)}
                            className={`page-number${number === currentPage ? " active" : ""}`} >
                            {number}
                        </li>
                    ))}
                    <li onClick={() => this.nextPage()} className="page-number">
                        Next
                    </li>
                </ul>
            </div>
        );
    }
};

export default Paginate;