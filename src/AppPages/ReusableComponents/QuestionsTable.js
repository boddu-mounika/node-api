import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import { Button } from "@mui/material";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import WarningIcon from "@mui/icons-material/Warning";
import TableRow from "@mui/material/TableRow";
import { styled } from "@mui/material/styles";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#F0F4F7",
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export default function QuestionsTable(props) {
  const columns = [
    { id: "SequenceNumber", label: "S.No", width: "3%" },
    {
      id: "OriginalQuestion",
      label: "OriginalQuestion",
      width: "20%",
    },
    {
      id: "StandardQuestion",
      label: "Standard Question",
      width: "20%",
    },
    {
      id: "MessageSent",
      label: "Message Sent",
      //minWidth: 60,
      // align: 'right',
      format: (row) => {
        return (
          props.emailChannelInitiated && (
            <MarkEmailReadIcon fontSize="small"></MarkEmailReadIcon>
          )
        );
      },
    },
    {
      id: "PII",
      label: "PII",
      //minWidth: 60,
      format: (row) => {
        return row.HasPiiInfo === 1 && <WarningIcon fontSize="small" />;
      },
    },
    {
      id: "Responses",
      label: "Responses",
      //minWidth: 80,
      format: (row) => {
        return (
          row.StandardAnswer !== null &&
          row.StandardAnswer.length > 0 && (
            <React.Fragment>
              <Button variant="text" onClick={() => props.viewResponse(row)}>
                View
              </Button>
            </React.Fragment>
          )
        );
      },
    },
  ];

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer sx={{ maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {props.rows
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.Id}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <StyledTableCell key={column.id} align={column.align}>
                          {column.format ? column.format(row) : value}
                        </StyledTableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={props.rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
}
