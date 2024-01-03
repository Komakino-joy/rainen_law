import dbRef from "@/constants/dbRefs";
import type { NextApiRequest, NextApiResponse } from "next";
import pgPromise from "pg-promise";
import conn from "../../../lib/db";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { propertyId } = req.body;

    try {
      const propertiesQuery = pgPromise.as.format(
        `
          SELECT 
            p.*, 
            c.${dbRef.clients.c_name},  
            c.${dbRef.clients.c_number},
            b.${dbRef.buyer_seller.seller_1},
            b.${dbRef.buyer_seller.seller_2},
            b.${dbRef.buyer_seller.seller_3},
            b.${dbRef.buyer_seller.seller_4},
            b.${dbRef.buyer_seller.buyer_1},
            b.${dbRef.buyer_seller.buyer_2}
          FROM ${dbRef.table_names.properties} p
          LEFT JOIN ${dbRef.table_names.clients} c
            ON c.${dbRef.clients.c_number} = p.${dbRef.properties.p_number}
          LEFT JOIN ${dbRef.table_names.buyer_seller} b 
            ON b.${dbRef.buyer_seller.p_comp_ref} = p.${dbRef.properties.p_comp_ref}
          WHERE p.${dbRef.properties.id} = $1
          ;
        `,
        [propertyId]
      );

      const propertiesResults = (await conn.query(propertiesQuery)).rows;
      res.status(200).json(propertiesResults);
    } catch (error) {
      console.log(error);
    }
  }
}
