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
import { andEquals, andLike, andBetweenDate } from "@/constants/dbClauses";

export async function getServerSideProps(context: any) {
  try {
    const { page } = context.query;
    const pageSize = 50;
    const pageOffset = pageSize * (page - 1);
    const {
      clients: C_tableRef,
      properties: P_tableRef,
      table_names: tablesNames,
    } = dbRef;

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
      inputEndDate = timestampToDate(Date(), "yyyyMMdd").date;
    }
    if (requestStartDate !== "" && requestEndDate === "") {
      requestEndDate = timestampToDate(Date(), "yyyyMMdd").date;
    }

    const p_city_param =
      p_city !== "" && p_city === CITY_HUB
        ? `AND LOWER(${P_tableRef.p_city}) IN (
          'allston',
          'brighton',
          'boston',
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
        )`
        : p_city !== ""
        ? andEquals("p", P_tableRef.p_city, "1")
        : "";

    let c_number = "";

    if (c_name) {
      const clientNumberQuery = pgPromise.as.format(
        `
          SELECT ${C_tableRef.c_number} 
          FROM ${tablesNames.clients}
          WHERE ${C_tableRef.c_name} = $1 
        `,
        [c_name]
      );

      const clientNumberResult = (await conn.query(clientNumberQuery)).rows;

      c_number = clientNumberResult[0].c_number;
    }

    const propertiesQuery = pgPromise.as.format(
      `
        SELECT
          c.${C_tableRef.c_name},  
          c.${C_tableRef.c_number},
          p.${P_tableRef.id},
          p.${P_tableRef.p_city},
          p.${P_tableRef.p_street},
          p.${P_tableRef.p_lot},
          p.${P_tableRef.p_condo},
          p.${P_tableRef.p_unit},
          p.${P_tableRef.p_state},
          p.${P_tableRef.p_zip},
          p.${P_tableRef.p_status},
          p.${P_tableRef.p_type},
          p.${P_tableRef.p_assign},
          p.${P_tableRef.p_comp_ref},
          p.${P_tableRef.p_instructions},
          p.${P_tableRef.p_number},
          p.${P_tableRef.p_requester},
          p.${P_tableRef.p_input_date},
          p.${P_tableRef.p_request_date},
          p.${P_tableRef.p_closed_date},
          p.${P_tableRef.p_file},
          p.${P_tableRef.c_file},
          p.${P_tableRef.p_book_1},
          p.${P_tableRef.p_book_2},
          p.${P_tableRef.p_page_1},
          p.${P_tableRef.p_page_2},
          p.${P_tableRef.p_cert_1},
          COUNT(*) OVER() AS total_count
        FROM ${tablesNames.properties} p
        LEFT JOIN ${tablesNames.clients} c ON c.${C_tableRef.c_number} = p.${
        P_tableRef.p_number
      }
        WHERE 
          p.${P_tableRef.id} IS NOT NULL
          ${p_city_param}
          ${p_street ? andLike("p", P_tableRef.p_street, "2") : ""}
          ${p_lot ? andLike("p", P_tableRef.p_lot, "3") : ""}
          ${p_condo ? andLike("p", P_tableRef.p_condo, "4") : ""}
          ${p_instructions ? andLike("p", P_tableRef.p_instructions, "5") : ""}
          ${c_name ? andEquals("c", "c_number", "6") : ""}
          ${p_type ? andEquals("p", P_tableRef.p_type, "7") : ""}
          ${p_status ? andEquals("p", P_tableRef.p_status, "8") : ""}
          ${p_comp_ref ? andEquals("p", P_tableRef.p_comp_ref, "9") : ""}
          ${p_file ? andEquals("p", P_tableRef.p_file, "10") : ""}
          ${
            inputStartDate
              ? andBetweenDate("p", P_tableRef.p_input_date, "11", "12")
              : ""
          }
          ${
            requestStartDate
              ? andBetweenDate("p", P_tableRef.p_input_date, "13", "14")
              : ""
          }
        ORDER BY 
        p.${P_tableRef.p_street},
        CASE
          WHEN POSITION('-' IN p.${P_tableRef.p_lot}) > 0 THEN 
            COALESCE(CAST(NULLIF(SUBSTRING(p.${
              P_tableRef.p_lot
            } FROM '^[0-9]+'), '') AS INTEGER),0)
          ELSE 
            COALESCE(CAST(NULLIF(SUBSTRING(p.${
              P_tableRef.p_lot
            } FROM '^[0-9]+'), '') AS INTEGER), 0)
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

    const totalRecords =
      propertiesResults.length === 0
        ? 0
        : Number(propertiesResults[0].total_count);

    return {
      props: {
        properties: propertiesResults,
        totalRecords,
        pageSize,
        currentPage: Number(page),
      },
    };
  } catch (e) {
    console.log("Unable to fetch properties: ", e);
    return {};
  }
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
      {tableData && (
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
      )}

      <EditPropertyModal
        handleAfterSubmit={handleAfterSubmit}
        handleModalClose={handleModalClose}
        selectedId={selectedId}
        showModal={showModal}
        title={""}
      />
    </>
  );
};

export default Properties;
