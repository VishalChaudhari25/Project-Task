import dotenv from 'dotenv';
dotenv.config();
import express, { json } from 'express';
import db from './models/index.js';
import { Client } from 'pg';

const { sequelize } = db;


import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './routes/comments.routes.js'; 
import authRoutes from './routes/authroutes.js'; 

const client = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'basic_node_app_db', // Connect to a default database to get the list
  password: 'postgres',
  port: 5432,
});

const app = express();
app.use(express.json()); 

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/uploads', express.static('uploads'));
// Test root route
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Fallback route (keep this LAST)
app.use((req, res) => {
  console.error(` Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).send('Route not found');
});


// DB connection
sequelize.authenticate()
  .then(() => {
    console.log('Database connected...');
    return sequelize.sync({ force: false }); 
  })
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

  async function listSchemasAndTables() {
  try {
    await client.connect();
    console.log('Connected to the database.');

    const databaseInfo = {};

    // 1. Query to get all user-defined schema names
    const schemaQuery = `
      SELECT schema_name
      FROM information_schema.schemata
      WHERE schema_name NOT IN ('pg_catalog', 'information_schema', 'pg_toast');
    `;
    const schemaResult = await client.query(schemaQuery);
    const schemas = schemaResult.rows.map(row => row.schema_name);

    console.log('Schemas:', schemas);

    // 2. Loop through each schema to get its tables
    for (const schema of schemas) {
      // Query to get table names for the current schema
      const tableQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = $1
        AND table_type = 'BASE TABLE';
      `;
      const tableResult = await client.query(tableQuery, [schema]);
      const tables = tableResult.rows.map(row => row.table_name);

      // Store the result in our object
      databaseInfo[schema] = tables;
    }

    // 3. Log the final nested data structure
    console.log('Final Database Structure:', JSON.stringify(databaseInfo, null, 2));

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.end();
    console.log('Connection closed.');
  }
}

listSchemasAndTables();