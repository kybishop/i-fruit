import { DataTypes, Model, Optional } from 'sequelize';
import FruitColor from './fruit-color';
import { sequelize } from '../lib/services/fruit-store';

interface FruitAttributes {
  id: number;
  name: string;
  inSeason: boolean;
}

export type PublicFruit = {
  name: string;
  inSeason: boolean;
  colors?: string[];
}

export interface FruitInput extends Optional<FruitAttributes, 'id'> {}
export interface FruitOuput extends Required<FruitAttributes> {}

class Fruit extends Model<FruitAttributes, FruitInput> implements FruitAttributes {
  public id!: number
  public name!: string
  public inSeason!: boolean;
  public fruitColors?: FruitColor[];

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate() {
    Fruit.hasMany(
      FruitColor,
      {
        as: 'fruitColors',
        foreignKey: 'fruitId',
        sourceKey: 'id'
      }
    );
  }

  serializeExternal(): PublicFruit {
    return {
      name: this.name,
      inSeason: this.inSeason,
      colors: this.fruitColors?.map(fruitColor => fruitColor.color),
    }
  }
}

Fruit.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true,
  },
  name: DataTypes.STRING,
  inSeason: DataTypes.BOOLEAN
}, {
  timestamps: true,
  sequelize,
  modelName: 'Fruit',
});

Fruit.associate();

export default Fruit;