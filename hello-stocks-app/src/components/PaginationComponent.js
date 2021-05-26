import React, { useState } from 'react';
import ReactPaginate from 'react-paginate';

const [pageCount, setPageCount] = useState(1);


const NextPage = (props) => {
  return (
    <div>
      <ReactPaginate
        pageCount={pageCount}
        pageRange={20}
        marginPagesDisplayed={10}
      />
    </div>
  )
}

export default NextPage;