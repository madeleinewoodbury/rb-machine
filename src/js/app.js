import Environment from "./Environment.js";

// Initialize Ammo.js
Ammo().then(async (AmmoLib) => {
  Ammo = AmmoLib;

  const environment = new Environment();

  // Initialize the environment
  environment.initialize();

  const startMessage = document.querySelector(".start-message");
  const startBtn = startMessage.querySelector("button");

  // Handle the start button click
  function handleStartButtonClick() {
    startMessage.style.display = "none";
    setTimeout(() => {
      // Start the environment
      environment.start();

      // Remove the event listener for the start button and add it for the reset button
      startBtn.removeEventListener("click", handleStartButtonClick);
      startBtn.addEventListener("click", () => {
        localStorage.setItem("reset", "true");
        location.reload();
      });
    }, 500);
  }

  // Check if the game has been reset or if it's the first time
  if (localStorage.getItem("reset") === "true") {
    localStorage.setItem("reset", "false");
    // Add the event listener for the reset button
    startBtn.addEventListener("click", () => {
      localStorage.setItem("reset", "true");
      location.reload();
    });
    startMessage.style.display = "none";

    // Start the environment
    environment.start();
  } else {
    startMessage.style.display = "flex";
    // Add the event listener for the start button
    startBtn.addEventListener("click", handleStartButtonClick);
  }
});
