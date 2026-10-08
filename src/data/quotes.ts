export interface HealthQuote {
  quote: string;
  author: string;
  title: string;
  category: 'PREVENTION' | 'HEALING' | 'PUBLIC_HEALTH' | 'TECHNOLOGY';
}

export const HOSPITAL_QUOTES: HealthQuote[] = [
  {
    quote: "Wherever the art of medicine is loved, there is also a love of humanity.",
    author: "Hippocrates",
    title: "Father of Modern Medicine",
    category: 'HEALING'
  },
  {
    quote: "Predicting bed demand before saturation is not mere logistics; it is providing life support before the crisis arrives.",
    author: "Dr. Arvind Kasbekar",
    title: "Chief of Critical Care & Trauma Operations",
    category: 'PREVENTION'
  },
  {
    quote: "The very first requirement in a hospital is that it should do the sick no harm, and leave no patient without a bed.",
    author: "Florence Nightingale",
    title: "Pioneer of Modern Nursing",
    category: 'PUBLIC_HEALTH'
  },
  {
    quote: "Healthcare combined with artificial intelligence is humanity’s greatest shield against sudden epidemics.",
    author: "Dr. A.P.J. Abdul Kalam",
    title: "Scientist & Former President of India",
    category: 'TECHNOLOGY'
  },
  {
    quote: "Healthy citizens are the greatest asset any nation can ever have.",
    author: "National Health Mission",
    title: "Public Health Charter",
    category: 'PUBLIC_HEALTH'
  },
  {
    quote: "In an emergency, every minute saved in bed allocation translates directly into a life protected.",
    author: "Arogya AI Clinical Protocol",
    title: "Emergency Bed Coordination",
    category: 'PREVENTION'
  }
];
