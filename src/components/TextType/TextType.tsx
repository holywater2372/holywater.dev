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
  ...props
}: TextTypeProps & React.HTMLAttributes<HTMLElement>) => {
  const [displayedText, setDisplayedText] = useState('');
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
    if (showCursor && cursorRef.current && !finished) {
      gsap.set(cursorRef.current, { opacity: 1 });
      gsap.to(cursorRef.current, {
        opacity: 0,
        duration: cursorBlinkDuration,
        repeat: -1,
        yoyo: true,
        ease: 'power2.inOut'
      });
    } else if (finished && cursorRef.current) {
      gsap.to(cursorRef.current, { opacity: 1, duration: 0 });
    }
  }, [showCursor, cursorBlinkDuration, finished]);

  useEffect(() => {
    if (!isVisible || finished) return;

    let timeout: NodeJS.Timeout;
    const currentText = textArray[currentTextIndex];

    if (currentText && typeof currentText === 'string') {
      if (displayedText.length < currentText.length) {
        timeout = setTimeout(
          () => {
            setDisplayedText(currentText.slice(0, displayedText.length + 1));
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
          setDisplayedText('');
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
        setDisplayedText('');
      }, pauseDuration);
    }
    
    return () => clearTimeout(timeout);
  }, [
    displayedText,
    typingSpeed,
    pauseDuration,
    textArray,
    currentTextIndex,
    isVisible,
    variableSpeed,
    onSentenceComplete,
    finished
  ]);

  return createElement(
    Component,
    {
      ref: containerRef,
      className: `text-type ${className}`,
      ...props
    },
    completedText.map((line, index) => (
      <React.Fragment key={index}>
        {line}
        <br />
      </React.Fragment>
    )),
    <span className="text-type__content" style={{ color: getCurrentTextColor() }}>
      {displayedText}
    </span>,
    showCursor && !finished && (
      <span
        ref={cursorRef}
        className={`text-type__cursor ${cursorClassName}`}
      >
        {cursorCharacter}
      </span>
    )
  );
};

export default TextType;