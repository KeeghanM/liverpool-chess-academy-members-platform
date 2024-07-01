export function Tile({
  title,
  children,
  url,
}: {
  title: string
  url: string
  children: React.ReactNode
}) {
  return (
    <div className="p-6 md:p12 w-full h-full flex flex-col items-center justify-center">
      {title && (
        <h2 className={'text-2xl md:text-4xl font-bold mb-auto h-fit'}>
          {url ? (
            <a
              className="hover:text-red-600 cursor-pointer"
              href={url}
            >
              {title}
            </a>
          ) : (
            title
          )}
        </h2>
      )}
      <div className="text-lg my-auto">{children}</div>
    </div>
  )
}
