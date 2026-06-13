import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material"
import { GlanceRow } from "@src/types/custom"

interface GlanceTableProps {
  rows: GlanceRow[]
}

export const GlanceTable = ({ rows }: GlanceTableProps) => {
  return (
    <TableContainer component={Paper} variant="outlined">
      <Table size="small" sx={{ minWidth: 480 }}>
        <TableHead>
          <TableRow sx={{ "& th": { fontWeight: 700 } }}>
            <TableCell>Day</TableCell>
            <TableCell>Breakfast</TableCell>
            <TableCell>Lunch</TableCell>
            <TableCell>Dinner</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.day}>
              <TableCell sx={{ fontWeight: 600, whiteSpace: "nowrap" }}>
                {row.day}
              </TableCell>
              <TableCell>{row.breakfast}</TableCell>
              <TableCell>{row.lunch}</TableCell>
              <TableCell>{row.dinner}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
