import dbRef from "@/constants/dbRefs";
import type { NextApiRequest, NextApiResponse } from "next";
import conn from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const getAllClientsQuery = `
            SELECT * FROM
              ${dbRef.table_names.clients} cm
            WHERE 
              cm.${dbRef.clients.c_name} IS NOT NULL
            ORDER BY
              cm.${dbRef.clients.last_updated} DESC,
              cm.${dbRef.clients.c_name} ASC,
              cm.${dbRef.clients.id}
            LIMIT 10;
          `;
      const result = await conn.query(getAllClientsQuery);

      res.status(200).json(result.rows);
    } catch (error) {
      console.log(error);
    }
  }
}
