// Direct PWA installation script
let deferredPrompt

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent the default mini-infobar prompt
  e.preventDefault()
  // Stash the event so it can be triggered later.
  deferredPrompt = e
  console.log("Install prompt captured! 📱")

  // Show a custom install button
  const installBtn = document.createElement("button")
  installBtn.id = "pwa-install-btn"
  installBtn.textContent = "Install SafeWalk"
  installBtn.style.position = "fixed"
  installBtn.style.top = "10px"
  installBtn.style.right = "10px"
  installBtn.style.padding = "10px 15px"
  installBtn.style.backgroundColor = "#7e22ce"
  installBtn.style.color = "#fff"
  installBtn.style.border = "none"
  installBtn.style.borderRadius = "5px"
  installBtn.style.zIndex = "9999"
  installBtn.style.fontWeight = "bold"
  installBtn.style.boxShadow = "0 2px 5px rgba(0,0,0,0.2)"
  document.body.appendChild(installBtn)

  installBtn.addEventListener("click", () => {
    installBtn.style.display = "none"
    deferredPrompt.prompt()

    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === "accepted") {
        console.log("User accepted the A2HS prompt")
      } else {
        console.log("User dismissed the A2HS prompt")
        // Show the button again if user dismissed
        setTimeout(() => {
          installBtn.style.display = "block"
        }, 3000)
      }
      deferredPrompt = null
    })
  })
})

// Check if already installed
window.addEventListener("DOMContentLoaded", () => {
  if (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true) {
    console.log("App is installed and running in standalone mode")
    // Remove the install button if it exists
    const installBtn = document.getElementById("pwa-install-btn")
    if (installBtn) {
      installBtn.remove()
    }
  }
})

// Handle successful installation
window.addEventListener("appinstalled", (evt) => {
  console.log("App was successfully installed! 🎉")
  // Remove the install button
  const installBtn = document.getElementById("pwa-install-btn")
  if (installBtn) {
    installBtn.remove()
  }
})
