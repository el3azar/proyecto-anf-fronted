import React from 'react';
import { IMaskInput } from 'react-imask';

// Este es un componente "forwardRef" que permite a react-hook-form controlarlo
export const MaskedInput = React.forwardRef((props, ref) => {
  const { onChange, name, ...otherProps } = props;
  return (
    <IMaskInput
      {...otherProps}
      inputRef={ref}
      onAccept={(value) => onChange({ target: { name, value } })}
      overwrite
    />
  );
});