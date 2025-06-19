// src/services/passwordService.ts
import { executeQuery, fetchAll } from './database';

export const hasMasterPassword = async () => {
  const result = await fetchAll<{master_password: string}>(
    'SELECT master_password FROM app_config LIMIT 1'
  );
  return result[0].master_password !== null;
};

export const setMasterPassword = async (password: string) => {
  await executeQuery('DELETE FROM app_config');
  await executeQuery(
    'INSERT INTO app_config (master_password) VALUES (?)',
    [password]
  );
};

export const verifyMasterPassword = async (password: string) => {
  const result = await fetchAll<{master_password: string}>(
    'SELECT master_password FROM app_config LIMIT 1'
  );

  return result[0].master_password === password;
};