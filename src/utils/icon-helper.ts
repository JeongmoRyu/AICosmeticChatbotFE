import { createElement } from 'react';
import * as Icons from 'lucide-react';

interface MaumIconsProps {
  icon: any;
  className?: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  title?: string;
}

function MaumIcons(props: MaumIconsProps) {
  try {
    const { icon, className, title, ...computedProps } = props;
    if (Icons[icon] !== undefined) {
      return createElement(Icons[icon], {
        ...computedProps,
        className: `maum-icons ${className}`,
        title: title,
      });
    } else {
      console.log('Error');
      throw icon;
    }
  } catch (err) {
    throw `icon '${props.icon}' not found.`;
  }
}

export default MaumIcons;
