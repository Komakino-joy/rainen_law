/* eslint react/jsx-key: 0 */
import { ModalType, Property } from "@/types/common";

import { useContext, useMemo, useState } from "react";
import { useTable, useFilters, useSortBy } from "react-table";

import {
  DownArrowIcon,
  PencilIcon,
  SortIcon,
  TrashIcon,
  UpArrowIcon,
} from "@/components/Icons/Icons";
import { timestampToDate } from "@/utils";
import PrintPropertyMultiple from "@/components/PrintPropertyMultiple/PrintPropertyMultiple";

import styles from "./PropertiesTable.module.scss";
import dbRef from "@/constants/dbRefs";
import { AuthContext } from "@/context/AuthContext";
import { httpPostDeleteProperty } from "@/services/http";
import { confirmAlert } from "react-confirm-alert";
import toast from "react-hot-toast";

interface OwnProps {
  tableData: any;
  handleModalOpen: (
    e: React.SyntheticEvent,
    id: string,
    type: ModalType
  ) => void;
  setTableData: (tableData: Property[]) => void;
  hiddenColumns?: string[];
  isHomePreviewTable?: boolean;
}

const PropertiesTable: React.FC<OwnProps> = ({
  handleModalOpen,
  hiddenColumns = [""],
  isHomePreviewTable,
  setTableData,
  tableData,
}) => {
  const { user } = useContext(AuthContext);
  const [labelsToPrint, setLabelsToPrint] = useState<Property[]>([]);

  const data = useMemo(() => tableData, [tableData]);

  const handleDelete = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();

    confirmAlert({
      title: "Confirm to Delete",
      message: "Are you sure to delete this record?",
      buttons: [
        {
          label: "Yes",
          onClick: async () => {
            const response = await httpPostDeleteProperty({ id });
            if (response.data.status === "success") {
              toast.success(response.data.message, { id: "delete-property" });

              const filteredArray = tableData.filter(
                (row: Property) => row.id !== id
              );
              setTableData(filteredArray);
            }

            if (response.data.status === "error") {
              toast.error(response.data.message, { id: "delete-property" });
            }
          },
        },
        {
          label: "No",
          onClick: () =>
            toast.error("Operation Cancelled.", {
              id: "delete-property",
            }),
        },
      ],
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "PT Date",
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
        Header: "Print",
        accessor: (d: Property) => d,
        Cell: ({ value }: { value: any }) => (
          <input
            name={`property-${value.id}`}
            type="checkbox"
            onClick={(e) => {
              const isChecked = (e.target as HTMLInputElement).checked;
              if (isChecked) {
                setLabelsToPrint((prevState) => {
                  const updatedArray = [...prevState, value];
                  return updatedArray;
                });
              } else {
                setLabelsToPrint((prevState) => {
                  const filteredArray = prevState.filter(
                    (property) => property.id !== value.id
                  );
                  return filteredArray;
                });
              }
            }}
          />
        ),
      },
      {
        Header: "View / Edit",
        accessor: (d: any) => d[dbRef.properties.id as keyof Property],
        Cell: ({ value }: { value: any }) => (
          <span
            title={`Edit Property: ${value}`}
            onClick={(e) => handleModalOpen(e, value, "property")}
          >
            <PencilIcon />
          </span>
        ),
      },
      {
        Header: "Delete",
        accessor: (d: any) => d.id,
        Cell: ({ value }: { value: any }) =>
          user.isAdmin ? (
            <span
              title={`Delete Property: ${value}`}
              onClick={(e) => handleDelete(e, value)}
            >
              <TrashIcon />
            </span>
          ) : null,
      },
    ],
    [tableData]
  );

  // Define a default UI for filtering
  function DefaultColumnFilter() {
    return null;
  }

  const defaultColumn = useMemo(
    () => ({
      // Let's set up our default Filter UI
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
        initialState: {
          hiddenColumns,
        },
      },
      useFilters,
      useSortBy
    );

  const buttonContainerClassName = isHomePreviewTable
    ? styles["home-preview-button-container"]
    : styles["button-container"];

  return (
    <div className={styles.container}>
      {labelsToPrint.length > 0 && (
        <div className={buttonContainerClassName}>
          <PrintPropertyMultiple properties={labelsToPrint}>
            {`Print ${labelsToPrint.length} ${
              labelsToPrint.length === 1 ? "Label" : "Labels"
            }`}
          </PrintPropertyMultiple>
        </div>
      )}
      <table {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup, idx) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, idx) => (
                <th
                  {...column.getHeaderProps(
                    !isHomePreviewTable
                      ? column.getSortByToggleProps()
                      : undefined
                  )}
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
                    column.Header === "View / Edit" ||
                    isHomePreviewTable ? null : column.isSorted ? (
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
    </div>
  );
};

export default PropertiesTable;
