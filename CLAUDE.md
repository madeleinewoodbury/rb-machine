# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RB Maskin (Rube Goldberg Machine) is an interactive 3D physics simulation built with Three.js and Ammo.js. The application presents a chain reaction sequence that culminates in feeding a fish. The user interface is in English, and the goal is to "feed the fish" by starting the elevator sequence.

## Development Commands

- `npm run dev` - Start development server with Vite (opens automatically in browser)
- `npm run build` - Build production version to dist/ directory

## Architecture Overview

### Core Classes

- **Environment.js** - Main orchestrator class that manages the entire simulation lifecycle
- **RenderInfo.js** - Handles rendering, cameras, and visual scene management
- **PhysicsInfo.js** - Manages Ammo.js physics world, collision detection, and rigid bodies
- **AmmoHelper.js** - Utility class for creating physics bodies and shapes

### Scene Organization

The project uses a modular scene-based architecture where each scene represents a part of the Rube Goldberg machine:

1. **worldScene.js** - Sky box, ground plane, and lighting setup
2. **elevatorScene.js** - Interactive elevator that starts the chain reaction
3. **tubeScene.js** - Ball transport system
4. **balancingBoardScene.js** - Pivoting balance mechanism
5. **pillarScene.js** - Domino pillars that fall in sequence
6. **windScene.js** - Fan system that affects particle movement
7. **hammerScene.js** - Hammer mechanism triggered by falling objects
8. **laserGunScene.js** - Laser gun that shoots at targets
9. **fishScene.js** - Final scene with aquarium and fish to be fed

### Physics Integration

The physics system uses Ammo.js with the following collision groups:
- `domino: 1` - Falling domino elements
- `foodContainer: 2` - Fish food containers
- `pillar: 4` - Support pillars
- `aquarium: 8` - Aquarium walls
- `ball: 16` - Rolling balls
- `bridge: 32` - Bridge elements
- `board: 64` - Balance board surfaces

Collision detection handles the chain reaction triggers between different scene elements.

### Camera System

Six predefined cameras provide different viewing angles of the machine:
- Camera switching follows a sequence: [1, 2, 3, 4, 0] during the chain reaction
- Camera info displayed in UI shows current camera number
- OrbitControls enabled for interactive camera movement

### Scene Objects

Scene objects are organized in `/sceneObjects/` with classes like:
- **Sphere.js**, **Box.js**, **Cylinder.js** - Basic geometric shapes with physics
- **Elevator.js**, **ElevatorShaft.js** - Interactive elevator system
- **Aquarium.js** - Fish tank with water shader effects
- **Fan.js**, **Hammer.js** - Mechanical components
- **LaserButton.js** - Interactive trigger elements

### Utilities

- **materials.js** - Shared material definitions with PBR textures
- **textures.js** - Texture loading and management
- **sounds.js** - Audio effects synchronized with physics events

## Key Patterns

### Adding New Scene Objects

1. Create class in `/sceneObjects/` extending basic geometry or custom logic
2. Implement physics body creation using AmmoHelper
3. Add to appropriate scene function in `/scenes/`
4. Configure collision groups and event handlers if interactive

### Physics Body Creation

Objects use AmmoHelper for consistent physics setup:
```javascript
ammoHelper.createBoxShape(width, height, depth);
ammoHelper.createRigidBody(shape, mesh, mass, position, quaternion);
```

### Material System

Materials are centrally managed with PBR properties:
- Textures loaded from `/static/textures/` with organized subdirectories
- Materials include ambient occlusion, normal maps, and roughness
- Consistent material application across similar object types

### Event Handling

Chain reaction events use collision detection:
- Objects register collision callbacks through PhysicsInfo
- Sound effects triggered on collision events
- Camera switching timed with major sequence milestones

## File Structure

```
src/
├── index.html          # Main HTML with embedded shaders
├── style.css           # Global styles
└── js/
    ├── app.js          # Entry point and Ammo.js initialization
    ├── Environment.js  # Main controller class
    ├── RenderInfo.js   # Rendering and camera management
    ├── PhysicsInfo.js  # Physics world management
    ├── AmmoHelper.js   # Physics utilities
    ├── scenes/         # Scene composition functions
    ├── sceneObjects/   # Interactive object classes
    ├── lights/         # Lighting system
    └── utils/          # Shared utilities (materials, sounds, textures)
```

## Development Notes

- The application includes a reset mechanism using localStorage
- Vite serves from `src/` with static assets in `static/`
- Physics runs at 60 FPS with deltaTime calculations
- All text and UI elements are in Norwegian
- The simulation has a specific sequence that must complete to "feed the fish"