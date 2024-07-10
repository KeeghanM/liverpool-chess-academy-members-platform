
import type { KeyTextField, SelectField } from '@prismicio/client'
import Link from 'next/link'

interface ResourceRowProps {
  name: KeyTextField
  uploadDate: Date
  type: SelectField<"Video" | "PGN" | "Article">
  tags: string[]
  slug: string
}
export function ResourceRow({
  name,
  uploadDate,
  type,
  tags,
  slug
}: ResourceRowProps): JSX.Element {
  return (
    <tr>
      <td><Link href={`/resources/${slug}`} className='link'>{name}</Link></td>
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
