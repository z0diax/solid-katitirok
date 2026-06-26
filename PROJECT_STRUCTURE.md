# Katitirok 2026 - Project Structure

A cute farming game where users can add their photo as farmers that walk around with chicks on a farm field.

## Project Structure

```
solid-katitirok/
├── App.jsx                 # Entry point (redirects to src/App.jsx for compatibility)
├── README.md               # Original README
├── src/
│   ├── App.jsx            # Main application component
│   ├── components/         # React components
│   │   ├── CameraModal.jsx     # Camera capture and photo interface
│   │   ├── Chick.jsx           # Chick character component
│   │   ├── Farmer.jsx          # Farmer character component
│   │   ├── GameField.jsx       # Main game field container
│   │   ├── Header.jsx          # App header with title and add farmer button
│   │   └── SkyDecorations.jsx  # Animated sky elements (sun, clouds)
│   ├── assets/             # Reusable SVG and visual components
│   │   └── PineTreeAsset.jsx   # Pine tree SVG component
│   ├── constants/          # Application constants
│   │   ├── costumes.js         # Farmer costume color schemes
│   │   └── initialChicks.js    # Initial chick state data
│   ├── hooks/              # Custom React hooks
│   │   ├── useCamera.js        # Camera access and stream management
│   │   └── useGameLoop.js      # Main animation and game loop logic
│   └── utils/              # Utility functions
│       ├── gameHelpers.js      # Game logic helpers (movement, positioning)
│       └── photoCapture.js     # Photo capture and stream utilities
```

## Component Overview

### Core Components

- **App.jsx** - Main component that orchestrates all child components and manages global state
- **GameField.jsx** - Renders the farm field with trees, farmers, and chicks
- **CameraModal.jsx** - Modal interface for capturing user photos
- **Header.jsx** - Application header with title and controls
- **SkyDecorations.jsx** - Animated sky elements (sun, clouds)

### Character Components

- **Farmer.jsx** - Renders individual farmer characters with custom poses and animations
- **Chick.jsx** - Renders chick characters with simple animations

### Assets

- **PineTreeAsset.jsx** - SVG tree component used as scenery

## Hooks

### useCamera
Manages camera access, stream handling, and error states.

```javascript
const { isCameraOpen, stream, error, videoRef, openCamera, closeCamera } = useCamera();
```

### useGameLoop
Main animation loop that updates farmer and chick positions every 30ms.

```javascript
useGameLoop(farmers, setFarmers, chicks, setChicks, getRandomTarget, fieldRef);
```

## Utilities

### gameHelpers.js
- `getRandomTarget()` - Generate random movement target within boundaries
- `clampPositionToBounds()` - Keep entities within field boundaries
- `distance()` - Calculate distance between two points
- `createFarmerFromPhoto()` - Create farmer entity from captured photo

### photoCapture.js
- `capturePhotoFromVideo()` - Convert video frame to data URL
- `stopMediaStream()` - Safely stop all media tracks

## Constants

### costumes.js
Array of color schemes for farmer outfits (shirt, overalls, hat band)

### initialChicks.js
Initial state data for the two starting chicks

## How the Game Works

1. **Rendering** - The game field displays farmers and chicks as positioned elements
2. **Game Loop** - `useGameLoop` runs every 30ms, updating positions and states
3. **Movement** - Farmers and chicks walk to random targets, pause to idle, then repeat
4. **Boundary** - All entities are clamped within field boundaries
5. **Z-Indexing** - Y position determines stacking order (lower = behind, higher = in front)
6. **Camera** - Users can open the camera modal to capture a selfie
7. **Photo** - Captured photo becomes the farmer's face and is added to the field

## Key Features

- ✨ Cute pixel-art style characters with animations
- 📷 Photo capture using device camera
- 🎨 Randomized farmer outfits
- 🚶 AI-controlled walking and idle animations
- 🌲 Decorative scenery elements
- ☀️ Animated sky decorations

## Technical Details

- Built with React and Tailwind CSS
- Uses Lucide React for icons
- No external game libraries - pure React component rendering
- Smooth 30fps animation loop
- Responsive design for mobile and desktop

---

For the original project description, see [README.md](./README.md)
