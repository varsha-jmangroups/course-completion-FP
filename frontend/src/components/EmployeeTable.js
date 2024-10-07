import React from 'react';
import { useTable, usePagination } from 'react-table';
import { Table, Button } from 'react-bootstrap';

export default function EmployeeTable({ employees, handleViewCourses, deleteUser }) {
  const columns = React.useMemo(
    () => [
      { Header: 'ID', accessor: 'id' },
      { Header: 'Name', accessor: 'name' },
      { Header: 'Email', accessor: 'email' },
      { Header: 'Role', accessor: 'role' },
      {
        Header: 'Actions',
        Cell: ({ row }) => (
          <div>
            <Button variant="info" onClick={() => handleViewCourses(row.original)}>View Courses</Button>
            <Button variant="danger" onClick={() => deleteUser(row.original.id)}>Delete</Button>
          </div>
        ),
      },
    ],
    [handleViewCourses, deleteUser]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    state: { pageIndex, pageSize },
    gotoPage,
    canNextPage,
    canPreviousPage,
    pageCount,
  } = useTable(
    {
      columns,
      data: employees,
      initialState: { pageIndex: 0 },
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
      <div>
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