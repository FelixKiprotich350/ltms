"use client";

import { FC, useEffect, useState } from "react";
import {
  Search,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  ClickableTile,
  IconButton,
  Tile,
  Modal,
  DataTable,
} from "@carbon/react";
import {
  basketSale,
  PackagingUnit,
  Product,
  ProductSale,
  ClientConfiguration,
} from "@prisma/client";
import styles from "./page.scss";
import { Money } from "@carbon/icons-react";
import { TrashCan, Edit } from "@carbon/icons-react";
import {
  Dropdown,
  NumberInput,
  Select,
  SelectItem,
  TextInput,
} from "carbon-components-react";
import { useNotification } from "app/layoutComponents/notificationProvider";
import { printDocument } from "lib/printUtil";

interface SellingItem extends Product {
  quantity: number;
  tax: number;
  total: number;
}

interface paymentItem {
  paymentMode: string;
  amount: number;
  reference: string;
}

export default function NewSalePage() {
  const { addNotification } = useNotification();
  const [clientinfo, setClientInfo] = useState<ClientConfiguration>();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [packagingUnits, setPackagingUnits] = useState<PackagingUnit[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [items, setItems] = useState<SellingItem[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState<boolean>(false);
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [showHoldSaleModal, setShowHoldSaleModal] = useState<boolean>(false);
  const [showRetrieveModal, setShowRetrieveModal] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<SellingItem>>();
  const [payments, setTicketPayments] = useState<paymentItem[]>([]);
  const [paymentMode, setPaymentMode] = useState("");
  const [amount, setAmount] = useState(0);
  const [reference, setReference] = useState("");
  const [holdDescription, setHoldDescription] = useState("");
  const [selectedSale, setSelectedSale] = useState("");
  const [salesOnHold, setSalesOnHold] = useState<basketSale[]>([]);
  const [selectedGroupCode, setSelectedGroupCode] = useState<string>("");

  const handleHoldSaleSelection = (sale: string) => {
    setSelectedSale(sale); // Set the selected sale
  };
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/api/inventory/products"); // Replace with your actual API endpoint
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        addNotification({
          title: "Error",
          subtitle: "Failed to fetch products",
          kind: "error",
        });
      }
    };
    const fetchUnits = async () => {
      try {
        const response = await fetch("/api/inventory/packunits"); // Replace with your API endpoint
        if (!response.ok) {
          console.log("Failed to fetch packaging units.");
        }
        const data: PackagingUnit[] = await response.json();
        setPackagingUnits(data);
      } catch (err: any) {
        console.log(err.message || "An error occurred while fetching data.");
      }
    };
    const fetchClientInfo = async () => {
      try {
        const response = await fetch("/api/clientconfig");
        if (!response.ok) {
          throw new Error(
            `Error fetching client config: ${response.statusText}`
          );
        }
        const data = (await response.json()) as unknown as ClientConfiguration;
        setClientInfo(data);
      } catch (err) {}
    };
    fetchClientInfo();
    fetchProducts();
    fetchUnits();
  }, []);
  useEffect(() => {
    const fetchsalesOnHold = async () => {
      try {
        const response = await fetch("/api/pos/newsale/holdsale"); // Replace with your actual API endpoint
        const data = await response.json();
        setSalesOnHold(data);
      } catch (error) {
        addNotification({
          title: "Error",
          subtitle: "Failed to fetch Sales on Hold",
          kind: "error",
        });
      }
    };
    if (showRetrieveModal) {
      fetchsalesOnHold();
    }
  }, [showRetrieveModal]);

  // Update filtered products based on search term
  useEffect(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    setFilteredProducts(
      products.filter((product) =>
        product.name.toLowerCase().includes(lowercasedTerm)
      )
    );
  }, [searchTerm, products]);

  const handleOnSearchResultClick = (stockItem: any) => {
    const itemId = stockItem?.uuid ?? "";
    setSearchTerm("");
    handleAddItem({
      uuid: itemId,
      name: stockItem?.name,
      sellingPrice: stockItem?.sellingPrice,
      basicUnitUuid: stockItem?.basicUnitUuid,
      categoryUuid: stockItem?.categoryUuid,
      id: stockItem?.id,
      skuLevel: stockItem.skuLevel,
      updatedAt: stockItem?.updatedAt,
      createdAt: stockItem?.createdAt,
      description: stockItem?.description,
    });
  };

  const handleAddItem = (product: Product) => {
    const existingItem = items.find((item) => item.id === product.id);

    if (existingItem) {
      setItems((prevItems) =>
        prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
                total:
                  (item.quantity + 1) * Number(item.sellingPrice) + item.tax,
              }
            : item
        )
      );
    } else {
      setItems((prevItems) => [
        ...prevItems,
        {
          ...product,
          quantity: 1,
          tax: Number(product.sellingPrice) * 0.16, // Assuming 10% tax
          total: Number(product.sellingPrice),
        },
      ]);
    }
  };
  const handleEditItem = (item: any) => {
    setFormData(item);
    setShowModal(true);
  };

  const calculateSummary = () => {
    const subtotal = items.reduce((acc, item) => acc + item.total, 0);
    const totalTax = items.reduce((acc, item) => acc + item.tax, 0);
    const grandTotal = subtotal + totalTax;
    return { subtotal, totalTax, grandTotal };
  };
  const totalPaid = payments.reduce(
    (sum, item) => sum + Number(item.amount),
    0
  );

  const handleCompleteCheckout = async () => {
    try {
      if (totalPaid < grandTotal) {
        addNotification({
          title: "Operation Failed",
          subtitle: "Amount Paid is Insufficient",
          kind: "info",
          timeout: 5000,
        });
      }
      //save the sales
      const method = "POST";
      const url = "/api/pos/newsale";
      let payload = { payments: payments, products: items, isfullypaid: true };
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        addNotification({
          kind: "error",
          title: "Operation Failed",
          subtitle: "Failed to save the sales!",
          timeout: 5000,
        });
      }
      handlePrintTicket("Receipt");
      const saleItem: ProductSale = await response.json();
      addNotification({
        kind: "success",
        title: "Operation Completed",
        subtitle: "Items Sold Successfully.",
        timeout: 5000,
      });
      setShowCheckoutModal(false);
      window.location.reload();
    } catch (error) {
      addNotification({
        title: "Error Occurred",
        subtitle: error as string,
        kind: "error",
        timeout: 5000,
      });
      setShowCheckoutModal(false);
    }
  };
  const handleRetrieveSales = async (group: string) => {
    try {
      const response = await fetch(`/api/pos/newsale/holdsale/${group}`);
      const data = (await response.json()) as basketSale[];
      // Create an array of new items to update the state all at once
      const newItems = data
        .map((item) => {
          const product = products.find(
            (prod) => prod.uuid === item.productUuid
          );
          if (!product) {
            return null; // If no product found, return null (we'll filter these out later)
          }

          const quantity = Number(item.quantity);
          const sellingPrice = Number(product.sellingPrice);
          const tax = sellingPrice * 0.16; // Assuming 16% tax
          const total = sellingPrice * quantity + tax; // Add tax to total

          return {
            ...product,
            quantity,
            tax,
            total,
          };
        })
        .filter((item) => item !== null); // Filter out any null entries (missing products)
      // Update the state with all the new items at once
      setItems(newItems);
      const deleteresponse = await fetch(`/api/pos/newsale/holdsale/${group}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error retrieving sales on hold:", error);
    }
  };

  const handleRemoveItem = (pitem: paymentItem) => {
    // Filter out the item with the matching reference
    const updatedPayments = payments.filter(
      (item) => item.paymentMode != pitem.paymentMode
    );
    setTicketPayments(updatedPayments);
  };
  //remove sale item
  const handleRemoveSaleItem = () => {
    if (formData?.uuid) {
      setItems((prevItems) =>
        prevItems.filter((item) => item.uuid !== formData.uuid)
      );
      setShowModal(false); // Close the modal
      setFormData({});
    }
  };
  const handleChange = (qty: any) => {
    setFormData((prev) => ({ ...prev, quantity: Number(qty) }));
  };
  const handleHoldItems = async () => {
    try {
      if (holdDescription == "" || items.length <= 0) {
        return;
      }
      const method = "POST";
      const url = "/api/pos/newsale/holdsale";
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products: items, description: holdDescription }),
      });
      if (!response.ok) {
        addNotification({
          title: "Operation Failed",
          subtitle: "Failed to Hold the Sales Transaction.",
          kind: "error",
          timeout: 5000,
        });
      } else {
        addNotification({
          title: "Operation Completed",
          subtitle: "Sales Transaction hold was successfull",
          kind: "success",
          timeout: 5000,
        });
      }
    } catch (error) {
      console.error("Error holding items:", error);
    } finally {
      setShowHoldSaleModal(false);
      window.location.reload();
    }
  };
  const handleAddPaymentModal = () => {
    try {
      setTicketPayments((prevPayments) => {
        // Check if a payment with the same mode already exists
        const exists = prevPayments.some(
          (payment) => payment.paymentMode === paymentMode
        );

        if (exists) {
          // Optionally, you can notify the user about the duplicate
          addNotification({
            title: "Operation Failed",
            kind: "warning",
            subtitle: "Payment mode already exists in the list!",
          });
          return prevPayments; // Return the existing array without changes
        }

        // Add the new payment item if it doesn't exist
        return [
          ...prevPayments,
          { paymentMode: paymentMode, amount: amount, reference: reference },
        ];
      });
    } catch (error) {
      console.error("Error adding payment:", error);
    } finally {
      setPaymentMode("");
      setAmount(0);
      setReference("");
    }
  };

  const { subtotal, totalTax, grandTotal } = calculateSummary();
  async function printReceiptUsb() {
    if (!("usb" in navigator)) {
      addNotification({
        title: "Error",
        subtitle: "WebUSB is not supported in this browser.",
        kind: "error",
      });
      return;
    }
    const device = await (navigator as any).usb.requestDevice({
      filters: [{ vendorId: 0x04b8 }], // Replace with your printer's vendorId
    });
    console.log(device);
    const interfaces = device.configuration.interfaces;

    await device.open();
    await device.selectConfiguration(1);
    await device.claimInterface(0);

    const encoder = new TextEncoder();
    const printData = `
      My Store\n
      123 Main St, City, Country\n
      Tel: 123-456-7890\n
      -------------------\n
      Item 1: $5.00\n
      Item 2: $3.00\n
      -------------------\n
      Total: $8.00\n
      Thank you for shopping with us!
    `;

    const command = encoder.encode(printData);
    await device.transferOut(2, command); // Send data to the printer
    await device.close();
  }
  const handlePrintTicket = (printtype: string) => {
    const printWindow = window.open("", "", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <style>
              body {
                font-family: 'Courier New', Courier, monospace;
                width: 80mm;
                font-size: 14px;
                line-height: 1.4;
                margin: 0;
                padding: 0;
              }
              .container {
                padding: 5mm;
              }
              .header {
                text-align: center;
                font-size: 18px;
                font-weight: bold;
              }
              .section {
                margin-bottom: 10px;
              }
              .section-title {
                font-weight: bold;
              }
              .items {
                margin-top: 5px;
                border-top: 1px solid #000;
                border-bottom: 1px solid #000;
                padding-top: 5px;
                padding-bottom: 5px;
              }
              .items div {
                display: flex;
                justify-content: space-between;
                margin-bottom: 5px;
              }
              .footer {
                text-align: center;
                margin-top: 10mm;
                font-size: 12px;
              }
              .footer p {
                margin: 0;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <p>${clientinfo ? clientinfo.clientName : "Store Name"}</p>
                <p>${
                  printtype == "Ticket" ? "Ticket Print" : "Payment Receipt"
                }</p>
              </div>
              <div class="section">
                <div class="section-title">Date</div>
                <p>${new Date().toLocaleDateString()}</p>
              </div>
              <div class="section">
                <div class="section-title">Order Number</div>
                <p>1234</p>
              </div>
              <div class="section">
                <div class="section-title">Customer Name</div>
                <p>John Doe</p>
              </div>
              <div class="section items">
                ${items
                  .map(
                    (item) => `
                    <div>
                      <span>${item.name}</span>
                      <span>${item.quantity} x ${
                      packagingUnits.find(
                        (unit) => unit.uuid == item.basicUnitUuid
                      )?.name
                    }</span>
                      <span>$${item.total.toFixed(2)}</span>
                    </div>`
                  )
                  .join("")}
              </div>
              <div class="section">
                <div class="section-title">Total</div>
                <p>$${items
                  .reduce((acc, item) => acc + item.total, 0)
                  .toFixed(2)}</p>
              </div>
              <div class="footer">
                <p>Thank you for shopping with us!</p>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.onafterprint = () => {
        console.log("Printing completed or canceled");
        printWindow.close(); // Close the print window after printing
      };
      printWindow.print();
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "calc(100vh - 48px)",
        overflow: "hidden", // Prevent scrolling of the entire page
      }}
    >
      {/* Main content area */}
      <div
        style={{
          flex: 3,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {/* <Button onClick={() => printReceiptUsb()}>Test print</Button> */}

        {/* Search and filter */}
        <div
          style={{
            padding: "1rem",
            borderBottom: "1px solid #e0e0e0",
            zIndex: 1, // Ensure the search bar is above other content
          }}
        >
          <div className={styles.stockItemSearchContainer}>
            <div style={{ display: "flex" }}>
              <Search
                size="lg"
                placeholder="Find your items"
                labelText="Search"
                closeButtonLabelText="Clear search input"
                value={searchTerm}
                id="search-1"
                onChange={(e: any) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Search Results - Positioned absolutely */}
        {searchTerm && filteredProducts?.length > 0 && (
          <div
            className={styles.searchResults}
            style={{
              position: "absolute",
              top: "60px", // Adjust based on your design
              left: "1rem",
              right: "1rem",
              backgroundColor: "white",
              zIndex: 1000, // Ensure the search results overlay other content
              maxHeight: "300px", // Adjust height as needed
              overflowY: "auto",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            {filteredProducts?.slice(0, 5).map((stockItem: any) => (
              <ClickableTile
                onClick={() => handleOnSearchResultClick(stockItem)}
                key={stockItem?.uuid}
              >
                {stockItem?.name}
              </ClickableTile>
            ))}
          </div>
        )}

        {/* Table Container with fixed height */}
        <TableContainer
          title="Selected Items"
          style={{
            height: "calc(100vh - 150px)", // Adjust height based on your design
            overflowY: "auto", // Enable scrolling within the table
            padding: "1rem",
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Name</TableHeader>
                <TableHeader>Price</TableHeader>
                <TableHeader>Unit</TableHeader>
                <TableHeader>Quantity</TableHeader>
                <TableHeader>Total</TableHeader>
                <TableHeader></TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{Number(item.sellingPrice)?.toFixed(2)}</TableCell>
                  <TableCell>
                    {
                      packagingUnits.find(
                        (unit) => unit.uuid == item.basicUnitUuid
                      )?.name
                    }
                  </TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.total.toFixed(2)}</TableCell>
                  <TableCell>
                    <IconButton
                      kind="ghost"
                      size="sm"
                      onClick={() => handleEditItem(item)}
                      renderIcon={Edit}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {showModal && (
          <Modal
            open={showModal}
            onClose={setFormData({})}
            modalHeading={"Edit Item"}
            primaryButtonText={"Accept Changes"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowModal(false)}
            onRequestSubmit={() => {
              // Update item in the list with the new quantity
              const updatedItems = items.map((item) =>
                item.uuid === formData?.uuid
                  ? {
                      ...item,
                      quantity: formData?.quantity ?? 1,
                      total:
                        formData?.quantity ?? 1 * Number(item.sellingPrice),
                    }
                  : item
              );
              setItems(updatedItems); // Update the state with the modified array
              setShowModal(false); // Close the modal
              setFormData({});
            }}
          >
            <div>
              <NumberInput
                helperText="Optional helper text."
                name="quantity"
                id="quantity"
                invalidText="Number is not valid"
                label="Selling Quantity"
                max={100}
                min={1}
                onChange={(e: any) => handleChange(e.target.value)}
                size="md"
                step={1}
                value={formData?.quantity || 1}
                warnText="This is the quantity to sell."
              />
              <Button onClick={handleRemoveSaleItem}>Remove Item</Button>
            </div>
          </Modal>
        )}
        {showCheckoutModal && (
          <Modal
            open={showCheckoutModal}
            modalHeading={"Checking Out Sales"}
            primaryButtonText={"Complete Sales"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowCheckoutModal(false)}
            onRequestSubmit={() => handleCompleteCheckout()}
            primaryButtonDisabled={
              totalPaid < grandTotal || totalPaid <= 0 || grandTotal <= 0
            }
          >
            <div>
              <Tile>
                <p style={{ fontSize: "1.5rem" }}>
                  <strong>Total Charged:</strong> Ksh {grandTotal.toFixed(2)}
                </p>
              </Tile>
              <Tile>
                <p style={{ fontSize: "1.5rem" }}>
                  <strong>Total Paid:</strong> Ksh {totalPaid}
                </p>
              </Tile>
              <Tile>
                <p style={{ fontSize: "1.5rem" }}>
                  <strong>Balance:</strong> Ksh{" "}
                  {(totalPaid - grandTotal).toFixed(2)}
                </p>
              </Tile>
            </div>
          </Modal>
        )}

        {showPaymentModal && (
          <Modal
            open={showPaymentModal}
            modalHeading={"Add Payment"}
            primaryButtonText={"Add Payment"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowPaymentModal(false)}
            primaryButtonDisabled={
              amount <= 0 || paymentMode == "" || paymentMode == null
            }
            onRequestSubmit={() => {
              handleAddPaymentModal();
              setShowPaymentModal(false);
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Payment Mode Selection */}
              <div>
                <Dropdown
                  label="Select Payment Mode"
                  id="paymentMode"
                  titleText="Select Payment Mode"
                  items={["Cash", "Card", "Mpesa", "Bank Transfer"]}
                  itemToString={(item) => (item ? item : "")}
                  onChange={({ selectedItem }) => {
                    // Update payment mode when an option is selected
                    setPaymentMode(selectedItem || "");
                  }}
                />
              </div>

              {/* Amount Input */}
              <div>
                <label
                  htmlFor="amount"
                  style={{ display: "block", marginBottom: "0.5rem" }}
                >
                  Amount
                </label>
                <NumberInput
                  id="amount"
                  min={0}
                  step={0.01}
                  value={amount}
                  onChange={(event: any) => {
                    // Update amount based on user input
                    setAmount(event.target.value);
                  }}
                  invalidText="Invalid amount"
                  placeholder="Enter amount"
                />
              </div>

              {/* Reference Input */}
              <div>
                <TextInput
                  id="reference"
                  labelText="Reference"
                  placeholder="Enter reference (optional)"
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                />
              </div>
            </div>
          </Modal>
        )}
        {showHoldSaleModal && (
          <Modal
            open={showHoldSaleModal}
            modalHeading={"Hold Current Sales"}
            primaryButtonText={"Hold Sales"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowHoldSaleModal(false)}
            primaryButtonDisabled={holdDescription == "" || items.length <= 0}
            onRequestSubmit={() => {
              handleHoldItems();
              // setShowPaymentModal(false);
            }}
          >
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              {/* Description Input */}
              <div>
                <TextInput
                  id="description"
                  labelText="Description"
                  placeholder="Enter description (Required)"
                  value={holdDescription}
                  onChange={(event) => setHoldDescription(event.target.value)}
                />
              </div>
            </div>
          </Modal>
        )}
        {showRetrieveModal && (
          <Modal
            open={showRetrieveModal}
            modalHeading={"Retrieve Sale"}
            primaryButtonText={"Continue"}
            secondaryButtonText="Cancel"
            onRequestClose={() => setShowRetrieveModal(false)}
            primaryButtonDisabled={
              selectedGroupCode.trim() == "" ||
              !salesOnHold.find((item) => item.groupCode == selectedGroupCode)
            } // Disable the button if no sale is selected
            onRequestSubmit={() => {
              handleRetrieveSales(selectedGroupCode); // Pass the selected sale to the handler
              setShowRetrieveModal(false); // Close the modal
            }}
            size="lg" // Ensure the modal is large enough
            hasScrollingContent
            aria-label="Retrieve Sales"
          >
            <div
              style={{
                minWidth: "600px",
                maxHeight: "400px",
                overflowY: "auto",
              }}
            >
              <h5>
                <strong>Selected Sale Code : {selectedSale}</strong>
                <TextInput
                  id="selectedgroupcode"
                  labelText=""
                  onChange={(e: any) => setSelectedGroupCode(e.target.value)}
                />
              </h5>

              {salesOnHold.length > 0 ? (
                <DataTable
                  rows={salesOnHold.map((sale) => ({
                    id: sale.id.toString(),
                    description: sale.description,
                    date: sale.createdAt,
                    groupcode: sale.groupCode,
                    // action: (
                    //   <IconButton onClick={console.log("clicked me")}>
                    //     <Edit Size="32" />
                    //   </IconButton>
                    // ),
                  }))}
                  headers={[
                    { key: "groupcode", header: "Code" },
                    { key: "description", header: "Description" },
                    { key: "date", header: "Date" },
                    // { key: "action", header: "Action" },
                  ]}
                  radio
                  useZebraStyles
                  isSortable
                  onRowClick={(row: any) => console.log(row)}
                  render={({
                    rows,
                    headers,
                    getRowProps,
                    getTableProps,
                  }: {
                    rows: any[];
                    headers: any[];
                    getRowProps: any;
                    getTableProps: any;
                  }) => (
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header) => (
                            <TableHeader key={header.key}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row) => (
                          <TableRow key={row.id} {...getRowProps({ row })}>
                            {row.cells.map((cell: any) => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                />
              ) : (
                <p>No sales on hold.</p>
              )}
            </div>
          </Modal>
        )}
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          borderLeft: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          padding: "1rem",
        }}
      >
        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto", // Enable scrolling for the right panel content
          }}
        >
          <Tile>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Subtotal:</strong>Ksh {subtotal.toFixed(2)}
            </p>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Total Tax:</strong>Ksh {totalTax.toFixed(2)}
            </p>
            <p style={{ fontSize: "1.5rem" }}>
              <strong>Grand Total:</strong>Ksh {grandTotal.toFixed(2)}
            </p>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>Mode</TableHeader>
                  <TableHeader>Amount</TableHeader>
                  <TableHeader>Reference</TableHeader>
                  <TableHeader></TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {payments.map((item) => (
                  <TableRow key={item.paymentMode}>
                    <TableCell>{item.paymentMode}</TableCell>
                    <TableCell>{item.amount}</TableCell>
                    <TableCell>{item.reference}</TableCell>
                    <TableCell>
                      <IconButton
                        kind="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item)}
                        renderIcon={TrashCan}
                        iconDescription="Remove item"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Tile>
        </div>
        {/* Fixed buttons */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            marginTop: "1rem",
            padding: "0.5rem 0",
          }}
        >
          {/* First Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => setShowHoldSaleModal(true)}
              disabled={items.length <= 0}
            >
              Hold
            </Button>
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => setShowRetrieveModal(true)}
              disabled={items.length > 0}
            >
              Retrieve
            </Button>
          </div>

          {/* Second Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: "1rem",
            }}
          >
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => handlePrintTicket("Ticket")}
              disabled={items.length <= 0}
            >
              Print
            </Button>
            <Button
              kind="secondary"
              style={{ flex: 1, minWidth: "48%" }}
              onClick={() => setShowPaymentModal(true)}
              disabled={items.length <= 0}
            >
              Pay
            </Button>
          </div>

          {/* Third Row */}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <Button
              kind="primary"
              style={{ flex: 1, minWidth: "100%" }}
              onClick={() => setShowCheckoutModal(true)}
              disabled={Number(grandTotal) <= 0}
            >
              Complete & Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
