const sounds = {
  hit: new Audio("/sounds/hit.mp3"),
  ding: new Audio("/sounds/ding.mp3"),
  elevator: new Audio("/sounds/elevator.mp3"),
  laser: new Audio("/sounds/laser.mp3"),
  wind: new Audio("/sounds/wind.mp3"),
  rollingBall: new Audio("/sounds/rollingBall.mp3"),
  tube: new Audio("/sounds/tube.mp3"),
  boing: new Audio("/sounds/boing.mp3"),
  success: new Audio("/sounds/success.mp3"),

  playDing: function() {
    this.ding.volume = .8
    this.ding.currentTime = 0;
    this.ding.play();
  },

  playLaser: function() {
    this.laser.volume = 0.25;
    this.laser.currentTime = 0;
    this.laser.play();
  },

  playHit: function() {
    this.hit.volume = 1;
    this.hit.currentTime = 0;
    this.hit.play();
  },
  playElevator: function() {
    this.elevator.volume = .9;
    this.elevator.currentTime = 0;
    this.elevator.play();
  },
  playWind: function() {
    if(!this.wind.paused) return;
    this.wind.volume = 1;
    this.wind.currentTime = 0;
    this.wind.play();
  },
  playRollingBall: function() {
    if(!this.rollingBall.paused) return;
    this.rollingBall.volume = 0.5;
    this.rollingBall.currentTime = 0;
    this.rollingBall.play();
  },
  playTube: function() {
    if(!this.tube.paused) return;
    this.tube.volume = .2;
    this.tube.currentTime = 0;
    this.tube.play();
  },
  playBoing: function() {
    if(!this.boing.paused) return;
    this.boing.volume = .7;
    this.boing.currentTime = 0;
    this.boing.play();
  },
  playSuccess: function() {
    if(!this.success.paused) return;
    this.success.volume = 0.75;
    this.success.currentTime = 0;
    this.success.play();
  }
};

export default sounds