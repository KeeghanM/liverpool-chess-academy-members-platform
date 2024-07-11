'use client'

import { useState } from 'react'
import Select from 'react-select'
import type { ResourceDocument } from '../../../prismicio-types'
import { ResourceRow } from './resource-row'

interface ResorceListProps {
  resources: ResourceDocument[]
  tags: string[]
}
export function ResourceList({
  resources,
  tags,
}: ResorceListProps): JSX.Element {
  const tagOptions = tags.map((t) => ({ value: t, label: t }))
  const typeOptions = [
    { value: 'Video', label: 'Video' },
    { value: 'PGN', label: 'PGN' },
    { value: 'Article', label: 'Article' },
  ]
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [nameSearch, setNameSearch] = useState<string>('')

  return (
    <div className='overflow-x-auto max-w-[100vw]'>
      <table className='table table-zebra'>
        <thead>
          <tr>
            <th>
              <input
                placeholder='Resource Name'
                className='input input-bordered h-full p-2 rounded'
                type='text'
                value={nameSearch}
                onChange={(e) => {
                  setNameSearch(e.target.value)
                }}
              />
            </th>
            <th>
              <Select
                placeholder='Type'
                isMulti
                name='type'
                options={typeOptions}
                onChange={(selections) => {
                  setSelectedTypes(selections.map((s) => s.value))
                }}
              />
            </th>
            <th>Uploaded Date</th>
            <th className='z-99'>
              <Select
                placeholder='Tags'
                isMulti
                name='tags'
                options={tagOptions}
                onChange={(selections) => {
                  setSelectedTags(selections.map((s) => s.value))
                }}
                className='basic-multi-select'
                classNamePrefix='select'
              />
            </th>
          </tr>
        </thead>
        <tbody>
          {resources
            .filter((r) => {
              if (selectedTags.length > 0) {
                for (const tag of r.tags) {
                  if (selectedTags.includes(tag)) return true
                }
              }
              if (selectedTypes.length > 0) {
                return selectedTypes.includes(r.data.type as string)
              }
              if (nameSearch.length > 0) {
                return r.data.title
                  ?.toString()
                  .toLowerCase()
                  .includes(nameSearch.toLowerCase())
              }

              return (
                selectedTypes.length === 0 &&
                selectedTags.length === 0 &&
                nameSearch.length === 0
              )
            })
            .map((resource) => (
              <ResourceRow
                key={resource.uid}
                name={resource.data.title}
                uploadDate={new Date(resource.first_publication_date)}
                type={resource.data.type}
                tags={resource.tags}
                slug={resource.uid}
              />
            ))}
        </tbody>
      </table>
    </div>
  )
}
