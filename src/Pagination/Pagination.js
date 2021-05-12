import React, { useState, useEffect } from "react";
import classes from "./Pagination.module.scss";

const Pagination = props => {

    const [currentPage, setCurrentPage] = useState(0);
    const [showPages, setShowPages] = useState([]);
    const [index, setIndex] = useState(0);

    // useEffect(() => {
    //     pages();
    // }, [0]);

    const data = props.data;
    console.log(data);

    const pageNum = props.pageCount;

    // const pages = () => {
    //     let num = [];
    //     if (pageNum <= 1) {
    //         setPageCount([1]);
    //         return false;
    //     } else {
    //         for (let i = index; i <= pageNum; i++) {
    //             num.push(i + 1);
    //             if (num.length == 6) {
    //                 return false;
    //             }
    //         }
    //         setPageCount(num);
    //     }
    // }

    const next = () => {
        let showList = [];
        for (let i = index; i <= 4; i++){
            console.log(data[i]);
            showList.push(i);
        }
        setShowPages(showList);
        console.log(showPages);
        let currentpage;
        if (currentPage < pageNum){
            currentpage = currentPage + 1;
        }
        setCurrentPage(currentpage);
    }

    return (
        <ul className={classes.pagination}>
            <li className={classes.prev}>&lt;&lt;</li>
            <li className={classes.prev}>Prev</li>
            <li className={classes.pageNumber}>Current Page: {currentPage}</li>
            <li className={classes.pageNumber}>Total Pages: {pageNum}</li>
            <li className={classes.next}onClick={next}>Next</li>
            <li className={classes.next}>&gt;&gt;</li>
        </ul>
    )
}

export default Pagination;