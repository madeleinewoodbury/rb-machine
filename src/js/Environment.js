import RenderInfo from './RenderInfo'
import PhysicsInfo from './PhysicsInfo'

class Environment {
  constructor() {
    this.canvas = document.getElementById('canvas')
    this.physicsInfo = new PhysicsInfo()
    this.renderInfo = new RenderInfo(this.canvas)

    this.addEventListeners()
  }

  start() {
    this.physicsInfo.setup()
    this.animate(0)
  }

  addEventListeners() {
    window.addEventListener('resize', () => this.renderInfo.resize())
    window.addEventListener('keydown', (e) => this.renderInfo.keyDown(e.code))
    window.addEventListener('keyup', (e) => this.renderInfo.keyUp(e.code))
  }

  animate(currentTime) {
    const deltaTime = this.renderInfo.clock.getDelta()

    this.renderInfo.update()

    window.requestAnimationFrame((currentTime) => this.animate(currentTime))
  }
}

export default Environment
