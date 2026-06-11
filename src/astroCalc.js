export const SPEED_OF_LIGHT_KM_S = 299792.458;
export const SECONDS_IN_YEAR = 31557600; // Julian year
export const KM_IN_LY = SPEED_OF_LIGHT_KM_S * SECONDS_IN_YEAR;

export const STATIC_MILESTONES = [
  { timeSeconds: 0, name: "The Chita (Earth)", fact: "The journey begins here, where the physical form becomes light and energy.", wikiQuery: "Earth" },
  { timeSeconds: 1.28, name: "The Moon", fact: "It takes light just over a second to reach our closest celestial neighbor.", wikiQuery: "Moon" },
  { timeSeconds: 137, name: "Venus", fact: "The brightest planet in our night sky, shrouded in thick clouds of sulfuric acid.", wikiQuery: "Venus" },
  { timeSeconds: 260, name: "Mars", fact: "The red planet, covered in iron oxide dust and home to the largest volcano in the solar system.", wikiQuery: "Mars" },
  { timeSeconds: 499, name: "The Sun", fact: "The heart of our solar system. The photons briefly mingle with the light of our star.", wikiQuery: "Sun" },
  { timeSeconds: 2592, name: "Jupiter", fact: "The gas giant, massive enough to hold over 1,300 Earths inside it.", wikiQuery: "Jupiter" },
  { timeSeconds: 4758, name: "Saturn", fact: "Known for its stunning ring system made mostly of ice particles and rocky debris.", wikiQuery: "Saturn" },
  { timeSeconds: 9576, name: "Uranus", fact: "An ice giant that rotates on its side, making its seasons last for 21 Earth years.", wikiQuery: "Uranus" },
  { timeSeconds: 14988, name: "Neptune", fact: "The windiest planet, with supersonic gales reaching up to 2,100 km/h.", wikiQuery: "Neptune" },
  { timeSeconds: 16560, name: "Pluto", fact: "The most famous dwarf planet, residing in the Kuiper Belt.", wikiQuery: "Pluto" },
  { timeSeconds: 81000, name: "Voyager 1", fact: "The farthest human-made object, wandering through interstellar space since 2012.", wikiQuery: "Voyager 1" },
  { timeSeconds: 129600, name: "The Heliosheath", fact: "The turbulent region where the solar wind crashes into the interstellar medium.", wikiQuery: "Heliosheath" },
  { timeSeconds: 259200, name: "The Heliopause", fact: "The absolute boundary of the Sun's magnetic influence. Welcome to interstellar space.", wikiQuery: "Heliopause" },
  { timeSeconds: 2592000, name: "The Inner Oort Cloud Begins", fact: "A vast, spherical shell of icy space debris, leftovers from the solar system's formation.", wikiQuery: "Oort_cloud" },
  { timeSeconds: 133804224, name: "Proxima Centauri", fact: "The absolute closest star to our solar system, a small red dwarf.", wikiQuery: "Proxima_Centauri" },
  { timeSeconds: 137906712, name: "Alpha Centauri A & B", fact: "Our neighboring binary star system, glowing brightly in the southern skies.", wikiQuery: "Alpha_Centauri" },
  { timeSeconds: 188083296, name: "Barnard's Star", fact: "A red dwarf with the highest known proper motion of any star.", wikiQuery: "Barnard's_Star" },
  { timeSeconds: 245518008, name: "Wolf 359", fact: "One of the faintest and lowest-mass stars known.", wikiQuery: "Wolf_359" },
  { timeSeconds: 270764208, name: "Sirius A & B", fact: "The brightest star in the night sky, known as the Dog Star.", wikiQuery: "Sirius" },
  { timeSeconds: 331985952, name: "Epsilon Eridani", fact: "A young star surrounded by massive debris disks and at least one exoplanet.", wikiQuery: "Epsilon_Eridani" },
  { timeSeconds: 375535440, name: "Tau Ceti", fact: "A sun-like star often featured in science fiction as a potential home for life.", wikiQuery: "Tau_Ceti" },
  { timeSeconds: 526701312, name: "Altair", fact: "A rapidly rotating star that is flattened at its poles due to its immense centrifugal force.", wikiQuery: "Altair" },
  { timeSeconds: 788940000, name: "Vega", fact: "One of the most intensely studied stars, it was the first star other than the Sun to be photographed.", wikiQuery: "Vega" },
  { timeSeconds: 1246525200, name: "TRAPPIST-1", fact: "An ultra-cool dwarf star hosting seven Earth-sized terrestrial planets.", wikiQuery: "TRAPPIST-1" },
  { timeSeconds: 1353821040, name: "Capella", fact: "A fascinating quadruple star system consisting of two bright yellow giants and two faint red dwarfs.", wikiQuery: "Capella" },
  { timeSeconds: 2051244000, name: "Aldebaran", fact: "The fiery red eye of the constellation Taurus, a giant star nearing the end of its life.", wikiQuery: "Aldebaran" },
  { timeSeconds: 2713953600, name: "Regulus", fact: "A blue-white main-sequence star spinning so fast it's almost tearing itself apart.", wikiQuery: "Regulus" }
];

const OORT_CLOUD_ADJECTIVES = [
  "silent", "frozen", "primordial", "ancient", "drifting", "solitary", "crystalline", "dark", "mysterious"
];
const OORT_CLOUD_NOUNS = [
  "cometary nucleus", "icy planetesimal", "dust cloud", "frozen fragment", "rocky shard", "stellar remnant"
];

function generateOortCloudFact(weekIndex) {
  const adj = OORT_CLOUD_ADJECTIVES[weekIndex % OORT_CLOUD_ADJECTIVES.length];
  const noun = OORT_CLOUD_NOUNS[(weekIndex * 3) % OORT_CLOUD_NOUNS.length];
  return `Passing by a ${adj} ${noun} in the vast emptiness of the Oort Cloud.`;
}

function formatDistance(km) {
  if (km > 1e12) {
    return (km / 1e12).toFixed(2) + " Trillion km";
  } else if (km > 1e9) {
    return (km / 1e9).toFixed(2) + " Billion km";
  } else if (km > 1e6) {
    return (km / 1e6).toFixed(2) + " Million km";
  } else {
    return Math.floor(km).toLocaleString() + " km";
  }
}

export function calculateJourney(dateOfDeathStr) {
  const deathDate = new Date(dateOfDeathStr);
  const now = new Date();
  const timeSeconds = Math.max(0, (now.getTime() - deathDate.getTime()) / 1000);

  const distanceKm = timeSeconds * SPEED_OF_LIGHT_KM_S;
  const distanceLy = distanceKm / KM_IN_LY;

  const passedMilestones = STATIC_MILESTONES.filter(m => m.timeSeconds <= timeSeconds)
    .sort((a, b) => b.timeSeconds - a.timeSeconds); // Most recent first

  let currentMilestone = passedMilestones[0] || STATIC_MILESTONES[0];
  let isDynamic = false;

  // The Oort Cloud Gap is between 1 month (2592000s) and 4.24 years (133804224s).
  if (timeSeconds > 2592000 && timeSeconds < 133804224) {
    const timeInOortCloud = timeSeconds - 2592000;
    const weekIndex = Math.floor(timeInOortCloud / (7 * 24 * 3600));
    
    if (weekIndex > 0) {
      isDynamic = true;
      currentMilestone = {
        timeSeconds: timeSeconds,
        name: `Deep Oort Cloud - Sector ${weekIndex}`,
        fact: generateOortCloudFact(weekIndex),
        wikiQuery: "Oort_cloud" // Fallback to Oort cloud info
      };
      
      passedMilestones.unshift(currentMilestone);
    }
  }

  const formatNumber = (num) => new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(num);

  return {
    timeSeconds,
    distanceKmStr: formatDistance(distanceKm),
    distanceLyStr: distanceLy < 0.01 ? null : formatNumber(distanceLy),
    distanceAuStr: distanceLy < 0.01 ? formatNumber(distanceKm / 149597870.7) : null,
    currentMilestone,
    passedMilestones,
    isDynamic
  };
}
