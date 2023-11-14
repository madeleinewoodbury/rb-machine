import Environment from './Environment.js'

// Initialize Ammo.js
Ammo().then(async (AmmoLib) => {
  Ammo = AmmoLib

  // Initialize the environment
  const environment = new Environment()

  // Start
  environment.start()

})
