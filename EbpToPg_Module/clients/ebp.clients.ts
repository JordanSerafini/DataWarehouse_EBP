import * as sql from 'mssql';

import { config } from 'dotenv';

config();

if (!process.env.CLIENT_EBP_SERVER || !process.env.CLIENT_EBP_DATABASE) {
  throw new Error(
    "Les variables d'environnement CLIENT_EBP_SERVER et CLIENT_EBP_DATABASE sont requises.",
  );
}

const dbConfig: sql.config = {
  server: process.env.CLIENT_EBP_SERVER,
  database: process.env.CLIENT_EBP_DATABASE,
  authentication: {
    type: 'default',
    options: {
      userName: process.env.EBP_USER || 'sa',
      password: process.env.EBP_PASSWORD || '@ebp78EBP',
    },
  },
  options: {
    trustServerCertificate: true,
    encrypt: true,
  },
};

class DatabaseClient {
  private pool: sql.ConnectionPool | null;

  constructor() {
    this.pool = null;
  }

  async connect(): Promise<void> {
    if (!this.pool) {
      try {
        console.log('Tentative de connexion au serveur SQL...');
        console.log('Config SQL:', JSON.stringify(dbConfig, null, 2));
        console.log('sql.connect existe:', typeof sql.connect === 'function');

        this.pool = await sql.connect(dbConfig);
        console.log('Connection to the database established successfully!');
      } catch (error) {
        console.error('Error connecting to the database:', error);
        throw error;
      }
    }
  }

  async query(
    query: string,
    params?: { [name: string]: any },
  ): Promise<sql.IResult<any>> {
    if (!this.pool) {
      await this.connect();
    }

    if (!this.pool) {
      throw new Error('Impossible de se connecter à la base de données EBP');
    }

    const request = new sql.Request(this.pool);

    if (params) {
      Object.keys(params).forEach((key) => {
        request.input(key, sql.NVarChar, params[key]);
      });
    }

    try {
      const result: sql.IResult<any> = await request.query(query);
      return result;
    } catch (error) {
      console.error('Error executing query:', error);
      throw error;
    }
  }
}

const EBPclient = new DatabaseClient();
export default EBPclient;