export function Loading({ text = "Carregando..." }: { text?: string }) {
  return <div className="muted">{text}</div>
}
