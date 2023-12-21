import { Client } from "@/types/common";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import conn from "../../lib/db";
import dbRef from "@/constants/dbRefs";
import Modal from "@/components/Modal/Modal";
import Spinner from "@/components/Spinner/Spinner";
import Pagination from "@/components/Pagination/Pagination";
import ClientsTable from "@/components/Tables/Clients/ClientsTable";
import EditClientForm from "@/components/Forms/ClientEditForm/EditClientForm";
import pgPromise from "pg-promise";
import Link from "next/link";

export async function getServerSideProps(context: any) {
  try {
    const { page } = context.query;
    const pageSize = 100;
    const pageOffset = pageSize * (page - 1);

    const encodedData = context.req.headers.cookie
      ?.split(";")
      .find((cookie: string) =>
        cookie.trim().startsWith("last-clients-search-filters=")
      )
      ?.split("=")[1];

    const decodeData = JSON.parse(decodeURIComponent(encodedData));

    const {
      c_name = "",
      c_number = "",
      c_city = "",
      c_contact = "",
      c_email = "",
      c_fax = "",
      c_phone = "",
      c_status = "",
      c_state = "",
      c_statement_addressee = "",
      c_zip = "",
    } = decodeData;

    const andEqualsClause = (
      table: string,
      field: string,
      paramNum: string
    ) => {
      return `AND ${table}."${field}" = $${paramNum}`;
    };

    const param = {
      c_name:
        c_name !== "" ? andEqualsClause("c", dbRef.clients.c_name, "1") : "",
      c_number:
        c_number !== ""
          ? andEqualsClause("c", dbRef.clients.c_number, "2")
          : "",
      c_city:
        c_city !== "" ? andEqualsClause("c", dbRef.clients.c_city, "3") : "",
      c_contact:
        c_contact !== ""
          ? andEqualsClause("c", dbRef.clients.c_contact, "4")
          : "",
      c_email:
        c_email !== "" ? andEqualsClause("c", dbRef.clients.c_email, "5") : "",
      c_fax: c_fax !== "" ? andEqualsClause("c", dbRef.clients.c_fax, "6") : "",
      c_phone:
        c_phone !== "" ? andEqualsClause("c", dbRef.clients.c_phone, "7") : "",
      c_status:
        c_status !== ""
          ? andEqualsClause("c", dbRef.clients.c_status, "8")
          : "",
      c_state:
        c_state !== "" ? andEqualsClause("c", dbRef.clients.c_state, "9") : "",
      c_statement_addressee:
        c_statement_addressee !== ""
          ? andEqualsClause("c", dbRef.clients.c_statement_addressee, "10")
          : "",
      c_zip:
        c_zip !== "" ? andEqualsClause("c", dbRef.clients.c_zip, "11") : "",
    };

    const clientsQuery = pgPromise.as.format(
      `
          SELECT 
            c.${dbRef.clients.id},
            c.${dbRef.clients.c_name},
            c.${dbRef.clients.c_number},
            c.${dbRef.clients.c_address_1},
            c.${dbRef.clients.c_address_2},
            c.${dbRef.clients.c_city},
            c.${dbRef.clients.c_state},
            c.${dbRef.clients.c_zip},
            c.${dbRef.clients.c_phone},
            c.${dbRef.clients.c_fax},
            COALESCE(pc.propcount, 0) as propcount,
            COALESCE(icount.titlescount, 0) as titlescount,
            COUNT(*) OVER() AS total_count
          FROM ${dbRef.table_names.clients} c
          LEFT JOIN (
            SELECT 
              p.${dbRef.properties.p_number}, 
              COUNT(*) AS propcount 
            FROM ${dbRef.table_names.properties} p
            GROUP BY p.${dbRef.properties.p_number}
          ) pc ON pc.${dbRef.properties.p_number} = c.${dbRef.clients.c_number}
          LEFT JOIN (
            SELECT 
              ${dbRef.insurance_titles.i_number}, 
              COUNT(*) AS titlescount 
            FROM ${dbRef.table_names.insurance_titles}
            GROUP BY ${dbRef.insurance_titles.i_number}
          ) icount ON icount.${dbRef.insurance_titles.i_number} = c.${dbRef.clients.c_number}
  
        WHERE 
          c.${dbRef.clients.id} IS NOT NULL
          ${param.c_name}
          ${param.c_number}
          ${param.c_city}
          ${param.c_contact}
          ${param.c_email}
          ${param.c_fax}
          ${param.c_phone}
          ${param.c_status}
          ${param.c_state}
          ${param.c_statement_addressee}
          ${param.c_zip}
        ORDER BY 
          c.${dbRef.clients.c_name}
        OFFSET ${pageOffset} 
        LIMIT ${pageSize};
      `,
      [
        c_name,
        c_number,
        c_city,
        c_contact,
        c_email,
        c_fax,
        c_phone,
        c_status,
        c_state,
        c_statement_addressee,
        c_zip,
      ]
    );

    const clientsResults = JSON.parse(
      JSON.stringify((await conn.query(clientsQuery)).rows)
    );

    return {
      props: {
        clients: clientsResults,
        totalRecords: Number(clientsResults[0].total_count),
        pageSize,
        currentPage: Number(page),
      },
    };
  } catch (e) {
    console.log("Unable to fetch clients: ", e);
    return {};
  }
}

interface OwnProps {
  clients: [];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
}

const Clients: React.FC<OwnProps> = ({
  clients,
  totalRecords,
  pageSize,
  currentPage,
}) => {
  const router = useRouter();

  const [showModal, setShowModal] = useState<boolean>(false);
  const [tableData, setTableData] = useState<Client[] | null>(null);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [shouldReload, setShouldReload] = useState(false);

  const handleModalOpen = (e: React.SyntheticEvent, clientId: string) => {
    e.preventDefault();
    setSelectedClientId(clientId);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setSelectedClientId(null);
    setShowModal(false);

    if (shouldReload) {
      router.reload();
    }
  };

  const handleAfterSubmit = () => {
    setShouldReload(true);
  };

  useEffect(() => {
    setTableData(clients);
  }, [clients]);

  const totalPages = Math.floor(totalRecords / pageSize);

  return (
    <>
      {tableData ? (
        <div className="all-records-view-page">
          <header>
            <h1>
              All Clients
              {totalPages > 0 && (
                <span className="italicized-record-count">
                  page ({currentPage}/{totalPages})
                </span>
              )}
            </h1>
            <Link href={"/clients/search"}>{"<- Back to search"}</Link>
          </header>

          <ClientsTable
            tableData={tableData}
            handleModalOpen={handleModalOpen}
            setTableData={setTableData}
          />

          {totalPages > 0 && (
            <Pagination
              href={"clients"}
              totalRecords={totalRecords}
              pageSize={pageSize}
              currentPage={currentPage}
            />
          )}
        </div>
      ) : (
        <div className="page-spinner">
          <Spinner />
        </div>
      )}

      <Modal onClose={handleModalClose} show={showModal} title={""}>
        {selectedClientId && (
          <EditClientForm
            clientId={selectedClientId}
            queryType="update"
            handleAfterSubmit={handleAfterSubmit}
          />
        )}
      </Modal>
    </>
  );
};

export default Clients;
