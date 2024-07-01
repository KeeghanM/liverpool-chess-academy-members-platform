export function Grid({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      id="gridDisplay"
      className="grid gap-0 max-w-screen-lg mx-auto shadow-xl mt-4 md:mt-6 lg:mt-8 grid-cols-1 lg:grid-cols-2"
    >
      {children}
    </div>
  )
}
