import { useEffect, useState } from 'react';
import { DEMO } from '../config';
import { navigate } from '../flow/navigate';
import { type Step, useMission } from '../state/store';
import { STOP_ORDER } from '../stops/catalog';
import './demo.css';

const JUMPS: { label: string; step: Step }[] = [
  { label: 'Llegada', step: { screen: 'arrival' } },
  { label: 'Reclutamiento', step: { screen: 'recruitment' } },
  { label: 'Mapa', step: { screen: 'map' } },
  ...STOP_ORDER.map((stop) => ({ label: stop, step: { screen: 'stop', stop } as Step })),
  { label: 'Final', step: { screen: 'final' } },
];

const HIDE_KEY = 'h';

function jump(step: Step) {
  const mission = useMission.getState();
  if (!mission.era) mission.chooseEra('connery');
  if (!mission.gadget) mission.chooseGadget('laser');
  if (!mission.startedAt) mission.acceptMission();
  navigate(step);
}

export function DemoPanel() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const reset = useMission((state) => state.reset);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== HIDE_KEY || event.target instanceof HTMLInputElement) return;
      setHidden((value) => !value);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!DEMO || hidden) return null;
  return (
    <div className="demo-panel">
      <button type="button" className="demo-panel__chip" aria-expanded={open} onClick={() => setOpen(!open)}>
        DEMO
      </button>
      {open && (
        <nav className="demo-panel__menu" aria-label="Demo">
          {JUMPS.map((entry) => (
            <button
              key={entry.label}
              type="button"
              onClick={() => {
                setOpen(false);
                jump(entry.step);
              }}
            >
              {entry.label}
            </button>
          ))}
          <button type="button" onClick={() => reset()}>
            Reiniciar
          </button>
          <span className="demo-panel__hint">Tecla H: ocultar / mostrar</span>
        </nav>
      )}
    </div>
  );
}
