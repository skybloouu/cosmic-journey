import React, { useState } from 'react';
import { motion } from 'framer-motion';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { initAudio } from '../audio';

export default function ChitaForm({ onSubmit }) {
  const [name, setName] = useState('');
  const [dateObj, setDateObj] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !dateObj) return;
    initAudio(); // Unlock audio on user interaction
    onSubmit({ name, dateStr: dateObj.toISOString() });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        width: '100%',
        padding: '20px'
      }}
    >
      <div className="glass-panel" style={{ maxWidth: '400px', width: '100%', padding: '40px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '8px', fontSize: '2rem' }} className="text-gradient">
          <span className="ascii-icon">✦</span> 
          Cosmic Journey
        </h1>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
          In Indian traditions, a <em>Chita</em> (&#x091A;&#x093F;&#x0924;&#x093E;) is a funeral pyre, the sacred fire that releases the soul from its earthly form.
        </p>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', lineHeight: '1.6' }}>
          When the flames rise, they carry light. Those photons are not mere particles. They are <em>them</em>. Their warmth, their presence, now racing across the universe at the speed of light, voyaging past stars, nebulae, and galaxies.
        </p>
        <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '30px', lineHeight: '1.6' }}>
          They are doing what every living soul dreams of but can never achieve. Truly travelling the cosmos, unbound by time, gravity, or distance. This is their eternal journey.
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--accent)' }}>Name of the loved one</label>
            <input 
              type="text" 
              className="glass-input" 
              placeholder="e.g. Aakash"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.85rem', color: 'var(--accent)' }}>Date of passing</label>
            <DatePicker 
              selected={dateObj} 
              onChange={date => setDateObj(date)} 
              maxDate={new Date()}
              className="glass-input"
              placeholderText="Select a date"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
              required
            />
          </div>

          <button type="submit" className="glass-button" style={{ marginTop: '10px' }}>
            Begin Journey <span style={{ fontFamily: 'monospace', marginLeft: '8px' }}>-&gt;</span>
          </button>
        </form>
      </div>
    </motion.div>
  );
}
