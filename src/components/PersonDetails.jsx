import React from 'react';
import { User, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import { usePhotoStore } from '../store/photoStore';
import styles from './PersonDetails.module.css';

export default function PersonDetails() {
  const {
    showDetails, setShowDetails,
    personName, setPersonName,
    personDob, setPersonDob,
  } = usePhotoStore();

  return (
    <div className={styles.panel}>
      <div className={styles.panelHeader}>
        <div className={styles.headerLeft}>
          <User size={15} />
          <span>Name & DOB below photo</span>
        </div>
        <button
          className={styles.toggle}
          onClick={() => setShowDetails(!showDetails)}
          aria-label="Toggle details"
        >
          {showDetails
            ? <ToggleRight size={24} color="var(--accent)" />
            : <ToggleLeft size={24} color="var(--ink-light)" />}
        </button>
      </div>

      {showDetails && (
        <div className={styles.fields}>
          <div className={styles.field}>
            <label className={styles.label}>
              <User size={13} /> Full Name
            </label>
            <input
              type="text"
              className={styles.input}
              placeholder="e.g. RAHUL SHARMA"
              value={personName}
              onChange={e => setPersonName(e.target.value)}
              maxLength={40}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              <Calendar size={13} /> Date of Birth
            </label>
            <input
              type="date"
              className={styles.input}
              value={personDob}
              onChange={e => setPersonDob(e.target.value)}
            />
          </div>
          <p className={styles.note}>
            Printed in small text beneath each photo on the A4 sheet.
          </p>
        </div>
      )}
    </div>
  );
}
