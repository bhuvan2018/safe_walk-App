// Register service worker more aggressively
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("ServiceWorker registration successful with scope: ", registration.scope)
        })
        .catch((error) => {
          console.log("ServiceWorker registration failed: ", error)
        })
    })
  
    // Force update check every time
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("Service worker controller changed")
    })
  }
  
  // Check if PWA is installable
  window.addEventListener("load", () => {
    console.log("Checking PWA installability...")
  
    // Log display mode
    if (window.matchMedia("(display-mode: standalone)").matches) {
      console.log("Display mode: standalone - App is already installed")
    } else {
      console.log("Display mode: browser - App can be installed")
    }
  })
  