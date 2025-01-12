export const createMarkerElement = (): HTMLDivElement => {
  const el = document.createElement('div');
  el.className = 'w-6 h-6 bg-primary rounded-full border-2 border-white shadow-lg';
  return el;
};