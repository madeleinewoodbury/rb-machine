const sounds = {
  hitSound: new Audio("/sounds/hit.mp3"),
  dingSound: new Audio("/sounds/ding.mp3"),
  elevatorSound: new Audio("/sounds/elevator-move.mp3"),
  laserSound: new Audio("/sounds/laser.mp3"),

  playDing: function() {
    this.dingSound.volume = Math.random();
    this.dingSound.currentTime = 0;
    this.dingSound.play();
  },

  playLaserSound: function() {
    this.laserSound.volume = 0.5;
    this.laserSound.currentTime = 0;
    this.laserSound.play();
  },

  playHitSound: function() {
    this.hitSound.volume = 1;
    this.hitSound.currentTime = 0;
    this.hitSound.play();
  },
};

export default sounds