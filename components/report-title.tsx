import React from 'react';
import { Badge } from './ui/badge';

interface ReportTitleInterface {
  name: string;
  value: string;
}

const ReportTitle: React.FC<ReportTitleInterface> = ({ name, value }) => {
  return (
    <div className='p-1'>
      <Badge
        variant='outline'
        className='p-2 shadow-lg'
      >
        <div className='font-bold text-sm'>{name}:{'\u00A0'}</div>
        <div className='font-normal'>{value}</div>
      </Badge>
    </div>
  )
}

export default ReportTitle