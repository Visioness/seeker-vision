import './Legend.css';
import { memo } from 'react';

const Legend = memo(function Legend() {
  console.log('Legend');
  return <div className='legend p-2'>Here are the colors.</div>;
});

export default Legend;
