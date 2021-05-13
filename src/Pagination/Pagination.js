import React, { useState, useEffect } from "react";
import classes from "./Pagination.module.scss";

const Pagination = props => {

    const [currentPage, setCurrentPage] = useState(1);
    const [showPages, setShowPages] = useState([]);
    const [index, setIndex] = useState(0);

    const data = props.data;

    const pageNum = props.pageCount;

    const next = () => {
        if (index < 4) {
            let showList = showPages.length != 0? showPages: [];
            let i;
            for (i = index; i < data.length; i++) {
                console.log(data[i]);
                showList.push(data[i]);
            }
            console.log(i);
            setIndex(i);
            setShowPages(showList);
            console.log(showPages);
            let currentpage;
            if (currentPage < pageNum) {
                currentpage = currentPage + 1;
            }
            setCurrentPage(currentpage);
        }
    }

    return (
        <ul className={classes.pagination}>
            <li className={classes.prev}>&lt;&lt;</li>
            <li className={classes.prev}>Prev</li>
            <li >Current Page: {currentPage}</li>
            <li >Total Pages: {pageNum}</li>
            <li className={classes.next} onClick={next}>Next</li>
            <li className={classes.next}>&gt;&gt;</li>
        </ul>
    )
}

export default Pagination;