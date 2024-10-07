// components/CourseTable.js
import React from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, Button } from 'react-bootstrap';

export default function CourseTable({ courses, deleteCourse }) {
  // Define the columns
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Title', accessor: 'title' },
      { Header: 'Description', accessor: 'description' },
      { Header: 'Duration (Hrs)', accessor: 'duration' },
      { Header: 'Difficulty', accessor: 'difficulty' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <Button variant="danger" onClick={() => deleteCourse(row.original.id)}>Delete</Button>
        ),
      },
    ],
    [deleteCourse]
  );

  // Create a table instance with default pageSize of 5
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data: courses,
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

      {/* Simple Number Pagination */}
      <div className="pagination-controls">
        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageCount}
          </strong>{' '}
        </span>
        <div>
          {Array.from({ length: pageCount }, (_, i) => (
            <Button key={i} onClick={() => gotoPage(i)} disabled={i === pageIndex}>
              {i + 1}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
