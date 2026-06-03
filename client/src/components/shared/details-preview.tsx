import { Table, TableBody, TableCell, TableHead, TableRow } from "../ui/table";

const DetailsPreview = ({
  columns,
}: {
  columns: { label: React.ReactNode; value: React.ReactNode }[];
}) => {
  return (
    <div className="space-y-4 max-w-screen-xl">
      <Table>
        <TableBody>
          {columns.map((item, index) => (
            <TableRow key={index}>
              <TableHead>{item.label}</TableHead>
              <TableCell className="max-w-40 whitespace-normal break-words">
                {item.value}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DetailsPreview;
