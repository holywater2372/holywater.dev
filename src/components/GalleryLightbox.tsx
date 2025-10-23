import * as React from 'react'

interface GalleryLightboxProps {
  selector?: string
}

const GalleryLightbox: React.FC<GalleryLightboxProps> = ({
  selector = '.masonry-item img',
}) => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [shouldRender, setShouldRender] = React.useState(true)
  const [fadeIn, setFadeIn] = React.useState(false)

  React.useEffect(() => {
    // Trigger fade in after mount
    requestAnimationFrame(() => {
      setFadeIn(true)
    })
    const imageEls = Array.from(
      document.querySelectorAll<HTMLImageElement>(selector),
    )
    const images = imageEls.map((img) => img.src)

    // Wait for all images to load
    const imageLoadPromises = imageEls.map((img) => {
      if (img.complete) {
        return Promise.resolve()
      }
      return new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve())
        img.addEventListener('error', () => resolve()) // Still resolve on error to not block
      })
    })

    Promise.all(imageLoadPromises).then(() => {
      // Give the masonry grid a moment to settle
      setTimeout(() => {
        setIsLoading(false)
        // Wait for fade out animation before unmounting
        setTimeout(() => {
          setShouldRender(false)
        }, 300)
      }, 300)
    })

    const lightbox = document.getElementById(
      'lightbox',
    ) as HTMLDivElement | null
    const lightboxImage = document.getElementById(
      'lightbox-image',
    ) as HTMLImageElement | null
    const currentIndexEl = document.getElementById(
      'current-index',
    ) as HTMLSpanElement | null
    const totalImagesEl = document.getElementById(
      'total-images',
    ) as HTMLSpanElement | null
    const closeBtn =
      document.querySelector<HTMLButtonElement>('.lightbox-close')
    const prevBtn = document.querySelector<HTMLButtonElement>('.lightbox-prev')
    const nextBtn = document.querySelector<HTMLButtonElement>('.lightbox-next')
    const backdrop =
      document.querySelector<HTMLDivElement>('.lightbox-backdrop')

    if (
      !lightbox ||
      !lightboxImage ||
      !currentIndexEl ||
      !totalImagesEl ||
      !closeBtn ||
      !prevBtn ||
      !nextBtn ||
      !backdrop
    ) {
      return
    }

    let currentImageIndex = 0

    const lb = lightbox as HTMLDivElement
    const lbImg = lightboxImage as HTMLImageElement
    const curIdx = currentIndexEl as HTMLSpanElement
    const totalEl = totalImagesEl as HTMLSpanElement

    totalEl.textContent = images.length.toString()

    function openLightbox(index: number) {
      currentImageIndex = index
      lbImg.src = images[currentImageIndex]
      curIdx.textContent = (currentImageIndex + 1).toString()
      lb.classList.add('active')
      document.documentElement.classList.add('no-scroll')
    }

    function closeLightbox() {
      lb.classList.remove('active')
      document.documentElement.classList.remove('no-scroll')
    }

    function prevImage() {
      currentImageIndex =
        currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1
      lbImg.src = images[currentImageIndex]
      curIdx.textContent = (currentImageIndex + 1).toString()
    }

    function nextImage() {
      currentImageIndex =
        currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1
      lbImg.src = images[currentImageIndex]
      curIdx.textContent = (currentImageIndex + 1).toString()
    }

    const containerItems = Array.from(
      document.querySelectorAll<HTMLDivElement>('.masonry-item'),
    )
    const clickHandlers: Array<() => void> = []
    containerItems.forEach((item, index) => {
      const handler = () => openLightbox(index)
      clickHandlers.push(handler)
      item.addEventListener('click', handler)
    })

    const onClose = () => closeLightbox()
    const onPrev = () => prevImage()
    const onNext = () => nextImage()
    const onBackdrop = () => closeLightbox()

    closeBtn.addEventListener('click', onClose)
    backdrop.addEventListener('click', onBackdrop)
    prevBtn.addEventListener('click', onPrev)
    nextBtn.addEventListener('click', onNext)

    lbImg.addEventListener('click', (e) => e.stopPropagation())
    backdrop.addEventListener('touchend', onBackdrop)

    const imageContainer = document.querySelector('.lightbox-image-container')
    imageContainer?.addEventListener('click', (e) => e.stopPropagation())
    imageContainer?.addEventListener('touchend', (e) => e.stopPropagation())

    const prevHandler = (window as any).__galleryKeydownHandler as
      | ((e: KeyboardEvent) => void)
      | undefined
    if (prevHandler) {
      document.removeEventListener('keydown', prevHandler)
    }

    const keydownHandler = (e: KeyboardEvent) => {
      if (!lb.classList.contains('active')) return
      switch (e.key) {
        case 'Escape':
          closeLightbox()
          break
        case 'ArrowLeft':
          prevImage()
          break
        case 'ArrowRight':
          nextImage()
          break
      }
    }
    ;(window as any).__galleryKeydownHandler = keydownHandler
    document.addEventListener('keydown', keydownHandler)

    return () => {
      containerItems.forEach((item, idx) => {
        const handler = clickHandlers[idx]
        if (handler) item.removeEventListener('click', handler)
      })
      closeBtn.removeEventListener('click', onClose)
      backdrop.removeEventListener('click', onBackdrop)
      prevBtn.removeEventListener('click', onPrev)
      nextBtn.removeEventListener('click', onNext)
      document.removeEventListener('keydown', keydownHandler)
    }
  }, [selector])

  if (!shouldRender) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        opacity: fadeIn && isLoading ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          display: 'flex',
          gap: '12px',
        }}
      >
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '0s',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '0.2s',
          }}
        />
        <div
          style={{
            width: '16px',
            height: '16px',
            borderRadius: '50%',
            backgroundColor: '#ffffff',
            animation: 'bounce 1.4s infinite ease-in-out both',
            animationDelay: '0.4s',
          }}
        />
      </div>
      <p
        style={{
          marginTop: '24px',
          fontSize: '16px',
          color: '#ffffff',
          fontFamily: 'Geist, system-ui, -apple-system, sans-serif',
          textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)',
        }}
      >
      Loading...
      </p>
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { 
            transform: scale(0);
            opacity: 0.5;
          }
          40% { 
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  )
}

export default GalleryLightbox