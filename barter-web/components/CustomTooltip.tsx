'use client';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type CustomTooltipProps = {
  id: string;
  content: string;
};

export const CustomTooltip = ({ id, content }: CustomTooltipProps) => (
  <Tooltip
    id={id}
    place="top"
    content={content}
    className="text-sm bg-[#00262b] text-white px-2 py-1 rounded shadow-md z-50"
  />
);
