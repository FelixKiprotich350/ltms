import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from "@carbon/react";
import { useEffect, useState } from "react";
import { StockReceived, Product } from "@prisma/client";
interface ExtendedProduct extends Product {
  totalSold: number;
  totalReceived: number;
}
const StockLevelsReport: React.FC = () => {
  const [stockLevel, setStockLevel] = useState<ExtendedProduct[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/reports/inventory/stocklevel");
      const data = await response.json();

      setStockLevel(data);
    } catch (error) {
      console.error("Error fetching stock data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div>
      <h3>Stock Level Reports</h3>
      <TableContainer >
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>ID</TableHeader>
              <TableHeader>Name</TableHeader>
              <TableHeader>Description</TableHeader>
              <TableHeader>Received</TableHeader>
              <TableHeader>Sold</TableHeader>
              <TableHeader>Instock</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {stockLevel.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.id}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.totalReceived}</TableCell>
                <TableCell>{item.totalSold}</TableCell>
                <TableCell>{item.totalReceived - item.totalSold}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default StockLevelsReport;
