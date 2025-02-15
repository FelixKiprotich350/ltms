// import React, { useEffect, useState } from "react";
// import { Search, ClickableTile } from "@carbon/react";
// import styles from "./stock-item-search.scss";

// const StockItemSearch: React.FC = () => {
//   const { t } = useTranslation();
//   let stockItemsList:any = [];
//   // const { isLoading, stockItemsList, setSearchString } = useStockItems({});
//   const [searchTerm, setSearchTerm] = useState("");
//   // const { setValue, getValues } = useFormContext();
//   // const debouncedSearchTerm = useDebounce(searchTerm);

//   // useEffect(() => {
//   //   if (debouncedSearchTerm?.length !== 0) {
//   //     setSearchString(debouncedSearchTerm);
//   //   }
//   // }, [debouncedSearchTerm, setSearchString]);

  // const handleOnSearchResultClick = (stockItem: any) => {
  //   // const itemId = `new-item-${getStockOperationUniqueId()}`;
  //   // append({
  //   //   ...stockItem,
  //   //   uuid: itemId,
  //   //   id: itemId,
  //   //   stockItemUuid: stockItem.uuid,
  //   //   stockItemName: stockItem.commonName,
  //   // });
  //   // setSearchTerm('');
  //   // setValue(`stockItems[${fields.length}].stockItemUuid`, stockItem.uuid);
  // };
//   return (
//     <div className={styles.stockItemSearchContainer}>
//       <div style={{ display: "flex" }}>
//         <Search
//           size="lg"
//           placeholder="Find your items"
//           labelText="Search"
//           closeButtonLabelText="Clear search input"
//           value={searchTerm}
//           id="search-1"
//           onChange={(e: any) => setSearchTerm(e.target.value)}
//         />
//       </div>
//       {searchTerm && stockItemsList?.length > 0 && (
//         <div className={styles.searchResults}>
//           {stockItemsList?.slice(0, 5).map((stockItem:any) => (
//             <ClickableTile
//               onClick={() => handleOnSearchResultClick(stockItem)}
//               key={stockItem?.uuid}
//             >
//               {stockItem?.commonName}
//             </ClickableTile>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default StockItemSearch;
