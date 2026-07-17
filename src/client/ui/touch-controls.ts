export type TouchControl = 'left' | 'right' | 'jump';

export function bindTouchControls(
  root: HTMLElement,
  onChange: (control: TouchControl, active: boolean) => void,
): () => void {
  const cleanups: Array<() => void> = [];
  root.querySelectorAll<HTMLButtonElement>('[data-touch-control]').forEach((button) => {
    const control = button.dataset.touchControl as TouchControl;
    const press = (event: Event) => { event.preventDefault(); onChange(control, true); };
    const release = (event: Event) => { event.preventDefault(); onChange(control, false); };
    button.addEventListener('pointerdown', press);
    button.addEventListener('pointerup', release);
    button.addEventListener('pointercancel', release);
    button.addEventListener('pointerleave', release);
    cleanups.push(() => {
      button.removeEventListener('pointerdown', press);
      button.removeEventListener('pointerup', release);
      button.removeEventListener('pointercancel', release);
      button.removeEventListener('pointerleave', release);
    });
  });
  return () => cleanups.forEach((cleanup) => cleanup());
}
