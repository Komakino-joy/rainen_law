import dbRef from "@/constants/dbRefs";
import type { NextApiRequest, NextApiResponse } from "next";
import pgPromise from "pg-promise";
import conn from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { id } = req.body;

    try {
      const selectQuery = pgPromise.as.format(
        `
          SELECT 
            ${dbRef.users.id}, 
            ${dbRef.users.f_name}, 
            ${dbRef.users.l_name}, 
            ${dbRef.users.username}, 
            ${dbRef.users.password}, 
            ${dbRef.users.is_admin}
          FROM ${dbRef.table_names.users} 
          WHERE ${dbRef.users.id} = $1;
        `,
        [id]
      );

      const queryResults = (await conn.query(selectQuery)).rows;
      res.status(200).json(queryResults);
    } catch (error) {
      console.log(error);
    }
  }
}
