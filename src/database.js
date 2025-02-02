import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

let instance;

export class Database {
  constructor() {
    if (instance) return instance; // Return the existing instance
    instance = this;
    this.connection = null;
  }

  async connect() {
    try {
      if (!this.connection) {
        this.connection = mysql
          .createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT,
          })
          .promise();
        console.log("Database connected");
      }
    } catch (err) {
      console.log(`error: ${err}`);
    }
  }

  async getImage(id) {
    const [rows] = await this.connection.query(
      `SELECT * FROM history WHERE id = ?`,
      [id],
    );
    /*
    if (!rows[0]) {
      return `image ${id} Not Found.`;
    }*/
    return rows[0];
    //console.log(rows);
  }

  async getAllImages() {
    const q = "SELECT * FROM history;";
    const [rows] = await this.connection.query(q);
    //console.log(rows);
    return rows;
    //console.log(`error: ${err}`)
  }

  async insertImage(image) {
    const { imageName, originalName = null, result, url = null } = image;
    const [res] = await this.connection.query(
      `
      INSERT INTO history (name, original_name, result, image_url)
      VALUES (?, ?, ?, ?)
      `,
      [imageName, originalName, result, url],
    );
    console.log(res);
    const id = res.insertId;
    return this.getImage(id);
  }

  async deleteImage(id) {
    const [res] = await this.connection.query(
      `DELETE FROM history WHERE id = ?`,
      [id],
    );
    console.log(res);
  }
  /*
  async updateImage(id, ...values) {
    const [res] = await this.connection.query(
      `
  UPDATE history
SET ContactName = 'Alfred Schmidt', City= 'Frankfurt'
WHERE CustomerID = ?;
  `,
      [imageName, originalName, result, url],
    );
    console.log(res);
    return this.getImage(id);
  }
    */

  async closeConnection() {
    console.log("Closing database connection...");
    try {
      await this.connection.end();
      console.log("Database connection closed.");
    } catch (error) {
      console.error("Error closing the database connection:", error);
    }
  }
}

/*
const db = new Database();
db.connect();

const r = await db.getImage(4);
console.log(r);
db.closeConnection();

const newImage = await db.insertImage(
  "Qi1RjyZU3OjwM5u5AUE1.png",
  "image3.png",
  "metal",
  "https://fakeurl.com/images/3",
);
const date = new Date("27-05-22 10:00:00");
console.log(date);
  .toISOString()
  .slice(0, 19)
  .replace("T", " ");
console.log(date);
*/
//console.log(db.getImage(1));

//getImage
// getAllImages - getAllHistory
// addImage
//addImages create
//deleteImage
//updateImage??
//closeConnection

/*
  async closePool() {
    console.log('Closing database pool...');
    try {
      await this.pool.end();
      console.log('Database pool closed.');
    } catch (error) {
      console.error('Error closing the database pool:', error);
    }
  }

  }
const dbConnection = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT,
});

    this.connection.query(q, (err, data) => {
      if (err) console.log(`err: ${err}`);
      else console.log(`data: ${data}`);
    });

*/
