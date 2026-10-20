import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../shared/useReducedMotion';
import {
  CAPACITY,
  INITIAL_ITEMS,
  REQUIREMENTS,
  ZONE_INFO,
  ZONE_ORDER,
  balancePercent,
  firstOpenZone,
  isFunctional,
  isOffBalance,
  loadLabel,
  placementError,
  readinessCount,
  requirementMet,
  totalWeight,
  walkSpeed,
  type Item,
  type Kind,
  type Zone,
} from './inventory';
import styles from './survival-pack.module.css';

export const SurvivalPackDemo: React.FC = () => {
  const shakeTimer = useRef<number | null>(null);
  const [items, setItems] = useState<Item[]>(INITIAL_ITEMS);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [highlight, setHighlight] = useState<Kind | null>(null);
  const [overZone, setOverZone] = useState<Zone | null>(null);
  const [shake, setShake] = useState(false);
  const [message, setMessage] = useState('Pack for the night. Six essentials. Eight kilos.');
  const reducedMotion = useReducedMotion();

  useEffect(
    () => () => {
      if (shakeTimer.current !== null) {
        window.clearTimeout(shakeTimer.current);
      }
    },
    [],
  );

  const weight = totalWeight(items);
  const load = weight / CAPACITY;
  const loadState = loadLabel(load);
  const speed = walkSpeed(items);
  const offBalance = isOffBalance(items);
  const balance = balancePercent(items);
  const readiness = readinessCount(items);
  const ready = readiness === REQUIREMENTS.length;
  const selectedItem = selectedId === null ? null : items.find((item) => item.id === selectedId) ?? null;
  const activeLight = items.some(
    (item) => item.zone !== 'ground' && item.kind === 'light' && item.active && isFunctional(item),
  );
  const needleAngle = -90 + Math.min(1, load) * 180;

  const reject = (nextMessage: string) => {
    setMessage(nextMessage);
    if (reducedMotion) return;
    setShake(true);
    if (shakeTimer.current !== null) {
      window.clearTimeout(shakeTimer.current);
    }
    shakeTimer.current = window.setTimeout(() => {
      setShake(false);
      shakeTimer.current = null;
    }, 420);
  };

  const moveItem = (id: number, to: Zone) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item || item.zone === to) return;

    const error = placementError(item, to, items);
    if (error) {
      reject(error);
      return;
    }

    setItems((current) =>
      current.map((candidate) => (candidate.id === id ? { ...candidate, zone: to } : candidate)),
    );
    setMessage(
      `${item.name} moved to ${
        to === 'ground' ? 'the ground' : `the ${ZONE_INFO[to].label.toLowerCase()}`
      }.`,
    );
  };

  const packItem = (id: number) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;

    const zone = firstOpenZone(item, items);
    if (!zone) {
      const nextWeight = weight + item.weight;
      reject(
        nextWeight > CAPACITY
          ? `Too heavy. Drop ${(nextWeight - CAPACITY).toFixed(1)} kg first.`
          : 'No room left.',
      );
      return;
    }

    moveItem(id, zone);
  };

  const activateItem = (id: number) => {
    const item = items.find((candidate) => candidate.id === id);
    if (!item) return;

    if (item.zone === 'ground') {
      setMessage(`Pick up the ${item.name.toLowerCase()} first.`);
      return;
    }
    if (!item.usable) {
      setMessage(`${item.name} is not something you can use here.`);
      return;
    }
    if (item.quantity <= 0) {
      setMessage(`${item.name} is spent.`);
      return;
    }
    if (item.condition <= 0) {
      setMessage(`${item.name} is dead.`);
      return;
    }

    if (item.kind === 'light' || item.kind === 'signal') {
      const drain = item.kind === 'light' ? 10 : 15;
      const nextCondition = Math.max(0, item.condition - drain);
      const nextActive = nextCondition > 0 ? !item.active : false;

      setItems((current) =>
        current.map((candidate) =>
          candidate.id === id
            ? { ...candidate, condition: nextCondition, active: nextActive }
            : candidate,
        ),
      );

      if (nextCondition === 0) {
        setMessage(
          item.kind === 'light'
            ? 'The torch dies. The dark comes back.'
            : 'The radio goes quiet.',
        );
      } else if (nextActive) {
        setMessage(
          item.kind === 'light'
            ? 'The torch spills a weak circle of light.'
            : 'A voice under the static: "...shelter... hold..."',
        );
      } else {
        setMessage(item.kind === 'light' ? 'You click the torch off.' : 'You kill the radio.');
      }
      return;
    }

    if (item.kind === 'water') {
      setItems((current) =>
        current.map((candidate) => (candidate.id === id ? { ...candidate, quantity: 0 } : candidate)),
      );
      setMessage('You drink. The canteen is empty.');
      return;
    }

    if (item.kind === 'food') {
      setItems((current) =>
        current.map((candidate) => (candidate.id === id ? { ...candidate, quantity: 0 } : candidate)),
      );
      setMessage('You eat. The tin is empty.');
      return;
    }

    if (item.kind === 'med') {
      const nextQuantity = Math.max(0, item.quantity - 1);
      setItems((current) =>
        current.map((candidate) =>
          candidate.id === id ? { ...candidate, quantity: nextQuantity } : candidate,
        ),
      );
      setMessage(
        nextQuantity > 0
          ? `Wound dressed. ${nextQuantity} left.`
          : item.name === 'Medkit'
            ? 'The medkit is empty.'
            : 'The last bandage is gone.',
      );
      return;
    }

    setMessage(`${item.name} has no use here.`);
  };

  const handleDragStart = (event: React.DragEvent<HTMLButtonElement>, item: Item) => {
    event.dataTransfer.setData('text/plain', String(item.id));
    event.dataTransfer.effectAllowed = 'move';
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
    const raw = event.dataTransfer.getData('text/plain');
    if (!raw) return;
    const id = Number(raw);
    if (Number.isInteger(id)) moveItem(id, zone);
  };

  const selectItem = (id: number) => {
    setSelectedId((current) => (current === id ? null : id));
  };

  const renderItem = (item: Item) => {
    const selected = selectedId === item.id;
    const spent = !isFunctional(item);
    const quantityLabel =
      item.quantity <= 0 ? 'empty' : item.condition <= 0 ? 'spent' : `x${item.quantity}`;

    return (
      <button
        key={item.id}
        type="button"
        className={styles.item}
        data-kind={item.kind}
        data-selected={selected}
        data-highlight={highlight === item.kind}
        data-empty={spent}
        data-active={item.active}
        style={{ '--r': item.rotation } as React.CSSProperties}
        draggable
        onDragStart={(event) => handleDragStart(event, item)}
        onDragEnd={() => setOverZone(null)}
        onClick={() => selectItem(item.id)}
        aria-pressed={selected}
        aria-label={`${item.name}, ${item.weight.toFixed(1)} kilograms, ${item.quantity} left, condition ${item.condition} percent, in ${ZONE_INFO[item.zone].label}. ${
          item.zone === 'ground' ? 'Select to pack.' : 'Select to inspect, use, or move.'
        }`}
      >
        <span className={styles.itemName}>{item.name}</span>
        <small>
          {item.weight.toFixed(1)} kg · {quantityLabel}
        </small>
        {item.active ? <span className={styles.activeDot} aria-hidden="true" /> : null}
      </button>
    );
  };

  const renderZone = (zone: Zone, className: string) => {
    const info = ZONE_INFO[zone];
    const contents = items.filter((item) => item.zone === zone);
    const emptySlots = Number.isFinite(info.capacity)
      ? Math.max(0, info.capacity - contents.length)
      : 0;

    return (
      <div
        className={`${styles.zone} ${className}`}
        data-over={overZone === zone}
        role="group"
        aria-label={`${info.label}, ${contents.length}${
          Number.isFinite(info.capacity) ? ` of ${info.capacity}` : ''
        } items`}
        onDragOver={(event) => handleDragOver(event, zone)}
        onDragLeave={handleDragLeave}
        onDrop={(event) => handleDrop(event, zone)}
      >
        <div className={styles.zoneHead}>
          <h3>{info.label}</h3>
          <span className={styles.count}>
            {Number.isFinite(info.capacity)
              ? `${contents.length}/${info.capacity}`
              : `${contents.length} items`}
          </span>
        </div>

        <div className={styles.slots}>
          {contents.map(renderItem)}
          {Array.from({ length: emptySlots }).map((_, index) => (
            <span
              key={`empty-${zone}-${index}`}
              className={styles.emptySlot}
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    );
  };

  const checklist = (
    <aside className={styles.checklist} aria-label="Bug-out checklist">
      <div className={styles.clip} aria-hidden="true" />
      <div className={styles.checklistHead}>
        <h3>BUG-OUT</h3>
        <span>
          {readiness}/{REQUIREMENTS.length}
        </span>
      </div>

      <div className={styles.checkRows}>
        {REQUIREMENTS.map((requirement) => {
          const met = requirementMet(items, requirement);
          const active = highlight === requirement.kind;

          return (
            <button
              key={requirement.id}
              type="button"
              className={styles.checkRow}
              data-met={met}
              data-active={active}
              aria-pressed={active}
              onClick={() =>
                setHighlight((current) => (current === requirement.kind ? null : requirement.kind))
              }
            >
              <span className={styles.checkBox} aria-hidden="true">
                {met ? '✓' : ''}
              </span>
              <span className={styles.checkLabel}>{requirement.label}</span>
              <span className={styles.checkStatus}>{met ? 'PACKED' : 'MISSING'}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.stamp} data-ready={ready} aria-hidden="true">
        {ready ? 'READY' : 'NOT READY'}
      </div>
      <p className={styles.srOnly}>
        {readiness} of {REQUIREMENTS.length} essentials packed.{' '}
        {ready ? 'Ready to move.' : 'Not ready to move.'}
      </p>
    </aside>
  );

  const scale = (
    <div className={styles.scale}>
      <span className={styles.hook} aria-hidden="true" />
      <div
        className={styles.gauge}
        role="progressbar"
        aria-label="Carried weight"
        aria-valuemin={0}
        aria-valuemax={CAPACITY}
        aria-valuenow={Number(weight.toFixed(1))}
        aria-valuetext={`${weight.toFixed(1)} of ${CAPACITY} kilograms carried`}
      >
        <div className={styles.dial} aria-hidden="true">
          {Array.from({ length: 9 }).map((_, index) => (
            <span
              key={index}
              className={styles.tick}
              style={{ '--angle': `${-90 + index * 22.5}deg` } as React.CSSProperties}
            />
          ))}
          <span
            className={styles.needle}
            style={{ '--angle': `${needleAngle}deg` } as React.CSSProperties}
          />
          <span className={styles.hub} />
        </div>
        <div className={styles.scaleReadout}>
          {weight.toFixed(1)}
          <small> / {CAPACITY} kg</small>
        </div>
      </div>
      <div className={styles.balance} data-off={offBalance}>
        <span className={styles.balanceTrack} aria-hidden="true">
          <b style={{ left: `${balance}%` }} />
        </span>
        <span>{offBalance ? 'OFF-BALANCE' : 'BALANCED'}</span>
      </div>
    </div>
  );

  const status = (
    <div className={styles.status}>
      <div className={styles.statusTop}>
        <span className={styles.weight}>
          {weight.toFixed(1)} / {CAPACITY.toFixed(1)} kg
        </span>
        <span>
          {loadState} · WALK {speed}%
        </span>
      </div>
      <div className={styles.statusMeta}>
        <span>{offBalance ? 'OFF-BALANCE' : 'BALANCED'}</span>
        <span>
          {readiness}/{REQUIREMENTS.length} ESSENTIALS
        </span>
      </div>
    </div>
  );

  const itemCard = selectedItem ? (
    <div
      className={styles.itemCard}
      role="region"
      aria-label={`Selected item: ${selectedItem.name}`}
    >
      <div className={styles.cardMain}>
        <span className={styles.cardKind} data-kind={selectedItem.kind}>
          {selectedItem.kind}
        </span>
        <h3>{selectedItem.name}</h3>
        <p className={styles.cardMeta}>
          {selectedItem.weight.toFixed(1)} kg ·{' '}
          {selectedItem.quantity > 0 ? `${selectedItem.quantity} left` : 'empty'} ·{' '}
          {selectedItem.condition}% condition
        </p>
        <p className={styles.cardNote}>{selectedItem.note}</p>
        <div className={styles.condition} aria-hidden="true">
          <b style={{ width: `${selectedItem.condition}%` }} />
        </div>
      </div>

      <div className={styles.cardActions}>
        {selectedItem.usable ? (
          <button
            type="button"
            className={styles.action}
            onClick={() => activateItem(selectedItem.id)}
            aria-disabled={
              selectedItem.zone === 'ground' || !isFunctional(selectedItem) ? true : undefined
            }
            data-disabled={selectedItem.zone === 'ground' || !isFunctional(selectedItem)}
            title={
              selectedItem.zone === 'ground'
                ? 'Pick it up first.'
                : !isFunctional(selectedItem)
                  ? 'It is spent.'
                  : undefined
            }
          >
            USE
          </button>
        ) : null}

        {selectedItem.zone === 'ground' ? (
          <button type="button" className={styles.action} onClick={() => packItem(selectedItem.id)}>
            PACK
          </button>
        ) : (
          <button
            type="button"
            className={styles.action}
            onClick={() => moveItem(selectedItem.id, 'ground')}
          >
            DROP
          </button>
        )}

        <label className={styles.stow}>
          <span>STOW IN</span>
          <select
            value={selectedItem.zone}
            onChange={(event) => moveItem(selectedItem.id, event.target.value as Zone)}
          >
            {ZONE_ORDER.map((zone) => {
              const error = placementError(selectedItem, zone, items);
              return (
                <option
                  key={zone}
                  value={zone}
                  disabled={zone !== selectedItem.zone && error !== null}
                >
                  {ZONE_INFO[zone].label}
                </option>
              );
            })}
          </select>
        </label>

        <button
          type="button"
          className={styles.close}
          onClick={() => setSelectedId(null)}
          aria-label="Close item details"
        >
          ×
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div className={styles.shell}>
      <div
        className={styles.stage}
        data-lit={activeLight}
        role="group"
        aria-label="Abəde Backpack inventory demo"
        tabIndex={0}
      >
        <div className={styles.wrap}>
          <div className={styles.packArea}>
            {scale}

            <div className={styles.packColumn}>
              <div className={styles.pack} data-shake={shake}>
                {renderZone('lid', styles.lid)}
                {renderZone('main', styles.main)}
                <div className={styles.pockets}>
                  {renderZone('left', styles.pocket)}
                  {renderZone('right', styles.pocket)}
                </div>
                {renderZone('belt', styles.belt)}
              </div>

              <div className={styles.hands}>
                {renderZone('handLeft', styles.hand)}
                {renderZone('handRight', styles.hand)}
              </div>

              {status}
            </div>
          </div>

          <div className={styles.side}>
            {checklist}
            {renderZone('ground', styles.ground)}
          </div>

          <div className={styles.message} role="status" aria-live="polite">
            {message}
          </div>
        </div>
      </div>

      {itemCard}
    </div>
  );
};
