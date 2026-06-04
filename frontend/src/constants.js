export const ISLANDS = [
  { id: 'naxos', name: 'Naxos', subtitle: 'Hikes & Culture', emoji: '⛰️', region: 'Cyclades' },
  { id: 'santorini', name: 'Santorini', subtitle: 'Caldera & Sunsets', emoji: '🌅', region: 'Cyclades' },
  { id: 'milos', name: 'Milos', subtitle: 'Volcanic Beaches', emoji: '🏖️', region: 'Cyclades' },
  { id: 'amorgos', name: 'Amorgos', subtitle: 'Deep Blue & Ridges', emoji: '⛵', region: 'Cyclades' }
];

export const TRIP_STYLES = [
  { id: 'adventure', label: 'Adventure', icon: '🥾', desc: 'Trekking, caves, cliffs and panoramic viewpoints.' },
  { id: 'relax', label: 'Relax & Chill', icon: '🍹', desc: 'Hidden beaches, premium dining, and sunsets.' }
];

export const DURATIONS = [3, 5, 7, 10];

// Rich data fallback from Perplexity
export const MOCK_ITINERARIES = {
  naxos: {
    destination: 'Naxos',
    style: 'Adventure',
    days: 1,
    itinerary: {
      day_1: [
        { id: 101, time: 'Morning', title: 'Mount Zas Summit Hike', desc: 'Challenging trek up Mount Zas (1,003m). Panoramic 360° views of the Cyclades, perfect for scenic photography.' },
        { id: 102, time: 'Afternoon', title: 'Zas Cave Exploration', desc: 'Cool off inside the historic karst cave. Marvel at stalactites and enjoy a rugged macro photography environment.' },
        { id: 103, time: 'Evening', title: 'Descent to Ano Potamia', desc: 'Hike through old stone agricultural terraces in golden-hour light. End with fresh local kitron juice in the village square.' }
      ]
    }
  },
  santorini: {
    destination: 'Santorini',
    style: 'Adventure',
    days: 1,
    itinerary: {
      day_1: [
        { id: 301, time: 'Morning', title: 'Fira to Oia Caldera Trail', desc: 'Classic 10km hike on volcanic rock. Pass Skaros Rock for dramatic leading lines and unforgettable blue-dome photos.' },
        { id: 302, time: 'Afternoon', title: 'Profitis Ilias Summit Climb', desc: 'Ascend the island’s highest peak (567m) for a full view of traditional vineyards and Aegean horizons.' },
        { id: 303, time: 'Evening', title: 'Akrotiri Volcanic Formations', desc: 'Trek through black and red lava cliffs near the lighthouse as sunset brings out deep, glowing stratifications.' }
      ]
    }
  }
};

export const FALLBACK_ITINERARY = (name) => ({
  destination: name,
  style: 'Custom',
  days: 3,
  itinerary: {
    day_1: [{ id: 'f1', time: 'Morning', title: 'Explore Main Town', desc: `Discover hidden paths and local architecture in ${name}.` }]
  }
});