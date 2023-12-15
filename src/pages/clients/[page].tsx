import { Client } from "@/types/common";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { confirmAlert } from "react-confirm-alert";

import conn from "../../lib/db";

import dbRef from "@/constants/dbRefs";
import Modal from "@/components/Modal/Modal";
import Spinner from "@/components/Spinner/Spinner";
import Pagination from "@/components/Pagination/Pagination";
import ClientsTable from "@/components/Tables/Clients/ClientsTable";
import EditClientForm from "@/components/Forms/ClientEditForm/EditClientForm";

export async function getServerSideProps(context: any) {
  const { page } = context.query;
  const pageSize = 100;
  const pageOffset = pageSize * (page - 1);

  const totalRecordsQuery = `
    SELECT 
      COUNT(*)
    FROM ${dbRef.table_names.clients}
  `;
  const totalRecordsResult = (await conn.query(totalRecordsQuery)).rows[0]
    .count;

  const allClients = `
      SELECT 
          c.${dbRef.clients.id},
          c.${dbRef.clients.c_number},
          c.${dbRef.clients.c_name},
          c.${dbRef.clients.c_address_1},
          c.${dbRef.clients.c_address_2},
          c.${dbRef.clients.c_city},
          c.${dbRef.clients.c_state},
          c.${dbRef.clients.c_zip},
          c.${dbRef.clients.c_phone},
          c.${dbRef.clients.c_fax},
          COALESCE(pc.propcount, 0) as propcount,
          COALESCE(icount.titlescount, 0) as titlescount
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
    ORDER BY 
      c.${dbRef.clients.c_number}, 
      c.${dbRef.clients.c_name}
    OFFSET $1 LIMIT ${pageSize};
  `;
  const clientsResults = JSON.parse(
    JSON.stringify((await conn.query(allClients, [pageOffset])).rows)
  );

  return {
    props: {
      clients: clientsResults,
      totalRecords: Number(totalRecordsResult),
      pageSize,
      currentPage: Number(page),
    },
  };
}

interface ClientsProps {
  clients: [];
  totalRecords: number;
  pageSize: number;
  currentPage: number;
}

const Clients: React.FC<ClientsProps> = ({
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
    confirmAlert({
      message: "Are you sure you want to edit this record?",
      buttons: [
        {
          label: "Yes",
          onClick: () => {
            setSelectedClientId(clientId);
            setShowModal(true);
          },
        },
        {
          label: "No",
          onClick: () =>
            toast.error("Operation Cancelled.", {
              id: "edit-client",
            }),
        },
      ],
    });
  };

  const handleModalClose = () => {
    setSelectedClientId(null);
    setShowModal(false);

    if (shouldReload) {
      router.reload();
    }
  };

  const handleAfterSubmit = (clientId: string) => {
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
          <h1>
            All Clients
            {totalPages > 0 && (
              <span className="italicized-record-count">
                page ({currentPage}/{totalPages})
              </span>
            )}
          </h1>

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
