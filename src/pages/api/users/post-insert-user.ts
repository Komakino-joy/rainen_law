import type { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import pgPromise from "pg-promise";
import conn from "../../../lib/db";
import dbRef from "@/constants/dbRefs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, f_name, l_name, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      res.status(200).json({
        message: "Passwords do not match",
        status: "error",
      });
    }

    try {
      await conn.query("BEGIN");
      bcrypt.genSalt(10, async function (err, salt) {
        bcrypt.hash(password, salt, async function (err: any, hash: string) {
          if (err) {
            console.log(err);
            return false;
          }

          const insertQuery = pgPromise.as.format(
            `
                  INSERT INTO ${dbRef.table_names.users}
                  (
                    ${dbRef.users.username},
                    ${dbRef.users.f_name},
                    ${dbRef.users.l_name},
                    ${dbRef.users.password},
                    ${dbRef.users.created_at},
                    ${dbRef.users.last_updated}
                  )
                  VALUES (
                    $1, $2, $3, 
                    $4, $5, $6
                  )
      
                  RETURNING *
                ;
              `,
            [username, f_name, l_name, hash, new Date(), new Date()]
          );

          const newRecord = await conn.query(insertQuery);
          await conn.query("COMMIT");

          res.status(200).json({
            newRecord: newRecord.rows[0],
            message: "New user successfully created",
            status: "success",
          });
        });
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
