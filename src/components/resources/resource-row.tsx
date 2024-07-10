
import type { KeyTextField, SelectField } from '@prismicio/client'

interface ResourceRowProps {
  name: KeyTextField
  uploadDate: Date
  type: SelectField<"Video" | "PGN" | "Article">
  tags: string[]
}
export function ResourceRow({
  name,
  uploadDate,
  type,
  tags,
}: ResourceRowProps): JSX.Element {
  return (
    <tr>
      <td>{name}</td>
      <td>{type}</td>
      <td>{uploadDate.toLocaleDateString('en-GB')}</td>
      <td>
        <div className="flex flex-wrap gap-1">
        {tags.map((tag) => (
          <span className="badge"
            key={`${name?.toString()??"resource"}-${tag}`}
            >{tag}</span>
        ))}</div>
      </td>
    </tr>
  )
}
