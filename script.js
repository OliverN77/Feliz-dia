document.addEventListener("DOMContentLoaded", () => {
  // ========== VARIABLES GLOBALES ==========
  const envelope = document.getElementById("envelope")
  const backFlap = document.getElementById("back-flap")
  const letter = document.getElementById("letter")
  const envelopeSection = document.getElementById("envelope-section")
  const scrollIndicator = document.querySelector(".scroll-indicator")
  const modalOverlay = document.getElementById("modal-overlay")
  const closeButton = document.getElementById("close-button")
  
  let envelopeOpened = false
  let letterShown = false
  let lastScrollY = window.scrollY
  let ticking = false

  // ========== FUNCIONES DE CONFETI ==========
  function createConfetti() {
    const confettiContainer = document.getElementById("confetti-container")
    if (!confettiContainer) return
    
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe", "#fd79a8"]

    function addConfetti() {
      const confetti = document.createElement("div")
      confetti.className = "confetti"
      confetti.style.left = Math.random() * 100 + "%"
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
      confetti.style.animationDelay = Math.random() * 3 + "s"
      confettiContainer.appendChild(confetti)

      setTimeout(() => confetti.remove(), 4000)
    }

    // Crear confeti inicial
    for (let i = 0; i < 50; i++) {
      setTimeout(addConfetti, i * 100)
    }

    // Continuar creando confeti
    setInterval(addConfetti, 300)
  }

  function createBirthdayConfetti() {
    const confettiContainer = document.getElementById("confetti-container")
    if (!confettiContainer) return
    
    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe", "#fd79a8"]

    for (let i = 0; i < 100; i++) {
      setTimeout(() => {
        const confetti = document.createElement("div")
        confetti.className = "confetti"
        confetti.style.left = Math.random() * 100 + "%"
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)]
        confetti.style.width = Math.random() * 10 + 5 + "px"
        confetti.style.height = confetti.style.width
        confetti.style.borderRadius = "50%"
        confettiContainer.appendChild(confetti)

        setTimeout(() => confetti.remove(), 4000)
      }, i * 50)
    }
  }

  // ========== FUNCIONES DEL MODAL ==========
  function showLetter() {
    if (!letterShown) {
      letterShown = true
      modalOverlay.classList.add("show")
      letter.classList.add("show")
      createBirthdayConfetti()
      playBirthdaySound()
    }
  }

  function hideLetter() {
    if (letterShown) {
      letterShown = false
      modalOverlay.classList.remove("show")
      letter.classList.remove("show")
    }
  }

  function playBirthdaySound() {
    const audio = document.getElementById("birthday-audio")
    if (audio) {
      audio.volume = 0.3
      audio.play().catch(() => {
        console.log("No se pudo reproducir el audio automáticamente")
      })
    }
  }

  // ========== ANIMACIONES DEL HEADER ==========
  function setupHeaderLifeGallery() {
    const headerStageItems = document.querySelectorAll('.header-stage-item')
    
    headerStageItems.forEach((item, index) => {
      const img = item.querySelector('img')
      const stageName = img.alt
      
      const stageInfo = {
        'Infancia': {
          title: 'Infancia 👶',
          description: 'Los primeros pasos, las primeras palabras, la curiosidad infinita y la alegría pura de descubrir el mundo.'
        },
        'Juventud': {
          title: 'Juventud 🧑',
          description: 'Sueños grandes, aventuras emocionantes, la pasión por la vida y la búsqueda de nuestra identidad.'
        },
        'Adultez': {
          title: 'Adultez 👨‍💼',
          description: 'Logros importantes, responsabilidades, construyendo el futuro y dejando nuestra huella en el mundo.'
        },
        'Sabiduría': {
          title: 'Sabiduría 👴',
          description: 'Experiencia acumulada, serenidad, compartiendo conocimiento y disfrutando los frutos de la vida.'
        }
      }
      
      // Expandir imagen al hacer clic
      item.addEventListener('click', () => {
        expandHeaderImage(img, stageInfo[stageName])
      })
      
      // Efecto 3D en hover
      item.addEventListener('mousemove', (e) => {
        const rect = item.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const centerX = rect.width / 2
        const centerY = rect.height / 2
        const rotateY = (x - centerX) / 10
        const rotateX = (centerY - y) / 10
        
        const stageImage = item.querySelector('.header-stage-image')
        stageImage.style.transform = `scale(1.1) translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`
      })
      
      item.addEventListener('mouseleave', () => {
        const stageImage = item.querySelector('.header-stage-image')
        stageImage.style.transform = 'scale(1) translateY(0) rotateX(0deg) rotateY(0deg)'
      })
    })
  }

  function expandHeaderImage(img, info) {
    const imageModal = document.createElement('div')
    imageModal.className = 'header-image-modal'
    
    imageModal.innerHTML = `
      <div class="header-modal-content">
        <img src="${img.src}" alt="${img.alt}" class="header-modal-image">
        <div class="header-modal-info">
          <h3>${info.title}</h3>
          <p>${info.description}</p>
        </div>
      </div>
      <div class="header-modal-close">&times;</div>
    `
    
    document.body.appendChild(imageModal)
    setTimeout(() => imageModal.classList.add('show'), 10)
    
    const closeModal = () => {
      imageModal.classList.remove('show')
      setTimeout(() => document.body.removeChild(imageModal), 400)
    }
    
    imageModal.querySelector('.header-modal-close').addEventListener('click', closeModal)
    imageModal.addEventListener('click', (e) => {
      if (e.target === imageModal) closeModal()
    })
    
    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        closeModal()
        document.removeEventListener('keydown', escapeHandler)
      }
    }
    document.addEventListener('keydown', escapeHandler)
  }

  // ========== ANIMACIONES PRINCIPALES ==========
  function getSectionScrollProgress(section, ratio = 0.7) {
    const rect = section.getBoundingClientRect()
    const sectionTop = window.scrollY + rect.top
    const sectionHeight = rect.height
    const scrollPosition = window.scrollY - sectionTop
    const animationDistance = sectionHeight * ratio
    return Math.min(Math.max(scrollPosition / animationDistance, 0), 1)
  }

  // Función mejorada para mostrar/ocultar las imágenes de etapas durante el scroll
  function updateLifeStagesScroll(progress) {
    const lifeStagesContainer = document.getElementById('life-stages-scroll')
    const stageItems = document.querySelectorAll('.life-stage-item')
    
    if (!lifeStagesContainer || !stageItems.length) return

    if (progress > 0.1 && progress < 0.6) {
      lifeStagesContainer.classList.remove('hide-stages')
      
      // Mostrar etapas progresivamente con mejor timing
      const stages = [
        { threshold: 0.15, element: stageItems[0], label: '👶 Infancia' },
        { threshold: 0.25, element: stageItems[1], label: '🧑 Juventud' },
        { threshold: 0.35, element: stageItems[2], label: '👨‍💼 Adultez' },
        { threshold: 0.45, element: stageItems[3], label: '🌟 Sabiduría' }
      ]
      
      stages.forEach((stage, index) => {
        if (progress > stage.threshold) {
          if (!stage.element.classList.contains('show')) {
            stage.element.classList.add('show')
            
            // Agregar contenido dinámico al label si está vacío
            const stageLabel = stage.element.querySelector('.stage-label')
            if (!stageLabel.innerHTML.trim()) {
              stageLabel.innerHTML = `
                <span class="stage-emoji">${stage.label.split(' ')[0]}</span>
                <span class="stage-text">${stage.label.split(' ')[1]}</span>
              `
            }
          }
        }
      })
      
      // Efecto de flotación mejorado y paralaje
      stageItems.forEach((item, index) => {
        if (item.classList.contains('show')) {
          const time = Date.now() * 0.001
          const offsetY = Math.sin(time + index * 1.2) * 8
          const offsetX = Math.cos(time * 0.7 + index * 0.8) * 4
          const rotateZ = Math.sin(time * 0.5 + index) * 2
          
          // Efecto de paralaje basado en posición del mouse (si está disponible)
          const mouseEffect = window.mouseX ? {
            x: (window.mouseX - window.innerWidth / 2) * 0.01,
            y: (window.mouseY - window.innerHeight / 2) * 0.01
          } : { x: 0, y: 0 }
          
          item.style.transform = `
            translateY(${offsetY + mouseEffect.y}px) 
            translateX(${offsetX + mouseEffect.x}px) 
            rotateZ(${rotateZ}deg) 
            scale(1)
          `
          
          // Efecto de brillo sutil
          const brightness = 1 + Math.sin(time * 2 + index) * 0.1
          item.style.filter = `brightness(${brightness}) contrast(1.05) saturate(1.1)`
        }
      })
    } else if (progress <= 0.1 || progress >= 0.6) {
      lifeStagesContainer.classList.add('hide-stages')
      stageItems.forEach(item => {
        item.classList.remove('show')
      })
    }
  }

  function updateAnimation() {
    const currentScrollY = window.scrollY
    const progress = getSectionScrollProgress(envelopeSection, 0.8)
    const isScrollingUp = currentScrollY < lastScrollY
    const isScrollingDown = currentScrollY > lastScrollY
    lastScrollY = currentScrollY

    // Actualizar imágenes de etapas
    updateLifeStagesScroll(progress)

    // Indicador de scroll
    scrollIndicator.style.opacity = progress > 0.1 ? "0" : "1"
    scrollIndicator.style.transform = `translateX(-50%) translateY(${progress > 0.1 ? '20px' : '0'})`

    // Animación del sobre
    if (progress > 0.1) {
      const flapProgress = Math.min(Math.max((progress - 0.1) / 0.3, 0), 1)
      const flapRotation = flapProgress * 180
      backFlap.style.transform = `rotateX(${180 - flapRotation}deg) translateZ(1.5px)`

      if (flapProgress > 0.5) {
        envelope.style.transform = `rotateX(${flapProgress * 10}deg) scale(${1 + flapProgress * 0.1})`
        envelope.style.filter = `drop-shadow(0 ${10 + flapProgress * 20}px ${20 + flapProgress * 30}px rgba(255, 107, 107, 0.3))`
      } else {
        envelope.style.transform = "rotateX(0deg) scale(1)"
        envelope.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,0.2))"
      }

      envelopeOpened = flapProgress > 0.8
    } else {
      backFlap.style.transform = "rotateX(180deg) translateZ(1.5px)"
      envelope.style.transform = "rotateX(0deg) scale(1)"
      envelope.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,0.2))"
      envelopeOpened = false
    }

    // Control del modal
    if (progress > 0.6 && isScrollingDown && !letterShown) {
      showLetter()
    }
    if (letterShown && isScrollingUp && progress < 0.55) {
      hideLetter()
    }
  }

  // ========== CONFIGURACIÓN DE OBSERVERS ==========
  function setupIntersectionObserver() {
    const options = { root: null, rootMargin: "0px", threshold: 0.1 }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate")
          observer.unobserve(entry.target)
        }
      })
    }, options)

    document.querySelectorAll("[data-animation]").forEach((element) => {
      observer.observe(element)
    })

    // Animaciones del header con delay
    const headerStageItems = document.querySelectorAll('.header-stage-item')
    headerStageItems.forEach((item, index) => {
      const delay = parseInt(item.getAttribute('data-delay') || 0)
      setTimeout(() => {
        item.classList.add('animate')
      }, delay)
    })
  }

  // ========== EVENT LISTENERS ==========
  function setupEventListeners() {
    // Modal
    closeButton.addEventListener("click", hideLetter)
    modalOverlay.addEventListener("click", hideLetter)
    
    // Teclado
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && letterShown) hideLetter()
    })
    
    // Prevenir scroll en modal
    letter.addEventListener("wheel", (e) => e.stopPropagation())
    
    // Scroll optimizado
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateAnimation()
          ticking = false
        })
        ticking = true
      }
    }
    
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    
    // Efectos del sobre
    envelope.addEventListener("mouseenter", () => {
      if (!envelopeOpened) {
        envelope.style.transform = "rotateX(5deg) rotateY(5deg) scale(1.05)"
        envelope.style.filter = "drop-shadow(0 15px 30px rgba(255, 107, 107, 0.4))"
      }
    })
    
    envelope.addEventListener("mouseleave", () => {
      if (!envelopeOpened) {
        envelope.style.transform = "rotateX(0deg) rotateY(0deg) scale(1)"
        envelope.style.filter = "drop-shadow(0 10px 20px rgba(0,0,0,0.2))"
      }
    })
    
    // Efecto 3D con mouse
    document.addEventListener("mousemove", (e) => {
      if (envelopeOpened && !letterShown) {
        const mouseX = e.clientX / window.innerWidth - 0.5
        const mouseY = e.clientY / window.innerHeight - 0.5
        envelope.style.transform = `rotateX(${5 - mouseY * 10}deg) rotateY(${mouseX * 10}deg) scale(1.05)`
        envelope.style.filter = `drop-shadow(0 ${15 + Math.abs(mouseY) * 20}px ${30 + Math.abs(mouseX) * 20}px rgba(255, 107, 107, 0.4))`
      }
    })
    
    // Globos interactivos
    document.querySelectorAll(".balloon").forEach((balloon, index) => {
      balloon.addEventListener("click", () => {
        balloon.style.animation = "none"
        balloon.style.transform = "translateY(-100vh) rotate(720deg)"
        balloon.style.transition = "transform 2s ease-in"

        setTimeout(() => {
          balloon.style.transform = ""
          balloon.style.transition = ""
          balloon.style.animation = `float 6s ease-in-out infinite ${index}s`
        }, 2000)
      })
    })
  }

  // ========== INICIALIZACIÓN ==========
  function init() {
    createConfetti()
    setupIntersectionObserver()
    setupHeaderLifeGallery()
    setupEventListeners()
    updateAnimation()
  }

  // Iniciar aplicación
  init()
})
