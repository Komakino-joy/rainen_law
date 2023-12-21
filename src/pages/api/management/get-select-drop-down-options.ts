import type { NextApiRequest, NextApiResponse } from "next";
import conn from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    try {
      const propertyTypesQuery = `SELECT * FROM prop_types;`;
      const propertyTypesResult = await conn.query(propertyTypesQuery);

      const propertyStatusQuery = `SELECT * FROM prop_status;`;
      const propertyStatusResult = await conn.query(propertyStatusQuery);

      const clientStatusQuery = `SELECT * FROM client_status;`;
      const clientStatusResult = await conn.query(clientStatusQuery);

      const citiesQuery = `SELECT DISTINCT(city) FROM cities;`;
      const citiesResult = await conn.query(citiesQuery);

      const countiesQuery = `SELECT DISTINCT(county) FROM cities;`;
      const countiesResult = await conn.query(countiesQuery);

      res.status(200).json({
        propertyTypeList: propertyTypesResult.rows,
        propertyStatusList: propertyStatusResult.rows,
        clientStatusList: clientStatusResult.rows,
        cityList: citiesResult.rows,
        countyList: countiesResult.rows,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
