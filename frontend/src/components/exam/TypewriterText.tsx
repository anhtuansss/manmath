'use client';

import { useState, useEffect } from 'react';

type TypewriterTextProps = {
  text: string;
  className?: string;
  as?: React.ElementType;
};

export function TypewriterText({ text, className = '', as: Component = 'span' }: TypewriterTextProps) {
  const [charsToShow, setCharsToShow] = useState(0);
  const chars = Array.from(text);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setCharsToShow(chars.length);
      return;
    }

    let i = 0;
    const intervalId = setInterval(() => {
      i++;
      setCharsToShow(i);
      if (i >= chars.length) {
        clearInterval(intervalId);
      }
    }, 45); // 45ms per char

    return () => clearInterval(intervalId);
  }, [chars.length]);

  const isComplete = charsToShow >= chars.length;
  const typed = chars.slice(0, charsToShow).join('');
  const untyped = chars.slice(charsToShow).join('');

  return (
    <Component className={className} aria-label={text}>
      <span aria-hidden="true">
        <span>{typed}</span>
        {!isComplete && (
          <span 
            className="inline-block w-[3px] bg-primary animate-pulse" 
            style={{ 
              height: '1.1em',
              verticalAlign: 'middle',
              marginTop: '-0.1em',
              marginLeft: '2px',
              marginRight: '-5px'
            }} 
          />
        )}
        <span className="opacity-0">{untyped}</span>
      </span>
    </Component>
  );
}
