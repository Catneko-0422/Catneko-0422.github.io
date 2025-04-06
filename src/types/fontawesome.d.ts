declare module '@fortawesome/react-fontawesome' {
  import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
  import { ComponentType } from 'react';

  interface FontAwesomeIconProps {
    icon: IconDefinition;
    className?: string;
  }

  export const FontAwesomeIcon: ComponentType<FontAwesomeIconProps>;
} 