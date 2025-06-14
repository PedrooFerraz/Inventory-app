import { executeQuery, fetchAll } from '@/services/database';
import { Operator } from '@/types/types';

export const insertOperator = async (
  name: string,
  code: string
 ) => {
  const result = await executeQuery(
    'INSERT INTO operators (name, code) VALUES (?, ?);',
    [name, code]
  );
  return result;
};

export const fetchOperator = async () => {
  return await fetchAll<Operator>(
    'SELECT * FROM operators ORDER BY name ASC;'
  );
};

export const deleteOperator = async (id: number) => {
  const result = await executeQuery(
    'DELETE FROM operators WHERE id = ?;',
    [id]
  );
  return result;
};

export const updateOperator= async (
  id: number,
  name: string,
  code: string
)=> {
  const result = await executeQuery(
    'UPDATE operators SET name = ?, code = ? WHERE id = ?;',
    [name, code, id]
  );
  return result;
};

export const fetchOperatorById = async (id: number): Promise<Operator | null> => {
  const result = await fetchAll<Operator>(
    'SELECT * FROM operators WHERE id = ? LIMIT 1;',
    [id]
  );
  return result[0] || null;
};