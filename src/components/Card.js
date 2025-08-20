import React from 'react';
import { Card as AntCard } from 'antd';

function Card({ title, children, ...props }) {
  return (
    <AntCard title={title} {...props}>
      {children}
    </AntCard>
  );
}

export default Card;