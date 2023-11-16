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

  startBtn.addEventListener("click", () => {
    startMessage.style.display = "none";
    setTimeout(() => {
      environment.start();
    }, 500);
  });
});
