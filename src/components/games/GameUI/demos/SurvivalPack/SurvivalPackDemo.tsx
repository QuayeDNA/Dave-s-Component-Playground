import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../shared/useReducedMotion';
import styles from './survival-pack.module.css';

type Zone = 'pack' | 'ground';

interface Item {
  id: number;
  name: string;
  weight: number;
  zone: Zone;
  rotation: string;
  kind: string;
}

const CAPACITY = 8;

const INITIAL_ITEMS: Item[] = [
  { id: 0, name: 'Canned beans', weight: 0.8, zone: 'pack', rotation: '-2deg', kind: 'food' },
  { id: 1, name: 'Torch', weight: 0.6, zone: 'pack', rotation: '0deg', kind: 'tool' },
  { id: 2, name: 'Bandages', weight: 0.2, zone: 'pack', rotation: '2deg', kind: 'med' },
  { id: 3, name: 'Radio', weight: 1.4, zone: 'pack', rotation: '-1deg', kind: 'tool' },
  { id: 4, name: 'Water', weight: 1.0, zone: 'pack', rotation: '1deg', kind: 'water' },
  { id: 5, name: 'Crowbar', weight: 2.5, zone: 'ground', rotation: '-2deg', kind: 'tool' },
  { id: 6, name: 'Machete', weight: 1.8, zone: 'ground', rotation: '0deg', kind: 'tool' },
  { id: 7, name: 'Shells', weight: 0.4, zone: 'ground', rotation: '2deg', kind: 'ammo' },
  { id: 8, name: 'Rope', weight: 1.2, zone: 'ground', rotation: '-1deg', kind: 'tool' },
  { id: 9, name: 'Medkit', weight: 1.5, zone: 'ground', rotation: '1deg', kind: 'med' },
];

const packWeightOf = (items: Item[]): number =>
  items
    .filter((item) => item.zone === 'pack')
    .reduce((total, item) => total + item.weight, 0);

export const SurvivalPackDemo: React.FC = () => {
  const stageRef = useRef<HTMLDivElement>(null);
  const shakeTimer = useRef<number | null>(null);
  const lastDragAt = useRef(0);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [overZone, setOverZone] = useState<Zone | null>(null);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('Pack light. Move what you need.');
  const reducedMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (shakeTimer.current !== null) {
        window.clearTimeout(shakeTimer.current);
      }
    },
    [],
  );

  const packWeight = packWeightOf(items);
  const load = packWeight / CAPACITY;
  const loadLabel = load < 0.5 ? 'LIGHT' : load < 0.85 ? 'LOADED' : 'HEAVY';
  const walkSpeed = Math.round(100 - Math.max(0, load - 0.5) * 80);
  const packItems = items.filter((item) => item.zone === 'pack');
  const groundItems = items.filter((item) => item.zone === 'ground');

  const moveItem = (id: number, to: Zone) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item || item.zone === to) return;

    if (to === 'pack' && packWeight + item.weight > CAPACITY + 1e-6) {
      const excess = Math.max(0, packWeight + item.weight - CAPACITY);
      setMessage(`Too heavy. Drop ${excess.toFixed(1)} kg before packing the ${item.name.toLowerCase()}.`);
      if (!reducedMotion) {
        setShake(true);
        if (shakeTimer.current !== null) {
          window.clearTimeout(shakeTimer.current);
        }
        shakeTimer.current = window.setTimeout(() => {
          setShake(false);
          shakeTimer.current = null;
        }, 420);
      }
      return;
    }

    setItems((current) =>
      current.map((candidate) =>
        candidate.id === id ? { ...candidate, zone: to } : candidate,
      ),
    );
    setMessage(
      `${item.name} moved to ${to === 'pack' ? 'the backpack' : 'the ground'}. Walk speed ${Math.round(
        100 - Math.max(0, (to === 'pack' ? packWeight + item.weight : packWeight - item.weight) / CAPACITY - 0.5) * 80,
      )}%.`,
    );
  };

  const handleItemClick = (item: Item) => {
    if (Date.now() - lastDragAt.current < 400) return;
    moveItem(item.id, item.zone === 'pack' ? 'ground' : 'pack');
  };

  const startDrag = (event: React.DragEvent<HTMLButtonElement>, item: Item) => {
    event.dataTransfer.setData('text/plain', String(item.id));
    event.dataTransfer.effectAllowed = 'move';
    lastDragAt.current = Date.now();
  };

  const endDrag = () => {
    lastDragAt.current = Date.now();
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>, zone: Zone) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setOverZone(zone);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    const related = event.relatedTarget as Node | null;
    if (related && event.currentTarget.contains(related)) return;
    setOverZone(null);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, zone: Zone) => {
    event.preventDefault();
    setOverZone(null);
    lastDragAt.current = Date.now();
    const id = Number(event.dataTransfer.getData('text/plain'));
    if (Number.isInteger(id)) moveItem(id, zone);
  };

  const renderItem = (item: Item) => (
    <button
      key={item.id}
      type="button"
      className={styles.item}
      style={{ '--r': item.rotation } as React.CSSProperties}
      draggable
      onDragStart={(event) => startDrag(event, item)}
      onDragEnd={endDrag}
      onClick={() => handleItemClick(item)}
      aria-label={`${item.name}, ${item.weight.toFixed(1)} kilograms, in ${
        item.zone === 'pack' ? 'the backpack' : 'the ground'
      }. Activate to move it to ${item.zone === 'pack' ? 'the ground' : 'the backpack'}.`}
    >
      {item.name}
      <small>
        {item.weight.toFixed(1)} kg · {item.kind}
      </small>
    </button>
  );

  const renderZone = (zone: Zone, title: string, contents: Item[]) => (
    <div
      className={styles.zone}
      data-over={overZone === zone}
      data-shake={zone === 'pack' && shake}
      onDragOver={(event) => handleDragOver(event, zone)}
      onDragLeave={handleDragLeave}
      onDrop={(event) => handleDrop(event, zone)}
    >
      <div className={styles.zoneHead}>
        <h3>{title}</h3>
        <span className={styles.count}>
          {contents.length} {contents.length === 1 ? 'item' : 'items'}
        </span>
      </div>

      <div className={styles.items}>
        {contents.length > 0 ? (
          contents.map(renderItem)
        ) : (
          <p className={styles.empty}>
            {zone === 'pack' ? 'The pack is empty.' : 'Nothing left on the ground.'}
          </p>
        )}
      </div>

      {zone === 'pack' && (
        <div className={styles.status}>
          <div className={styles.statusLine}>
            <span className={styles.weight}>
              {packWeight.toFixed(1)} / {CAPACITY.toFixed(1)} kg
            </span>
            <span>
              {loadLabel} · WALK {walkSpeed}%
            </span>
          </div>
          <div
            className={styles.bar}
            data-heavy={load >= 0.85}
            role="progressbar"
            aria-label="Backpack weight"
            aria-valuemin={0}
            aria-valuemax={CAPACITY}
            aria-valuenow={Number(packWeight.toFixed(1))}
            aria-valuetext={`${packWeight.toFixed(1)} of ${CAPACITY} kilograms`}
          >
            <b style={{ width: `${Math.min(100, load * 100)}%` }} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      ref={stageRef}
      className={styles.stage}
      role="group"
      aria-label="Abəde Backpack inventory demo"
      tabIndex={0}
    >
      <div className={styles.wrap}>
        {renderZone('pack', 'Backpack', packItems)}
        {renderZone('ground', 'On the ground', groundItems)}
        <div className={styles.message} role="status" aria-live="polite">
          {message}
        </div>
      </div>
    </div>
  );
};
