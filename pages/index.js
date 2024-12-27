import styles from '@/styles/Home.module.css';
import { useEffect, useState } from 'react';

export default function Home() {
  const [listData, setListData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [visiblePages, setVisiblePages] = useState(6);
  const [sortBy, setSortBy] = useState('s.no');
  const [sortOrder, setSortOrder] = useState('asc');
  const itemsPerPage = 5;

  const fetchData = async () => {
    try {
      const response = await fetch(
        'https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json'
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setListData(data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setVisiblePages(3);
      } else if (window.innerWidth < 900) {
        setVisiblePages(4);
      } else {
        setVisiblePages(6);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sortedList = [...listData];
    sortedList.sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    setListData(sortedList);
  }, [sortBy, sortOrder, listData]);

  const totalPages = Math.ceil(listData.length / itemsPerPage);

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const currentData = listData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const startPage = Math.max(currentPage - Math.floor(visiblePages / 2), 1);
  const endPage = Math.min(startPage + visiblePages - 1, totalPages);

  const visiblePageNumbers = pageNumbers.slice(startPage - 1, endPage);

  const handleSortChange = (criteria) => {
    if (sortBy === criteria) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortOrder('asc');
    }
  };

  const getSortArrow = (column) => {
    if (sortBy !== column) return null;
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={styles.headerContainer}>
      <div className={styles.listContainer}>
        {listData.length > 0 ? (
          <>
            <div className={styles.headerSection}>
              <h5 onClick={() => handleSortChange('s.no')}>
                S.No {getSortArrow('s.no')}
              </h5>
              <h5 onClick={() => handleSortChange('percentage.funded')}>
                Percentage funded {getSortArrow('percentage.funded')}
              </h5>
              <h5
                className={styles.textRight}
                onClick={() => handleSortChange('amt.pledged')}
              >
                Amount pledged {getSortArrow('amt.pledged')}
              </h5>
            </div>
            <div className={styles.listSection}>
              {currentData.map((element, index) => (
                <div key={index} className={styles.listItem}>
                  <h6>{element['s.no']}</h6>
                  <h6>{element['percentage.funded']}%</h6>
                  <h6 className={styles.textRight}>
                    ₹{element['amt.pledged']}
                  </h6>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p>Loading data...</p>
        )}
      </div>
      {listData.length > 0 && totalPages > 1 && (
        <div className={styles.paginationContainer}>
          <div className={styles.pagination}>
            {visiblePageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                className={currentPage === pageNumber ? styles.activePage : ''}
                onClick={() => goToPage(pageNumber)}
              >
                {pageNumber}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
