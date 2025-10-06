import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

const DescriptionTooltip: React.FC<{ description: string }> = ({ description }) => (
  <Tooltip title={description} arrow>
    <InfoOutlinedIcon fontSize="small" color="action" style={{ marginLeft: 4, verticalAlign: 'middle' }} />
  </Tooltip>
);

export default DescriptionTooltip;
