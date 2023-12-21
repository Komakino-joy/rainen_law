import type { NextApiRequest, NextApiResponse } from "next";
import conn from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const getAllCitiesQuery = `SELECT * FROM cities ORDER BY state_abbrv, city;`;
      const result = await conn.query(getAllCitiesQuery);

      res.status(200).json(result.rows);
    } catch (error) {
      console.log(error);
    }
  }
}
