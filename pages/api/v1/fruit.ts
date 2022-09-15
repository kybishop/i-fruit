// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Op, WhereOptions } from 'sequelize';
import Fruit, { PublicFruit } from '../../../models/fruit';
import FruitColor from '../../../models/fruit-color';

export type GetFruitData = PublicFruit[]

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetFruitData>
) {

  const where: WhereOptions<Fruit> = buildFruitConditionalsFromQuery(req.query);
  const fruitColorWhere: WhereOptions<FruitColor> = {};

  if (req.query.color) {
    // TODO(kjb) Check with PM: Should this only return the specified color, or all the potential colors
    // for fruits that have at least that color?
    fruitColorWhere.color = req.query.color;
  }

  const fruits = await Fruit.findAll({
    where,
    include: {
      model: FruitColor,
      as: 'fruitColors',
      where: fruitColorWhere,
      required: true,
    }
  });

  res
    .status(200)
    .json(fruits.map(fruit => fruit.serializeExternal()));
}

function buildFruitConditionalsFromQuery(query: NextApiRequest["query"]): WhereOptions<Fruit> {
  const where: WhereOptions<Fruit> = {};

  if (query.name) {
    where.name = { [Op.iLike]: `%${query.name}%` }
  }

  if (query.inSeason) {
    switch (query.inSeason) {
      case 'All':
        break;
      case 'Yes':
        where.inSeason = true;
        break;
      case 'No':
        where.inSeason = false;
        break;
      default:
        throw new Error(`Unhandled value for "inSeason": ${query.inSeason}`);
    }
  }

  return where;
}