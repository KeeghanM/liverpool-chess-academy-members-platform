'use client'

interface ResourceListProps {
  resources: {
    id: string | number
    fileName: string
    dateAdded: Date
    fileUrl: string
    author: string
  }[]
}

export function ResourceList({ resources }: ResourceListProps): JSX.Element {
  return (
    <>
      {resources.map((r) => (
        <div key={r.id}>
          <h2>{r.fileName}</h2>
        </div>
      ))}
    </>
  )
}