import createConnection from '../index';

async function checkAndInsert(connection, tableName, data) {
  const existingRecords = await connection.query(`SELECT * FROM ${tableName}`);
  const existingIds = new Set(existingRecords.map(record => record.id));

  const recordsToInsert = data.filter(record => !existingIds.has(record.id));

  if (recordsToInsert.length > 0) {
    // Pega as chaves do objeto atual
    const columns = Object.keys(recordsToInsert[0]);
    const values = recordsToInsert
      .map(record => `(${columns.map(col => `'${record[col]}'`).join(', ')})`)
      .join(', ');

    await connection.query(`INSERT INTO ${tableName} (${columns.join(', ')}) VALUES ${values}`);
  }
}

export async function initialParameters() {
  const connection = await createConnection();

  await connection.close();
}
