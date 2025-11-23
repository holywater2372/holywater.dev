'use client';

import React, { useEffect, useRef, useState, createElement, useMemo, useCallback } from 'react';
import type { ElementType, ReactNode } from 'react';
import { gsap } from 'gsap';
import './TextType.css';

interface TextTypeProps {
  className?: string;
  showCursor?: boolean;
  cursorCharacter?: string | ReactNode;
  cursorBlinkDuration?: number;
  cursorClassName?: string;
  text: ReactNode[];
  as?: ElementType;
  typingSpeed?: number;
  initialDelay?: number;
  pauseDuration?: number;
  loop?: boolean;
  textColors?: string[];
  variableSpeed?: { min: number; max: number };
  onSentenceComplete?: (sentence: ReactNode, index: number) => void;
  startOnVisible?: boolean;
  dimmedOpacity?: number;
}

const TextType = ({
  text,
  as: Component = 'div',
  typingSpeed = 75,
  initialDelay = 0,
  pauseDuration = 1500,
  loop = false,
  className = '',
  showCursor = true,
  cursorCharacter = '|',
  cursorClassName = '',
  cursorBlinkDuration = 0.5,
  textColors = [],
  variableSpeed,
  onSentenceComplete,
  startOnVisible = false,
  dimmedOpacity = 0.3,
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const [typedLength, setTypedLength] = useState(0);
  const [currentTextIndex, setCurrentTextIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(!startOnVisible);
  const [finished, setFinished] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const [completedText, setCompletedText] = useState<ReactNode[]>([]);

  const textArray = useMemo(() => (Array.isArray(text) ? text : [text]), [text]);

  const getRandomSpeed = useCallback(() => {
    if (!variableSpeed) return typingSpeed;
    const { min, max } = variableSpeed;
    return Math.random() * (max - min) + min;
  }, [variableSpeed, typingSpeed]);

  const getCurrentTextColor = () => {
    if (textColors.length === 0) return 'inherit';
    return textColors[currentTextIndex % textColors.length];
  };

  useEffect(() => {
    if (!startOnVisible || !containerRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [startOnVisible]);

  useEffect(() => {
    if (showCursor && cursorRef.current) {
      if (finished) {
        gsap.to(cursorRef.current, { opacity: 1, duration: 0 });
      } else {
        gsap.set(cursorRef.current, { opacity: 1 });
        gsap.to(cursorRef.current, {
          opacity: 0,
          duration: cursorBlinkDuration,
          repeat: -1,
          yoyo: true,
          ease: 'power2.inOut'
        });
      }
    }
  }, [showCursor, cursorBlinkDuration, finished]);

  useEffect(() => {
    if (!isVisible || finished) return;

    let timeout: NodeJS.Timeout;
    const currentText = textArray[currentTextIndex];

    if (currentText && typeof currentText === 'string') {
      if (typedLength < currentText.length) {
        timeout = setTimeout(
          () => {
            setTypedLength(typedLength + 1);
          },
          variableSpeed ? getRandomSpeed() : typingSpeed
        );
      } else {
        if (onSentenceComplete) {
          onSentenceComplete(currentText, currentTextIndex);
        }

        const nextIndex = currentTextIndex + 1;

        if (nextIndex >= textArray.length) {
          setFinished(true);
          return;
        }

        timeout = setTimeout(() => {
          setCompletedText(prev => [...prev, currentText]);
          setCurrentTextIndex(nextIndex);
          setTypedLength(0);
        }, pauseDuration);
      }
    } else {
      if (onSentenceComplete) {
        onSentenceComplete(currentText, currentTextIndex);
      }
      
      const nextIndex = currentTextIndex + 1;

      if (nextIndex >= textArray.length) {
        setFinished(true);
        return;
      }

      timeout = setTimeout(() => {
        setCompletedText(prev => [...prev, currentText]);
        setCurrentTextIndex(nextIndex);
        setTypedLength(0);
      }, pauseDuration);
    }
    
    return () => clearTimeout(timeout);
  }, [
    typedLength,
    typingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    isVisible,
    variableSpeed,
    onSentenceComplete,
    finished,
    getRandomSpeed
  ]);

  // Render the current text with opacity effect
  const renderCurrentText = () => {
    const currentText = textArray[currentTextIndex];
    
    if (typeof currentText === 'string') {
      return (
        <span className="text-type__content" style={{ color: getCurrentTextColor() }}>
          {currentText.split('').map((char, index) => (
            <span
              key={index}
              style={{
                opacity: index < typedLength ? 1 : dimmedOpacity,
                transition: 'opacity 0.1s ease'
              }}
            >
              {char}
            </span>
          ))}
        </span>
      );
    }
    
    return currentText;
  };

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    <>
      {completedText.map((line, index) => (
        <React.Fragment key={index}>
          {line}
          <br />
        </React.Fragment>
      ))}
      {renderCurrentText()}
      {/* Single cursor element that always renders at the end */}
      {showCursor && (
        <span
          ref={cursorRef}
          className={`text-type__cursor ${cursorClassName}`}
        >
          {cursorCharacter}
        </span>
      )}
    </>
  );
};

export default TextType;