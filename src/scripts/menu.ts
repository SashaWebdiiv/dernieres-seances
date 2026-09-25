/** Menu mobile : bouton réel, `aria-expanded`, fermeture par Échap ou au choix d'un lien. */
export function initMenu(): () => void {
  const toggle = document.querySelector<HTMLButtonElement>("[data-menu-toggle]");
  const menu = document.querySelector<HTMLElement>("[data-menu]");
  if (!toggle || !menu) return () => {};

  const isOpen = () => toggle.getAttribute("aria-expanded") === "true";
  const setOpen = (open: boolean) => {
    toggle.setAttribute("aria-expanded", String(open));
    menu.toggleAttribute("data-open", open);
  };

  const onToggle = () => setOpen(!isOpen());
  const onKeydown = (event: KeyboardEvent) => {
    if (event.key !== "Escape" || !isOpen()) return;
    setOpen(false);
    toggle.focus();
  };
  const onMenuClick = (event: MouseEvent) => {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  };

  toggle.addEventListener("click", onToggle);
  document.addEventListener("keydown", onKeydown);
  menu.addEventListener("click", onMenuClick);

  return () => {
    toggle.removeEventListener("click", onToggle);
    document.removeEventListener("keydown", onKeydown);
    menu.removeEventListener("click", onMenuClick);
  };
}
