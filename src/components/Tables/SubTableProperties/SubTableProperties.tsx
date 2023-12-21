/* eslint react/jsx-key: 0 */
import { useEffect, useMemo, useState } from "react";
import { useTable, useFilters, useSortBy } from "react-table";

import { timestampToDate } from "@/utils";
import {
  DownArrowIcon,
  PencilIcon,
  SortIcon,
  UpArrowIcon,
} from "@/components/Icons/Icons";
import EditPropertyModal from "@/components/Modals/EditPropertyModal";
import { useRouter } from "next/router";
import { Property } from "@/types/common";
import { httpPostPropertiesInfo } from "@/services/http";
import dbRef from "@/constants/dbRefs";

interface OwnProps {
  cnmbr: string;
}

const SubTableProperties: React.FC<OwnProps> = ({ cnmbr }) => {
  const router = useRouter();

  const [tableData, setTableData] = useState([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  useEffect(() => {
    (async () => {
      const propertiesInfo = await httpPostPropertiesInfo({ cnmbr });
      setTableData(propertiesInfo);
    })();
  }, [cnmbr]);

  const handleModalClose = () => {
    setSelectedId(null);
    setShowModal(false);

    if (shouldReload) {
      router.reload();
    }
  };

  const handleAfterSubmit = (id: string) => {
    setShouldReload(true);
  };

  const handleModalOpen = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    setSelectedId(id);
    setShowModal(true);
  };

  const data = useMemo(() => tableData, [tableData]);

  const columns = useMemo(
    () => [
      {
        Header: "Date",
        accessor: (d: Property) =>
          timestampToDate(
            d[dbRef.properties.p_input_date as keyof Property],
            "mmDDyyyy"
          ).date,
      },
      {
        Header: "City",
        accessor: (d: Property) =>
          d[dbRef.properties.p_city as keyof Property] || "N/A",
      },
      {
        Header: "Street",
        accessor: (d: Property) =>
          d[dbRef.properties.p_street as keyof Property] || "N/A",
      },
      {
        Header: "Lot",
        accessor: (d: Property) =>
          d[dbRef.properties.p_lot as keyof Property] || "N/A",
      },
      {
        Header: "Condo",
        accessor: (d: Property) =>
          d[dbRef.properties.p_condo as keyof Property] !== "null"
            ? d[dbRef.properties.p_condo as keyof Property]
            : "N/A",
      },
      {
        Header: "View / Edit",
        accessor: (d: Property) => d[dbRef.properties.id as keyof Property],
        Cell: ({ value }: { value: string }) => (
          <span
            title={`Edit Property: ${value}`}
            onClick={(e) => handleModalOpen(e, value)}
          >
            <PencilIcon />
          </span>
        ),
      },
    ],
    []
  );

  function DefaultColumnFilter() {
    return null;
  }

  const defaultColumn = useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
        defaultColumn,
        initialState: {},
      },
      useFilters,
      useSortBy
    );

  return (
    <>
      <table className="is-sub-table" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className={
                    column.isSorted
                      ? column.isSortedDesc
                        ? "desc"
                        : "asc"
                      : ""
                  }
                >
                  <span>
                    {column.render("Header")}
                    {column.Header === "Print" ||
                    column.Header === "View / Edit" ? null : column.isSorted ? (
                      column.isSortedDesc ? (
                        <DownArrowIcon />
                      ) : (
                        <UpArrowIcon />
                      )
                    ) : (
                      <SortIcon />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row, idx) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell, idx) => (
                  <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {showModal ? (
        <EditPropertyModal
          handleModalClose={handleModalClose}
          showModal={showModal}
          title={""}
          selectedId={selectedId}
          handleAfterSubmit={handleAfterSubmit}
        />
      ) : null}
    </>
  );
};

export default SubTableProperties;
