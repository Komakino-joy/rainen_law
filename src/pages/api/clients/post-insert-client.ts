import type { NextApiRequest, NextApiResponse } from "next";
import pgPromise from "pg-promise";
import dbRef from "@/constants/dbRefs";
import conn from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const {
      c_name,
      c_address_1,
      c_address_2,
      c_city,
      c_state,
      c_zip,
      c_phone,
      c_fax,
      c_contact,
      c_status,
      c_statement_addressee,
      c_email,
      c_notes,
      created_by,
      last_updated_by,
    } = req.body;

    try {
      await conn.query("BEGIN");

      // Need to get the latest c_number + 1 so we can assign it to the new Client
      const newCNumberQuery = `
          SELECT MAX(${dbRef.clients.c_number}) 
          FROM ${dbRef.table_names.clients};
        `;

      const clientIdResponse = await conn.query(newCNumberQuery);
      const newCNumber = clientIdResponse.rows[0].max + 1;

      const addNewClientQuery = pgPromise.as.format(
        `
          INSERT INTO ${dbRef.table_names.clients}
          (
            ${dbRef.clients.c_number},
            ${dbRef.clients.c_name},
            ${dbRef.clients.c_address_1},
            ${dbRef.clients.c_address_2},
            ${dbRef.clients.c_city},
            ${dbRef.clients.c_state},
            ${dbRef.clients.c_zip},
            ${dbRef.clients.c_phone},
            ${dbRef.clients.c_fax},
            ${dbRef.clients.c_contact},
            ${dbRef.clients.c_status},
            ${dbRef.clients.c_statement_addressee}, 
            ${dbRef.clients.c_email},
            ${dbRef.clients.c_notes},
            ${dbRef.clients.created_by},
            ${dbRef.clients.last_updated_by},
            ${dbRef.clients.last_updated},
            ${dbRef.clients.created_at}
          )
          VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18
          )

          RETURNING * ;
        `,
        [
          newCNumber,
          c_name,
          c_address_1,
          c_address_2,
          c_city,
          c_state,
          c_zip,
          c_phone,
          c_fax,
          c_contact,
          c_status,
          c_statement_addressee,
          c_email,
          c_notes,
          created_by,
          last_updated_by,
          new Date(),
          new Date(),
        ]
      );

      const newRecord = await conn.query(addNewClientQuery);
      await conn.query("COMMIT");

      res.status(200).json({
        newClientId: newRecord.rows[0].id,
        message: "New record inserted",
        status: "success",
      });
    } catch (error) {
      await conn.query("ROLLBACK");
      console.log(error);
      res.status(400).json({
        newPropId: null,
        message: "Failed to insert record",
        status: "failure",
      });
    }
  }
}
