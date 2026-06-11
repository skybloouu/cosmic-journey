import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { calculateJourney, STATIC_MILESTONES } from '../astroCalc';
import { startCosmicDrone, stopCosmicDrone } from '../audio';
import { getRandomQuote } from '../quotes';
function WikiPanel({ wikiQuery, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!wikiQuery) return;
    
    setLoading(true);
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiQuery)}`)
      .then(res => res.json())
      .then(json => {
        setData(json);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [wikiQuery]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(8px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
      onClick={onClose}
    >
      <motion.div 
        initial={{ y: 50, scale: 0.95 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: 20, scale: 0.95 }}
        className="glass-panel"
        style={{
          maxWidth: '500px', width: '100%',
          padding: '30px',
          background: 'rgba(15, 15, 25, 0.8)',
          position: 'relative'
        }}
        onClick={e => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          style={{ position: 'absolute', top: '15px', right: '15px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}
        >
          ✕
        </button>

        {loading ? (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>Retrieving cosmic archives...</div>
        ) : data && data.type !== 'https://mediawiki.org/wiki/HyperSwitch/errors/not_found' ? (
          <div>
            {data.thumbnail && (
              <img 
                src={data.thumbnail.source} 
                alt={data.title} 
                style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} 
              />
            )}
            <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{data.title}</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.95rem' }}>{data.extract}</p>
            {data.content_urls && data.content_urls.desktop && (
              <a href={data.content_urls.desktop.page} target="_blank" rel="noreferrer" style={{ display: 'inline-block', marginTop: '15px', color: 'var(--accent)', textDecoration: 'none', borderBottom: '1px solid var(--accent)' }}>
                Read more on Wikipedia
              </a>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No archives found for this region.</div>
        )}
      </motion.div>
    </motion.div>
  );
}


export default function JourneyView({ data, onReset }) {
  const { name, dateStr } = data;
  const [journey, setJourney] = useState(null);
  const [selectedWikiQuery, setSelectedWikiQuery] = useState(null);
  const [quote, setQuote] = useState(null);
  const prevMilestoneRef = useRef(null);

  useEffect(() => {
    // Select quote on mount
    setQuote(getRandomQuote());

    // Initial calculation
    const initialJourney = calculateJourney(dateStr);
    setJourney(initialJourney);
    prevMilestoneRef.current = initialJourney.currentMilestone.name;
    
    // Update every second, but since distances are rounded now, it won't tick crazily
    const interval = setInterval(() => {
      const newJourney = calculateJourney(dateStr);
      setJourney(newJourney);
      
      // Only track milestone for UI if needed, removed chime
      prevMilestoneRef.current = newJourney.currentMilestone.name;
    }, 1000);

    // Start the deep space ambient drone
    startCosmicDrone();

    return () => {
      clearInterval(interval);
      stopCosmicDrone(); // Fade out ambient drone when leaving this view
    };
  }, [dateStr]);

  if (!journey) return null;

  // Calculate position for the visual logarithmic scale
  // Max scale is log10(100,000 years in seconds) ≈ 12.5
  const MAX_LOG = 12.5;
  const currentLog = Math.log10(Math.max(1, journey.timeSeconds));
  const progressPercent = Math.min(100, Math.max(0, (currentLog / MAX_LOG) * 100));

  const markers = [
    { name: 'Earth', log: 0 },
    { name: 'Sun', log: Math.log10(499) },
    { name: 'Solar Edge', log: Math.log10(259200) },
    { name: 'Proxima', log: Math.log10(133804224) },
    { name: 'Galactic Core', log: Math.log10(820497600000) }
  ];

  const formattedDate = new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
        width: '100%',
        position: 'relative',
        zIndex: 10
      }}
    >
      <AnimatePresence>
        {selectedWikiQuery && (
          <WikiPanel wikiQuery={selectedWikiQuery} onClose={() => setSelectedWikiQuery(null)} />
        )}
      </AnimatePresence>

      {/* Header Panel */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="glass-panel" 
        style={{ maxWidth: '800px', width: '100%', padding: '30px', marginBottom: '24px' }}
      >
        <button 
          onClick={onReset}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontFamily: 'monospace', marginBottom: '20px' }}
        >
          &lt;- Return
        </button>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '5px' }} className="text-gradient">
          {name}'s Light
        </h2>
        <div style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '20px', fontStyle: 'italic' }}>
          Departed Earth on {formattedDate} &middot; Today is {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Distance Traveled</div>
            <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: 'var(--accent)', marginTop: '4px' }}>
              {journey.distanceKmStr}
            </div>
            {journey.distanceLyStr && (
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                ≈ {journey.distanceLyStr} Light Years
              </div>
            )}
            {!journey.distanceLyStr && journey.distanceAuStr && (
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                ≈ {journey.distanceAuStr} AU
              </div>
            )}
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Time Elapsed</div>
            <div style={{ fontSize: '1.5rem', fontFamily: 'monospace', color: 'var(--accent)', marginTop: '4px' }}>
              {Math.floor(journey.timeSeconds / 86400)} Days
            </div>
          </div>
        </div>

        {/* Visual Scale from Earth */}
        <div style={{ marginTop: '50px', position: 'relative', paddingBottom: '60px', overflow: 'visible' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '40px', textAlign: 'center' }}>Logarithmic Cosmic Scale</div>
          <div style={{ position: 'relative', width: '100%', height: '2px', background: 'var(--glass-border)' }}>
            <motion.div 
              initial={{ width: 0 }} 
              animate={{ width: `${progressPercent}%` }} 
              transition={{ duration: 2, ease: "easeOut" }} 
              style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${progressPercent}%`, background: 'var(--accent)' }} 
            />
            
            {/* Markers */}
            {markers.map((marker, idx) => {
              const posPercent = (marker.log / MAX_LOG) * 100;
              return (
                <div key={idx} style={{ position: 'absolute', left: `${posPercent}%`, top: '-4px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--text-muted)', zIndex: 2 }} />
                  <div style={{ position: 'absolute', top: '15px', whiteSpace: 'nowrap', fontSize: '0.65rem', color: 'var(--text-muted)', transform: 'rotate(45deg)', transformOrigin: 'top left' }}>
                    {marker.name}
                  </div>
                </div>
              );
            })}

            {/* Current Position Dot */}
            <motion.div 
              initial={{ left: 0 }} 
              animate={{ left: `calc(${progressPercent}% - 7px)` }} 
              transition={{ duration: 2, ease: "easeOut" }} 
              style={{ position: 'absolute', top: '-6px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 15px #fff', zIndex: 3 }} 
            />
            <motion.div 
              initial={{ left: 0 }} 
              animate={{ left: `calc(${progressPercent}% - 2px)` }} 
              transition={{ duration: 2, ease: "easeOut" }} 
              style={{ position: 'absolute', top: '-25px', whiteSpace: 'nowrap', fontSize: '0.75rem', color: '#fff', transform: 'translateX(-50%)', fontWeight: 'bold' }}
            >
              Current Location
            </motion.div>
          </div>
        </div>

      </motion.div>

      {/* Current Location Highlight */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
        className="glass-panel floating" 
        onClick={() => setSelectedWikiQuery(journey.currentMilestone.wikiQuery)}
        style={{ 
          maxWidth: '800px', width: '100%', padding: '40px', marginBottom: '24px', 
          border: '1px solid var(--glass-highlight)', background: 'rgba(20, 20, 40, 0.4)',
          cursor: 'pointer' 
        }}
        title="Click to view archives"
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span className="ascii-icon" style={{ fontSize: '2rem' }}>✯</span>
            <h3 style={{ fontSize: '1.5rem', color: 'var(--text-main)', margin: 0 }}>Current Region</h3>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>[Click for info]</span>
        </div>
        <div style={{ fontSize: '2.5rem', fontWeight: '300', marginBottom: '16px', color: '#fff' }}>
          {journey.currentMilestone.name}
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {journey.currentMilestone.fact}
        </p>
      </motion.div>

      {/* Cosmic Quote */}
      {quote && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 1.5 }}
          style={{ 
            maxWidth: '800px', width: '100%', 
            padding: '24px', 
            marginBottom: '24px',
            background: 'rgba(255,255,255,0.03)', 
            borderRadius: '12px', 
            borderLeft: '3px solid var(--accent)',
            backdropFilter: 'blur(4px)'
          }}
        >
          <p style={{ fontSize: '1.05rem', color: 'var(--text-main)', fontStyle: 'italic', lineHeight: '1.6', margin: 0 }}>
            "{quote.text}"
          </p>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'right' }}>
            — {quote.source}
          </div>
        </motion.div>
      )}

      {/* Timeline of Notable Places */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="glass-panel" 
        style={{ maxWidth: '800px', width: '100%', padding: '30px' }}
      >
        <h3 style={{ fontSize: '1.2rem', marginBottom: '24px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>Notable Places Passed</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {journey.passedMilestones.map((m, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedWikiQuery(m.wikiQuery)}
              style={{ 
                display: 'flex', gap: '20px', 
                opacity: index === 0 ? 1 : 0.6,
                cursor: 'pointer',
                transition: 'opacity 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = index === 0 ? '1' : '0.6'}
              title="Click to view archives"
            >
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: index === 0 ? 'var(--accent)' : 'var(--text-muted)' }}></div>
                {index !== journey.passedMilestones.length - 1 && (
                  <div style={{ width: '1px', flex: 1, background: 'var(--glass-border)', margin: '4px 0' }}></div>
                )}
              </div>
              <div style={{ paddingBottom: '20px', flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <div style={{ fontSize: '1.1rem', color: index === 0 ? 'var(--text-main)' : 'var(--text-muted)', marginBottom: '2px' }}>
                    {m.name}
                  </div>
                  {m.wikiQuery && (
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>[info]</span>
                  )}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginBottom: '6px', fontFamily: 'monospace' }}>
                  {new Date(new Date(dateStr).getTime() + m.timeSeconds * 1000).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                  {m.fact}
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}
