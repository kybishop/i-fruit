import {
  DataTypes,
  Model
} from 'sequelize';
import Fruit from './fruit';
import { sequelize } from '../lib/services/fruit-store';

interface FruitColor {
  color: 
    'blue'|
    'green'|
    'orange'|
    'purple'|
    'red'|
    'white'|
    'yellow';
  fruitId: number;
}

class FruitColor extends Model implements FruitColor {
  static associate() {
    FruitColor.belongsTo(Fruit);
  }
}
FruitColor.init({
  fruitId: DataTypes.INTEGER,
  color: {
    type: DataTypes.ENUM,
    values: [
      'blue',
      'green',
      'orange',
      'purple',
      'red',
      'white',
      'yellow'
    ]
  }
}, {
  sequelize,
  modelName: 'FruitColor',
});

export default FruitColor;