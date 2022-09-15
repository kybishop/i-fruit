// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { QueryTypes } from 'sequelize';
import { sequelize } from '../../../lib/services/fruit-store';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string[]>
) {
  
  const colors: { color: string }[] = await sequelize.query(
    'SELECT UNNEST(ENUM_RANGE(NULL, NULL::fruit_color_enum)) AS "color"',
    {
      type: QueryTypes.SELECT
    }
  )

  res.status(200).json(colors.map(row => row.color));
}
