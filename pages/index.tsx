import type { NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import FruitRow from '../components/fruit-row';
import { PublicFruit } from '../models/fruit';
import styles from '../styles/Home.module.scss';

const BASE_FRUIT_URL = '/api/v1/fruit';
const FRUIT_COLOR_URL = '/api/v1/fruit-color';

type InSeasonOption = 'Yes' | 'No' | 'All';

const Home: NextPage = () => {
  const router = useRouter();

  const [colorOptions, setColorOptions] = useState<string[]>([]);
  const [fruits, setFruits] = useState<PublicFruit[]>([]);

  const [color, setColor] = useState<string>('');
  const [name, setName] = useState('');
  const [inSeason, setInSeason] = useState<InSeasonOption>('All');

  const [queryString, setQueryString] = useState('');

  const updateTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    async function getColors() {
      const response = await fetch(FRUIT_COLOR_URL);

      await response.json().then(colorsData => {
        colorsData.sort();
        colorsData.unshift('');
        setColorOptions(colorsData);
      });
    }

    getColors();
  }, []);

  // NOTE(kjb) Full disclosure: This block was added post presentation after
  // remembering next.js's router is flaky on initial load. The rest of the code remains the same
  useEffect(() => {
    if (!router.isReady) return;
    
    setColor((router.query.color || '') as string);
    setName((router.query.name || '') as string);
    setInSeason((router.query.inSeason || 'All') as InSeasonOption);
  }, [router]);

  useEffect(() => {
    if (!router.isReady) return;

    async function debouncedUpdateQueryString() {
      clearTimeout(updateTimeout.current);

      updateTimeout.current = setTimeout(
        () => {
          let newQueryString = '';
          if (name || color || inSeason != 'All') {
            newQueryString = '?' + new URLSearchParams({ name, color, inSeason });
          }

          setQueryString(newQueryString);

          window.history.replaceState({}, '', `${location.pathname}${newQueryString}`)
        },
        200
      );
    }

    debouncedUpdateQueryString();
  }, [color, name, inSeason, router]);

  const fetchFruitControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    async function fetchFruit() {
      try {
        if (fetchFruitControllerRef.current) {
          fetchFruitControllerRef.current.abort();
        }
  
        fetchFruitControllerRef.current = new AbortController();

        const url = `${BASE_FRUIT_URL}${queryString}`;

        const response = await fetch(url, {
          signal: fetchFruitControllerRef.current.signal
        });
        await response.json().then(fruitData => {
          fruitData.sort((a: PublicFruit, b: PublicFruit) => a.name.localeCompare(b.name));
          setFruits(fruitData)
        });

        fetchFruitControllerRef.current = null;
      } catch (error) {
        if (error instanceof Error && error.name == 'AbortError') {
          return;
        }

        // TODO(kjb) Add error handling
        throw error;
      }
    }

    fetchFruit();
  }, [queryString]);

  return (
    <div className={styles.container}>
      <Head>
        <title>iFruit</title>
        <meta name="description" content="Next Generation Fruit Technology" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.row} style={{ paddingBottom: 20 }}>
          <label className={styles.label}>
            Name:
            <input
              type="text"
              name="name"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder='Search...'
              style={{ marginLeft: 5 }}
            />
          </label>

          <label className={styles.label}>
            Color:
            <select
              name="color"
              onChange={e => setColor(e.target.value)}
              style={{ marginLeft: 5, minWidth: 70 }}
            >
              {colorOptions.map(color => {
                return <option key={color} value={color}>
                  {color}
                </option>
              })}
            </select>
          </label>

          <label className={styles.label}>
            In Season:
            <select
              name="inSeason"
              value={inSeason}
              onChange={e => setInSeason(e.target.value as InSeasonOption)}
              style={{ marginLeft: 5, minWidth: 70 }}
            >
              {['All', 'Yes', 'No'].map(opt => {
                return <option key={opt} value={opt}>
                  {opt}
                </option>
              })}
            </select>
          </label>
        </div>

        {fruits.map(fruit => {
          // LATER(kjb) Should probably key on an external ID incase we add something like fruit.variety
          return <FruitRow fruit={fruit} key={fruit.name} />
        })}
      </main>
    </div>
  )
}

export default Home;
