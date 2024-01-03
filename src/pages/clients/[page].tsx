import { Client } from "@/types/common";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import conn from "../../lib/db";
import dbRef from "@/constants/dbRefs";
import Modal from "@/components/Modal/Modal";
import Pagination from "@/components/Pagination/Pagination";
import ClientsTable from "@/components/Tables/Clients/ClientsTable";
import EditClientForm from "@/components/Forms/ClientEditForm/EditClientForm";
import pgPromise from "pg-promise";
import Link from "next/link";
import { andEquals } from "@/constants/dbClauses";
import parseJSONCookie from "@/utils/parseJSONcookie";

export async function getServerSideProps(context: any) {
  try {
    const { page } = context.query;
    const pageSize = 100;
    const pageOffset = pageSize * (page - 1);

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
    } = parseJSONCookie({
      cookies: context.req.headers.cookie,
      targetCookie: "last-clients-search-filters",
    });

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
          ) icount ON icount.${dbRef.insurance_titles.i_number} = c.${
        dbRef.clients.c_number
      }
  
        WHERE 
          c.${dbRef.clients.id} IS NOT NULL
          ${c_name ? andEquals("c", dbRef.clients.c_name, "1") : ""}
          ${c_number ? andEquals("c", dbRef.clients.c_number, "2") : ""}
          ${c_city ? andEquals("c", dbRef.clients.c_city, "3") : ""}
          ${c_contact ? andEquals("c", dbRef.clients.c_contact, "4") : ""}
          ${c_email ? andEquals("c", dbRef.clients.c_email, "5") : ""}
          ${c_fax ? andEquals("c", dbRef.clients.c_fax, "6") : ""}
          ${c_phone ? andEquals("c", dbRef.clients.c_phone, "7") : ""}
          ${c_status ? andEquals("c", dbRef.clients.c_status, "8") : ""}
          ${c_state ? andEquals("c", dbRef.clients.c_state, "9") : ""}
          ${
            c_statement_addressee
              ? andEquals("c", dbRef.clients.c_statement_addressee, "10")
              : ""
          }
          ${c_zip ? andEquals("c", dbRef.clients.c_zip, "11") : ""}
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

    const totalRecords =
      clientsResults.length === 0 ? 0 : Number(clientsResults[0].total_count);

    return {
      props: {
        clients: clientsResults,
        totalRecords,
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
      {tableData && (
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
