// components/LearningPathTable.js
import React from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, Button } from 'react-bootstrap';

export default function LearningPathTable({ learningPaths }) {
  // Define the columns
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Title', accessor: 'title' },
      { Header: 'Description', accessor: 'description' },
      {
        Header: 'Courses',
        accessor: 'courses',
        Cell: ({ value }) => (
          <>
            {value && value.map(course => (
              <div key={course.id}>{course.title}</div>
            ))}
          </>
        ),
      },
    ],
    []
  );

  // Create a table instance with default pageSize of 5
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    page,
  } = useTable(
    {
      columns,
      data: learningPaths,
      initialState: { pageIndex: 0, pageSize: 5 }, // Default pageSize set to 5
    },
    usePagination
  );

  return (
    <>
      <Table {...getTableProps()} striped bordered hover>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps()} key={column.id}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} key={row.id}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()} key={cell.column.id}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>

      {/* Pagination Controls */}
      <div className="pagination-controls">
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {Math.ceil(rows.length / pageSize)}
          </strong>{' '}
        </span>

        {/* Number Pagination using buttons */}
        <div style={{ marginTop: '10px' }}> {/* New line for buttons */}
          {[...Array(Math.ceil(rows.length / pageSize))].map((_, i) => (
            <Button
              key={i}
              variant={pageIndex === i ? 'primary' : 'secondary'}
              onClick={() => gotoPage(i)}
              style={{ margin: '0 5px' }}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
