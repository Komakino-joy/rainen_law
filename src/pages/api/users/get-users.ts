import type { NextApiRequest, NextApiResponse } from "next";
import conn from "../../../lib/db";
import dbRef from "@/constants/dbRefs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const selectQuery = `
          SELECT 
            ${dbRef.users.id} , 
            ${dbRef.users.f_name} , 
            ${dbRef.users.l_name} , 
            ${dbRef.users.username} , 
            ${dbRef.users.password} ,
            ${dbRef.users.is_admin}   
          FROM ${dbRef.table_names.users}
          WHERE ${dbRef.users.username} != 'admin'
          ;
        `;
      const result = await conn.query(selectQuery);

      res.status(200).json(result.rows);
    } catch (error) {
      console.log(error);
    }
  }
}
