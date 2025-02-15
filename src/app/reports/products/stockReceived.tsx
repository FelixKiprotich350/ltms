import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  PaginationNav,
  Button,
} from "@carbon/react";
import { Product, StockReceived } from "@prisma/client";
import { useEffect, useState } from "react";

interface ExtendedTransaction extends StockReceived {
  product: Product;
}
const StockReceivedReport: React.FC = () => {
  const [stockReceived, setStockReceived] = useState<ExtendedTransaction[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/inventory/stockreceived"); //api/reports/inventory/stocklevel
      const data = await response.json();

      setStockReceived(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  return (
    <div>
      <h3>Stock Received Reports</h3>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3}>Loading...</TableCell>
              </TableRow>
            ) : stockReceived?.length > 0 ? (
              stockReceived.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.product?.name}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3}>No data available</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      <div style={{ marginTop: "1rem", display: "flex", gap: "1rem" }}>
        <Button
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        >
          Previous
        </Button>
        <span>
          Page {page} of {totalPages}
        </span>
        <Button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default StockReceivedReport;
