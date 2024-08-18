import { Pagination } from "react-bootstrap";

const PaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
    const paginationItems = Array.from({ length: totalPages }, (_, index) => (
        <Pagination.Item
            key={index + 1}
            active={index + 1 === currentPage}
            onClick={() => setCurrentPage(index + 1)}
        >
            {index + 1}
        </Pagination.Item>
    ));

    return (
        <Pagination className="justify-content-center">
            {paginationItems}
        </Pagination>
    );
};

export default PaginationComponent;