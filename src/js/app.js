import Environment from "./Environment.js";

// Initialize Ammo.js
Ammo().then(async (AmmoLib) => {
  Ammo = AmmoLib;

  // Initialize the environment
  const environment = new Environment();

  // Start
  environment.initialize();

  const startMessage = document.querySelector(".start-message");
  const startBtn = startMessage.querySelector("button");

  function handleStartButtonClick() {
    startMessage.style.display = "none";
    setTimeout(() => {
      environment.start();

      startBtn.removeEventListener("click", handleStartButtonClick);
      startBtn.addEventListener("click", () => {
        localStorage.setItem("reset", "true");
        location.reload();
      });
    }, 500);
  }

  if(localStorage.getItem("reset") === "true") {
    localStorage.setItem("reset", "false");
    // handleStartButtonClick();
    startBtn.addEventListener("click", () => {
      localStorage.setItem("reset", "true");
      location.reload();
    });
    startMessage.style.display = "none";
    environment.start();
  } else {
    startMessage.style.display = "flex";
    // Add the event listener
    startBtn.addEventListener("click", handleStartButtonClick);
  }
});
