import React, { useEffect, useState } from 'react';

interface DynamicKeyDisplayProps {
  userPrompt: string;
  requiredKeys: string[];
  valueCheck?: (mode: string, value: boolean) => void;
  mode: string;
}

const DynamicKeyDisplay: React.FC<DynamicKeyDisplayProps> = ({ userPrompt, requiredKeys, valueCheck, mode }) => {
  const [updatedKeys, setUpdatedKeys] = useState<{ key: string, colorClass: string }[]>([]);

  useEffect(() => {
    const usingData = ['client_info', ...requiredKeys];
    const keyCounts: Record<string, number> = {};

    usingData.forEach((key) => {
      const regex = new RegExp(`\\{${key}\\}`, 'g');
      let match;
      while ((match = regex.exec(userPrompt)) !== null) {
        keyCounts[key] = (keyCounts[key] || 0) + 1;
      }
    });

    const tempKeys: { key: string, colorClass: string }[] = usingData.map((key) => {
      const count = keyCounts[key] || 0;
      let colorClass = 'text-[#9b9d9e]'; 

      if (count > 1) {
        colorClass = 'text-[#fe4336]'; 
      } else if (count === 1) {
        if (key === 'client_info') {
          colorClass = 'text-[#4262ff]';
        } else if (requiredKeys.includes(key)) {
          colorClass = 'text-[#4262ff]';
        }
      } else if (requiredKeys.includes(key)) {
        colorClass = 'text-[#fe4336]';
      }

      return { key, colorClass };
    });

    const regex = /\{([^}]+)\}/g;
    let match;
    while ((match = regex.exec(userPrompt)) !== null) {
      const content = match[1];
      if (!usingData.includes(content)) {
        tempKeys.push({
          key: content.length > 10 ? `${content.substring(0, 10)}...` : content, 
          colorClass: 'text-[#fe4336]',
        });
      }
    }

    setUpdatedKeys(tempKeys); 
    
    if (valueCheck) {
      const hasRed = updatedKeys.some(({ colorClass }) => colorClass === 'text-[#fe4336]');
      valueCheck(mode, !hasRed);
    }
  }, [userPrompt, requiredKeys, valueCheck]);


  return (
    <div className='essential-check'>
      {updatedKeys.map(({ key, colorClass }) => (
        <div key={key} className={`${colorClass}`}>
          {key}
        </div>
      ))}
    </div>
  );
};

export default DynamicKeyDisplay;