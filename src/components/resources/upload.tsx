'use client'

import { useState } from 'react'
import { UploadButton } from '@/utils/uploadthing'

type UploadTypes = 'pgn' | 'article' | 'video'
export function UploadResource(): JSX.Element {
  const [type, setType] = useState<UploadTypes>('video')

  return (<div className='flex flex-col gap-0'>
        <h2>Add a new resource:</h2>
    <div className='flex gap-2 items-center text-small'>
      <select
        className='select select-bordered'
        value={type}
        onChange={(e) => {
          setType(e.target.value as UploadTypes)
        }}
      >
        <option value='video'>Video</option>
        <option disabled value='pgn'>
          PGN - Coming Soon
        </option>
        <option disabled value='article'>
          Article - Coming Soon
        </option>
      </select>
      {type === 'video' ? <UploadButton endpoint='videoUploader' className='ut-button:bg-accent ut-button:rounded-none' /> : null}
    </div></div>
  )
}
