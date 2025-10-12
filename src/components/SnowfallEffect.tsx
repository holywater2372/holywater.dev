import { useEffect, useState } from 'react'
import Snowfall from 'react-snowfall'

export function SnowfallEffect() {
  const [snowColor, setSnowColor] = useState('#ffffff')

  useEffect(() => {
    const updateColor = () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
      setSnowColor(isDark ? '#fff' : '#ffffff')
    }

    updateColor()
    
    const observer = new MutationObserver(updateColor)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    return () => observer.disconnect()
  }, [])

  return (
    <Snowfall
      color={snowColor}
      changeFrequency={100}
      radius={[0.5, 3.0]}
      speed={[1.0, 3.0]}
      wind={[-0.5, 2.0]}
      snowflakeCount={150}
      rotationSpeed={[-1.0, 1.0]}
      opacity={[0.6, 1]}
      style={{
    position: 'fixed',
    width: '100vw',
    height: '100vh',
    }}
    />
  )
}