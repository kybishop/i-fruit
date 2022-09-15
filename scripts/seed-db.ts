import { sequelize } from '../lib/services/fruit-store';
import Fruit from '../models/fruit';
import FruitColor from '../models/fruit-color';

const seedData = [
  {
      "name": "Apple",
      "colors": ["red", "green", "yellow"],
      "inSeason": true
  },
  {
      "name": "Orange",
      "colors": ["orange"],
      "inSeason": true
  },
  {
      "name": "Grapes",
      "colors": ["purple", "green"],
      "inSeason": false
  },
  {
      "name": "Lime",
      "colors": ["green"],
      "inSeason": false
  },
  {
      "name": "Banana",
      "colors": ["yellow"],
      "inSeason": false
  },
  {
      "name": "Watermelon",
      "colors": ["red"],
      "inSeason": false
  },
  {
      "name": "Blueberry",
      "colors": ["blue"],
      "inSeason": true
  },
  {
      "name": "Coconut",
      "colors": ["white"],
      "inSeason": true
  }
]

async function seedDb() {
  sequelize.authenticate();
  console.log("seeding DB");
  try {
    console.log('Connection has been established successfully.');

    await Fruit.bulkCreate(seedData, { ignoreDuplicates: true });

    await Promise.all(
      seedData.map(async fruitData => {
        const [fruit] = await Fruit.findOrCreate({
          where: { name: fruitData.name },
          defaults: fruitData
        });

        for (const color of fruitData.colors) {
          await FruitColor.findOrCreate({
            where: { fruitId: fruit.id, color },
          })
        }
      })
    );
  } catch (error) {
    console.error('Unable to seed the database:', error);
    throw error;
  }
}

seedDb().then(() => {
  process.exit(0);
});

