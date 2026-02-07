export function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="alert alert-error" role="alert">
      <strong>Erro:</strong> {message}
    </div>
  )
}
