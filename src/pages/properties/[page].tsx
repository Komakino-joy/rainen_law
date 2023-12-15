import { Property } from "@/types/common";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

import Pagination from "@/components/Pagination/Pagination";
import PropertiesTable from "@/components/Tables/Properties/PropertiesTable";
import conn from "../../lib/db";
import InfoCard from "@/components/InfoCard/InfoCard";
import EditPropertyModal from "@/components/Modals/EditPropertyModal";
import dbRef from "@/constants/dbRefs";
import { CITY_HUB } from "@/constants";
import { timestampToDate } from "@/utils";
import pgPromise from "pg-promise";
import Link from "next/link";

export async function getServerSideProps(context: any) {
  const { page } = context.query;
  const pageSize = 50;
  const pageOffset = pageSize * (page - 1);

  const encodedData = context.req.headers.cookie
    ?.split(";")
    .find((cookie: string) =>
      cookie.trim().startsWith("last-properties-search-filters=")
    )
    ?.split("=")[1];

  const decodeData = JSON.parse(decodeURIComponent(encodedData));

  let {
    p_city = "",
    p_street = "",
    p_lot = "",
    p_condo = "",
    p_instructions = "",
    c_name = "",
    p_type = "",
    p_status = "",
    p_comp_ref = "",
    p_file = "",
    inputStartDate = "",
    inputEndDate,
    requestStartDate = "",
    requestEndDate = "",
  } = decodeData;

  if (inputStartDate !== "" && inputEndDate === "") {
    inputEndDate = timestampToDate(Date(), "mmDDyyyy").date;
  }

  if (requestStartDate !== "" && requestEndDate === "") {
    requestEndDate = timestampToDate(Date(), "mmDDyyyy").date;
  }

  const andLikeClause = (table: string, field: string, paramNum: string) => {
    return `AND LOWER(${table}."${field}") LIKE '%' || $${paramNum} || '%'`;
  };

  const andEqualsClause = (table: string, field: string, paramNum: string) => {
    return `AND ${table}."${field}" = $${paramNum}`;
  };

  const andBetweenClause = (
    table: string,
    field: string,
    startParam: string,
    endParam: string
  ) => {
    return `AND ${table}."${field}" BETWEEN DATE($${startParam}) AND DATE($${endParam})`;
  };

  let p_city_param = "";
  if (p_city !== "" && p_city === CITY_HUB) {
    p_city_param = `AND LOWER(p_city) IN (
      'allston',
      'brighton',
      'charlestown',
      'dorchester',
      'east boston',
      'hyde park',
      'jamaica plain',
      'mattapan',
      'roslindale',
      'roxbury',
      'south boston',
      'west roxbury'
    )`;
  } else if (p_city !== "") {
    p_city_param = andEqualsClause("p", dbRef.properties.p_city, "1");
  }

  const param = {
    p_city: p_city_param,
    p_street:
      p_street !== "" ? andLikeClause("p", dbRef.properties.p_street, "2") : "",
    p_lot: p_lot !== "" ? andLikeClause("p", dbRef.properties.p_lot, "3") : "",
    p_condo:
      p_condo !== "" ? andLikeClause("p", dbRef.properties.p_condo, "4") : "",
    p_instructions:
      p_instructions !== ""
        ? andLikeClause("p", dbRef.properties.p_instructions, "5")
        : "",
    c_number: "",
    p_type:
      p_type !== "" ? andEqualsClause("p", dbRef.properties.p_type, "7") : "",
    p_status:
      p_status !== ""
        ? andEqualsClause("p", dbRef.properties.p_status, "8")
        : "",
    p_comp_ref:
      p_comp_ref !== ""
        ? andEqualsClause("p", dbRef.properties.p_comp_ref, "9")
        : "",
    p_file:
      p_file !== "" ? andEqualsClause("p", dbRef.properties.p_file, "10") : "",
    inputDateRange:
      inputStartDate !== "" && inputEndDate !== ""
        ? andBetweenClause("p", dbRef.properties.p_input_date, "11", "12")
        : "",
    requestDateRange:
      requestStartDate !== "" && requestEndDate !== ""
        ? andBetweenClause("p", dbRef.properties.p_input_date, "13", "14")
        : "",
  };

  let c_number = "";
  if (c_name) {
    const clientNumberQuery = pgPromise.as.format(
      `
        SELECT ${dbRef.clients.c_number} 
        FROM ${dbRef.table_names.clients}
        WHERE ${dbRef.clients.c_name} = $1 
      `,
      [c_name]
    );

    const clientNumberResult = (await conn.query(clientNumberQuery)).rows;

    c_number = clientNumberResult[0].c_number;
    param.c_number = andEqualsClause("c", "c_number", "6");
  }

  const propertiesQuery = pgPromise.as.format(
    `
      SELECT
        c.${dbRef.clients.c_name},  
        c.${dbRef.clients.c_number},
        p.${dbRef.properties.id},
        p.${dbRef.properties.p_city},
        p.${dbRef.properties.p_street},
        p.${dbRef.properties.p_lot},
        p.${dbRef.properties.p_condo},
        p.${dbRef.properties.p_unit},
        p.${dbRef.properties.p_state},
        p.${dbRef.properties.p_zip},
        p.${dbRef.properties.p_status},
        p.${dbRef.properties.p_type},
        p.${dbRef.properties.p_assign},
        p.${dbRef.properties.p_comp_ref},
        p.${dbRef.properties.p_instructions},
        p.${dbRef.properties.p_number},
        p.${dbRef.properties.p_requester},
        p.${dbRef.properties.p_input_date},
        p.${dbRef.properties.p_request_date},
        p.${dbRef.properties.p_closed_date},
        p.${dbRef.properties.p_file},
        p.${dbRef.properties.c_file},
        p.${dbRef.properties.p_book_1},
        p.${dbRef.properties.p_book_2},
        p.${dbRef.properties.p_page_1},
        p.${dbRef.properties.p_page_2},
        p.${dbRef.properties.p_cert_1},
        COUNT(*) OVER() AS total_count
      FROM ${dbRef.table_names.properties} p
      LEFT JOIN ${dbRef.table_names.clients} c ON c.${dbRef.clients.c_number} = p.${dbRef.properties.p_number}
      WHERE 
        p.${dbRef.properties.id} IS NOT NULL
        ${param.p_city}
        ${param.p_street}
        ${param.p_lot}
        ${param.p_condo}
        ${param.p_instructions}
        ${param.c_number}
        ${param.p_type}
        ${param.p_status}
        ${param.p_comp_ref}
        ${param.p_file}
        ${param.inputDateRange}
        ${param.requestDateRange}
      ORDER BY 
      p.${dbRef.properties.p_street},
      CASE
        WHEN POSITION('-' IN p.${dbRef.properties.p_lot}) > 0 THEN 
          COALESCE(CAST(NULLIF(SUBSTRING(p.${dbRef.properties.p_lot} FROM '^[0-9]+'), '') AS INTEGER),0)
        ELSE 
          COALESCE(CAST(NULLIF(SUBSTRING(p.${dbRef.properties.p_lot} FROM '^[0-9]+'), '') AS INTEGER), 0)
      END
      OFFSET ${pageOffset} 
      LIMIT ${pageSize};
      
    `,
    [
      p_city,
      p_street.toLowerCase(),
      p_lot.toLowerCase(),
      p_condo.toLowerCase(),
      p_instructions.toLowerCase(),
      c_number,
      p_type,
      p_status,
      p_comp_ref,
      p_file,
      inputStartDate,
      inputEndDate,
      requestStartDate,
      requestEndDate,
    ]
  );

  const propertiesResults = JSON.parse(
    JSON.stringify((await conn.query(propertiesQuery)).rows)
  );

  return {
    props: {
      properties: propertiesResults,
      totalRecords: Number(propertiesResults[0].total_count),
      pageSize,
      currentPage: Number(page),
    },
  };
}

interface PropertiesProps {
  properties: [];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
}

const Properties: React.FC<PropertiesProps> = ({
  properties,
  totalRecords,
  pageSize,
  currentPage,
}) => {
  const router = useRouter();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Property[] | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  const handleModalOpen = (e: React.SyntheticEvent, id: string) => {
    e.preventDefault();
    setSelectedId(id);
    setShowModal(true);
  };

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

  useEffect(() => {
    setTableData(properties);
  }, [properties]);

  const totalPages = Math.floor(totalRecords / pageSize) || 1;

  return (
    <>
      {tableData ? (
        <div className="all-records-view-page">
          <header>
            <h1>Properties</h1>
            <div className="italicized-record-count">
              <span>Total Records ({totalRecords})</span>
              <span>
                Current Page ({currentPage} / {totalPages})
              </span>
            </div>
            <Link href={"/properties/search"}>{"<- Back to search"}</Link>
          </header>
          <PropertiesTable
            tableData={tableData}
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          <Pagination
            href={"properties"}
            totalRecords={totalRecords}
            pageSize={pageSize}
            currentPage={currentPage}
          />
        </div>
      ) : (
        <InfoCard
          customStyles={{ marginTop: "100px", border: "none" }}
          line1="No Data to Show"
        />
      )}

      <EditPropertyModal
        handleModalClose={handleModalClose}
        showModal={showModal}
        title={""}
        selectedId={selectedId}
        handleAfterSubmit={handleAfterSubmit}
      />
    </>
  );
};

export default Properties;
