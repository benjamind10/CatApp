import React from 'react';
import { Button } from 'reactstrap';

const CustomButton = ({ color, onClick, children }) => {
  return (
    <Button color={color} onClick={onClick}>
      {children}
    </Button>
  );
};

export default CustomButton;
