// Cache DOM elements and values
const b = document.body;
const h = document.querySelector("#h");
const a = document.querySelector("#a");
const unit = 1.7;
const bioshock = document.querySelector("#bioshock");
const img = document.querySelector("#img");
const video = document.querySelector("#video");
const tv = document.querySelector("#screen");

// Add throttle function to improve performance
function throttle(func, limit) {
  let inThrottle;
  return function(e) {
    if (!inThrottle) {
      func(e);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  }
}

// Optimize transform calculations
const calculateTransform = (x, y) => `
  perspective(${400 * unit}vmin)
  rotateX(${y * 4 + 66}deg)
  rotateZ(${-x * 12 + 35}deg)
  translateZ(${-14 * unit}vmin)
`;

// Improved base function with throttling
const base = throttle((e) => {
  const x = e.pageX / window.innerWidth - 0.5;
  const y = e.pageY / window.innerHeight - 0.5;
  
  // Use requestAnimationFrame for smooth animation
  requestAnimationFrame(() => {
    h.style.transform = calculateTransform(x, y);
  });
}, 16); // ~60fps

// Improved play function
const playFunc = () => {
  // Remove event listeners
  b.removeEventListener("pointermove", base);
  bioshock.removeEventListener("click", playFunc);
  
  // Update UI
  if (img) img.classList.add("is-element-hidden");
  if (video) {
    video.classList.remove("is-element-hidden");
    
    // Optimize video playback
    try {
      video.load();
      video.currentTime = 0;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Video playback error:", error);
        });
      }
    } catch (err) {
      console.error("Video loading error:", err);
    }
  }
  
  // Update main container
  h.classList.add("is-main-active");
  
  // Handle audio
  if (a) {
    a.currentTime = 0;
    const audioPromise = a.play();
    if (audioPromise !== undefined) {
      audioPromise.catch(error => {
        console.error("Audio playback error:", error);
      });
    }
  }
};

// Improved stop function
const stopFunc = () => {
  // Restore event listeners
  b.addEventListener("pointermove", base);
  bioshock.addEventListener("click", playFunc);
  
  // Update UI
  if (img) img.classList.remove("is-element-hidden");
  if (video) {
    video.classList.add("is-element-hidden");
    video.pause();
  }
  
  h.classList.remove("is-main-active");
  
  // Handle audio
  if (a) {
    a.pause();
    a.currentTime = 0;
  }
};

// Add error handling for video
if (video) {
  video.addEventListener('error', (e) => {
    console.error('Video error:', e);
  });
  
  // Preload video when possible
  video.addEventListener('canplaythrough', () => {
    video.setAttribute('preload', 'auto');
  });
}

// Initialize event listeners
const addEventListeners = () => {
  b.addEventListener("pointermove", base);
  bioshock.addEventListener("click", playFunc);
  tv.addEventListener("click", stopFunc);
};

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', addEventListeners);

// Clean up function to remove event listeners if needed
const cleanup = () => {
  b.removeEventListener("pointermove", base);
  bioshock.removeEventListener("click", playFunc);
  tv.removeEventListener("click", stopFunc);
};