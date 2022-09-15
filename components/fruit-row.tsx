import React from 'react';
import { PublicFruit } from '../models/fruit';
import styles from '../styles/fruit-row.module.scss';

/**
 * Displays an informational row about the fruit 
 */
export default function FruitRow({ fruit }: { fruit: PublicFruit}) {
  return <div className={styles.row}>
    <div className={styles.nameContainer}>
      {fruit.name}
    </div>

    <div className={styles.inSeasonContainer}>
      {fruit.inSeason ? 'In Season' : 'Not In Season'}
    </div>

    <div>
      {fruit.colors?.map(color => {
        return <span key={color} style={{ color, marginRight: 5 }}>
          {color}
        </span>
      })}
    </div>
  </div>;
}