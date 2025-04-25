'use client'

import { Button } from '@/components/ui/button';
import React, { useState } from 'react'

const Page = () => {

  const [item, setItem] = useState([]);

  return (
    <div>
      <div>
        {item.map((item, index) => {
          return (
            <div key={index}>
              {item}
            </div>
          )
        }
        )}
      </div>
      <div>
        <Button
          onClick={() => {
            //@ts-ignore
            setItem([...item, item.length + 1]);
            console.log(item)
          }}
        >
          Add new item
        </Button>
      </div>
    </div>
  )
}

export default Page