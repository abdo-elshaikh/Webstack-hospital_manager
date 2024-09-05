import { Pagination, TablePagination } from "@mui/material";
import { propTypes } from "react-bootstrap/esm/Image";

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

const TablePaginationComponent = ({ totalPages, currentPage, setCurrentPage }) => {
    const paginationItems = Array.from({ length: totalPages }, (_, index) => (
        <TablePagination
            key={index + 1}
            count={totalPages}
            page={index + 1}
            onPageChange={(event, page) => setCurrentPage(page)}
        />
    ));

    return (
        <TablePagination
            component="div"
            count={totalPages}
            page={currentPage - 1}
            onPageChange={(event, page) => setCurrentPage(page + 1)}
        />
    );
};

export { PaginationComponent, TablePaginationComponent };