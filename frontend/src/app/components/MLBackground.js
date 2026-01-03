'use client';
import { useEffect, useRef, useCallback } from 'react';

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Neural Network
  network: {
    opacity: { min: 0.03, max: 0.08 },
    leftZone: { start: 0, end: 0.18 },
    rightZone: { start: 0.82, end: 1 },
    layers: { desktop: 16, mobile: 10 },
    nodesPattern: [2, 3, 4, 3, 2],
    connectionDensity: 0.25,
    pulseAmplitude: 0.25,
    floatAmplitude: 1.5,
  },
  // Floating Particles
  particles: {
    count: { desktop: 100, mobile: 45 },
    size: { min: 1.5, max: 5 },
    trailLength: { min: 12, max: 30 },
    speed: { min: 0.2, max: 0.6 },
    opacity: { min: 0.4, max: 0.75 },
    driftSpeed: 0.0004,
    // Cursor follow settings
    cursorFollowChance: 0.25, // 25% of particles will follow cursor
    cursorInfluenceRadius: 200, // Radius of cursor influence
    cursorAttraction: 0.015, // How strongly particles are attracted
    cursorMaxSpeed: 3, // Max speed when following cursor
  },
  // Gravity toward Contact
  gravity: {
    radius: 350,
    pullStrength: 0.004,
  },
  // Colors - Purple/Violet Theme
  colors: {
    purple: { r: 192, g: 132, b: 252 },
    violet: { r: 168, g: 85, b: 247 },
    indigo: { r: 99, g: 102, b: 241 },
    pink: { r: 244, g: 114, b: 182 },
    cyan: { r: 103, g: 232, b: 249 },
    white: { r: 235, g: 229, b: 245 },
    bg: 'rgb(15, 10, 26)',
  },
};

// ============================================
// UTILITY FUNCTIONS
// ============================================
function rgba(color, alpha) {
  return `rgba(${color.r}, ${color.g}, ${color.b}, ${alpha})`;
}

function randomRange(min, max) {
  return min + Math.random() * (max - min);
}

function distance(x1, y1, x2, y2) {
  return Math.hypot(x2 - x1, y2 - y1);
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

// ============================================
// NEURAL NODE
// ============================================
class NeuralNode {
  constructor(x, y, layer, side) {
    this.baseX = x;
    this.baseY = y;
    this.x = x;
    this.y = y;
    this.layer = layer;
    this.side = side;
    this.radius = 1.5 + Math.random() * 1;
    
    this.pulsePhase = Math.random() * Math.PI * 2;
    this.pulseSpeed = 0.006 + Math.random() * 0.003;
    this.floatPhase = Math.random() * Math.PI * 2;
    this.floatSpeed = 0.002 + Math.random() * 0.001;
    
    this.baseOpacity = randomRange(CONFIG.network.opacity.min, CONFIG.network.opacity.max);
  }

  update() {
    this.pulsePhase += this.pulseSpeed;
    this.floatPhase += this.floatSpeed;
    this.x = this.baseX + Math.sin(this.floatPhase) * CONFIG.network.floatAmplitude;
    this.y = this.baseY + Math.cos(this.floatPhase * 0.7) * CONFIG.network.floatAmplitude * 0.5;
  }

  draw(ctx, scrollY, viewportHeight) {
    const screenY = this.y - scrollY;
    if (screenY < -20 || screenY > viewportHeight + 20) return;
    
    const pulse = Math.sin(this.pulsePhase) * CONFIG.network.pulseAmplitude + (1 - CONFIG.network.pulseAmplitude);
    const opacity = this.baseOpacity * pulse;
    
    const color = this.side === 'left' ? CONFIG.colors.purple : CONFIG.colors.violet;
    
    const gradient = ctx.createRadialGradient(this.x, screenY, 0, this.x, screenY, this.radius * 2.5);
    gradient.addColorStop(0, rgba(color, opacity * 0.7));
    gradient.addColorStop(1, rgba(color, 0));
    
    ctx.beginPath();
    ctx.arc(this.x, screenY, this.radius * 2.5, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
  }
}

// ============================================
// CONNECTION
// ============================================
class Connection {
  constructor(from, to) {
    this.from = from;
    this.to = to;
    this.baseOpacity = randomRange(0.02, 0.05);
  }

  draw(ctx, scrollY, viewportHeight) {
    const fromY = this.from.y - scrollY;
    const toY = this.to.y - scrollY;
    
    if ((fromY < -30 && toY < -30) || (fromY > viewportHeight + 30 && toY > viewportHeight + 30)) return;
    
    const color = this.from.side === 'left' ? CONFIG.colors.purple : CONFIG.colors.violet;
    
    ctx.beginPath();
    ctx.moveTo(this.from.x, fromY);
    ctx.lineTo(this.to.x, toY);
    ctx.strokeStyle = rgba(color, this.baseOpacity);
    ctx.lineWidth = 0.4;
    ctx.stroke();
  }
}

// ============================================
// FLOATING PARTICLE - With cursor follow
// ============================================
class FloatingParticle {
  constructor(viewportWidth, totalHeight, contactY, id) {
    this.id = id;
    this.viewportWidth = viewportWidth;
    this.totalHeight = totalHeight;
    this.contactY = contactY;
    
    // Random position
    this.x = Math.random() * viewportWidth;
    this.y = Math.random() * totalHeight;
    
    // Size and appearance
    this.size = randomRange(CONFIG.particles.size.min, CONFIG.particles.size.max);
    this.baseOpacity = randomRange(CONFIG.particles.opacity.min, CONFIG.particles.opacity.max);
    this.opacity = this.baseOpacity;
    
    // Trail
    this.trail = [];
    this.trailMaxLength = Math.floor(randomRange(CONFIG.particles.trailLength.min, CONFIG.particles.trailLength.max));
    
    // Velocity
    const angle = Math.random() * Math.PI * 2;
    const speed = randomRange(CONFIG.particles.speed.min, CONFIG.particles.speed.max);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed + 0.15;
    
    // Drift
    this.driftPhase = Math.random() * Math.PI * 2;
    this.driftAmplitude = 0.015 + Math.random() * 0.02;
    
    // Cursor following - only some particles will follow
    this.followsCursor = Math.random() < CONFIG.particles.cursorFollowChance;
    this.cursorInfluence = 0; // Current influence level (0-1)
    this.targetCursorInfluence = 0;
    
    // Color - Purple theme variations
    const colorChoice = Math.random();
    if (colorChoice < 0.35) {
      this.color = CONFIG.colors.purple;
    } else if (colorChoice < 0.6) {
      this.color = CONFIG.colors.violet;
    } else if (colorChoice < 0.75) {
      this.color = CONFIG.colors.indigo;
    } else if (colorChoice < 0.88) {
      this.color = CONFIG.colors.pink;
    } else {
      this.color = CONFIG.colors.cyan;
    }
    
    // State
    this.dissolving = false;
    this.dissolved = false;
  }

  update(mouseX, mouseY, scrollY) {
    if (this.dissolved) return;
    
    // Trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > this.trailMaxLength) {
      this.trail.shift();
    }
    
    // Organic drift
    this.driftPhase += CONFIG.particles.driftSpeed;
    this.vx += Math.sin(this.driftPhase) * this.driftAmplitude;
    this.vy += Math.cos(this.driftPhase * 0.7) * this.driftAmplitude * 0.5;
    
    // Cursor following logic
    if (this.followsCursor && mouseX !== null && mouseY !== null) {
      const worldMouseY = mouseY + scrollY;
      const distToCursor = distance(this.x, this.y, mouseX, worldMouseY);
      
      if (distToCursor < CONFIG.particles.cursorInfluenceRadius) {
        // Calculate target influence based on distance
        this.targetCursorInfluence = 1 - (distToCursor / CONFIG.particles.cursorInfluenceRadius);
        this.targetCursorInfluence = Math.pow(this.targetCursorInfluence, 0.5); // Ease the falloff
      } else {
        this.targetCursorInfluence = 0;
      }
      
      // Smooth transition of influence
      this.cursorInfluence = lerp(this.cursorInfluence, this.targetCursorInfluence, 0.08);
      
      // Apply cursor attraction
      if (this.cursorInfluence > 0.01) {
        const dx = mouseX - this.x;
        const dy = worldMouseY - this.y;
        const dist = Math.max(distToCursor, 1);
        
        // Attract toward cursor with easing
        const attractionStrength = CONFIG.particles.cursorAttraction * this.cursorInfluence;
        this.vx += (dx / dist) * attractionStrength;
        this.vy += (dy / dist) * attractionStrength;
        
        // Boost opacity when following
        this.opacity = lerp(this.baseOpacity, Math.min(this.baseOpacity * 1.5, 0.9), this.cursorInfluence);
        
        // Extend trail when following
        const targetTrailLength = Math.floor(this.trailMaxLength * (1 + this.cursorInfluence * 0.5));
        if (this.trail.length < targetTrailLength) {
          this.trailMaxLength = targetTrailLength;
        }
      }
    } else {
      // Reset influence when not following
      this.cursorInfluence = lerp(this.cursorInfluence, 0, 0.05);
      this.opacity = lerp(this.opacity, this.baseOpacity, 0.05);
    }
    
    // Gravity toward contact
    const distToContact = this.contactY - this.y;
    if (distToContact > 0 && distToContact < CONFIG.gravity.radius) {
      const pullStrength = (1 - distToContact / CONFIG.gravity.radius) * CONFIG.gravity.pullStrength;
      this.vy += pullStrength;
      const centerX = this.viewportWidth / 2;
      this.vx += (centerX - this.x) * 0.00008;
    }
    
    // Limit speed (higher when following cursor)
    const maxSpeed = this.cursorInfluence > 0.1 
      ? CONFIG.particles.cursorMaxSpeed 
      : 2;
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed;
      this.vy = (this.vy / speed) * maxSpeed;
    }
    
    // Apply velocity with slight damping
    const damping = this.cursorInfluence > 0.1 ? 0.995 : 0.999;
    this.vx *= damping;
    this.vy *= damping;
    
    this.x += this.vx;
    this.y += this.vy;
    
    // Dissolve after contact
    if (this.y > this.contactY + 80) {
      this.dissolving = true;
      this.opacity -= 0.025;
      if (this.opacity <= 0) {
        this.dissolved = true;
      }
    }
    
    // Wrap horizontally
    if (this.x < -30) this.x = this.viewportWidth + 30;
    if (this.x > this.viewportWidth + 30) this.x = -30;
  }

  draw(ctx, scrollY, viewportHeight) {
    if (this.dissolved || this.opacity <= 0) return;
    
    const screenY = this.y - scrollY;
    
    const trailStartY = this.trail.length > 0 ? this.trail[0].y - scrollY : screenY;
    if ((screenY < -60 && trailStartY < -60) || 
        (screenY > viewportHeight + 60 && trailStartY > viewportHeight + 60)) return;
    
    // Draw trail with enhanced effect when following cursor
    if (this.trail.length > 1) {
      for (let i = 1; i < this.trail.length; i++) {
        const t = i / this.trail.length;
        const alpha = t * this.opacity * (0.5 + this.cursorInfluence * 0.3);
        const width = t * this.size * (0.6 + this.cursorInfluence * 0.4);
        
        const trailY = this.trail[i].y - scrollY;
        const prevY = this.trail[i - 1].y - scrollY;
        
        ctx.beginPath();
        ctx.moveTo(this.trail[i - 1].x, prevY);
        ctx.lineTo(this.trail[i].x, trailY);
        ctx.strokeStyle = rgba(this.color, alpha);
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.stroke();
      }
    }
    
    // Draw glow (enhanced when following)
    const glowRadius = this.size * (4 + this.cursorInfluence * 2);
    const gradient = ctx.createRadialGradient(this.x, screenY, 0, this.x, screenY, glowRadius);
    gradient.addColorStop(0, rgba(this.color, this.opacity * (0.8 + this.cursorInfluence * 0.2)));
    gradient.addColorStop(0.3, rgba(this.color, this.opacity * (0.4 + this.cursorInfluence * 0.2)));
    gradient.addColorStop(1, rgba(this.color, 0));
    
    ctx.beginPath();
    ctx.arc(this.x, screenY, glowRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();
    
    // Draw core (brighter when following)
    const coreSize = this.size * (0.6 + this.cursorInfluence * 0.3);
    ctx.beginPath();
    ctx.arc(this.x, screenY, coreSize, 0, Math.PI * 2);
    ctx.fillStyle = rgba({ r: 255, g: 255, b: 255 }, this.opacity * (0.95 + this.cursorInfluence * 0.05));
    ctx.fill();
  }

  reset(viewportWidth, totalHeight, contactY) {
    this.viewportWidth = viewportWidth;
    this.totalHeight = totalHeight;
    this.contactY = contactY;
    
    // Respawn at top or sides
    if (Math.random() > 0.3) {
      this.x = Math.random() * viewportWidth;
      this.y = -30 - Math.random() * 80;
    } else {
      this.x = Math.random() > 0.5 ? -30 : viewportWidth + 30;
      this.y = Math.random() * totalHeight * 0.5;
    }
    
    const angle = Math.random() * Math.PI * 0.6 + Math.PI * 0.2;
    const speed = randomRange(CONFIG.particles.speed.min, CONFIG.particles.speed.max);
    this.vx = Math.cos(angle) * speed * 0.4;
    this.vy = Math.abs(Math.sin(angle) * speed) + 0.15;
    
    this.opacity = this.baseOpacity;
    this.trail = [];
    this.dissolving = false;
    this.dissolved = false;
    this.cursorInfluence = 0;
    this.targetCursorInfluence = 0;
    
    // Re-randomize cursor following
    this.followsCursor = Math.random() < CONFIG.particles.cursorFollowChance;
  }
}

// ============================================
// MAIN COMPONENT
// ============================================
export default function MLBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const mouseRef = useRef({ x: null, y: null });
  
  const stateRef = useRef({
    leftNodes: [],
    rightNodes: [],
    leftConnections: [],
    rightConnections: [],
    particles: [],
    contactY: 0,
    viewportWidth: 0,
    viewportHeight: 0,
    totalHeight: 0,
    isMobile: false,
    initialized: false,
  });

  const initializeScene = useCallback(() => {
    const state = stateRef.current;
    
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const totalHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
      viewportHeight * 4
    );
    
    state.viewportWidth = viewportWidth;
    state.viewportHeight = viewportHeight;
    state.totalHeight = totalHeight;
    state.isMobile = viewportWidth < 768;
    
    // Detect contact section
    const contactEl = document.querySelector('#contact') 
      || document.querySelector('[data-section="contact"]')
      || document.querySelector('.contact');
    
    state.contactY = contactEl ? contactEl.offsetTop : totalHeight * 0.85;
    
    // Clear
    state.leftNodes = [];
    state.rightNodes = [];
    state.leftConnections = [];
    state.rightConnections = [];
    state.particles = [];
    
    // Neural Networks
    const numLayers = state.isMobile ? CONFIG.network.layers.mobile : CONFIG.network.layers.desktop;
    const layerSpacing = (totalHeight * 0.75) / numLayers;
    const startY = totalHeight * 0.1;
    
    // Left network
    const leftWidth = viewportWidth * CONFIG.network.leftZone.end;
    for (let layer = 0; layer < numLayers; layer++) {
      const patternIndex = layer % CONFIG.network.nodesPattern.length;
      const nodeCount = Math.ceil(CONFIG.network.nodesPattern[patternIndex] * (state.isMobile ? 0.5 : 0.7));
      const nodeSpacing = leftWidth * 0.6 / Math.max(nodeCount, 1);
      
      for (let n = 0; n < nodeCount; n++) {
        state.leftNodes.push(new NeuralNode(
          8 + n * nodeSpacing,
          startY + layer * layerSpacing,
          layer,
          'left'
        ));
      }
    }
    
    // Right network
    const rightStart = viewportWidth * CONFIG.network.rightZone.start;
    const rightWidth = viewportWidth * (1 - CONFIG.network.rightZone.start);
    for (let layer = 0; layer < numLayers; layer++) {
      const patternIndex = layer % CONFIG.network.nodesPattern.length;
      const nodeCount = Math.ceil(CONFIG.network.nodesPattern[patternIndex] * (state.isMobile ? 0.5 : 0.7));
      const nodeSpacing = rightWidth * 0.6 / Math.max(nodeCount, 1);
      
      for (let n = 0; n < nodeCount; n++) {
        state.rightNodes.push(new NeuralNode(
          rightStart + 8 + n * nodeSpacing,
          startY + layer * layerSpacing,
          layer,
          'right'
        ));
      }
    }
    
    // Connections
    const createConnections = (nodes, connections) => {
      for (let layer = 0; layer < numLayers - 1; layer++) {
        const currentNodes = nodes.filter(n => n.layer === layer);
        const nextNodes = nodes.filter(n => n.layer === layer + 1);
        
        for (const fromNode of currentNodes) {
          if (Math.random() > CONFIG.network.connectionDensity) continue;
          if (nextNodes.length > 0) {
            const toNode = nextNodes[Math.floor(Math.random() * nextNodes.length)];
            connections.push(new Connection(fromNode, toNode));
          }
        }
      }
    };
    
    createConnections(state.leftNodes, state.leftConnections);
    createConnections(state.rightNodes, state.rightConnections);
    
    // Particles
    const particleCount = state.isMobile 
      ? CONFIG.particles.count.mobile 
      : CONFIG.particles.count.desktop;
    
    for (let i = 0; i < particleCount; i++) {
      state.particles.push(new FloatingParticle(viewportWidth, totalHeight, state.contactY, i));
    }
    
    state.initialized = true;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const scrollY = window.scrollY;
    const mouse = mouseRef.current;
    
    // Clear
    ctx.fillStyle = CONFIG.colors.bg;
    ctx.fillRect(0, 0, state.viewportWidth, state.viewportHeight);
    
    // Draw connections
    for (const connection of state.leftConnections) {
      connection.draw(ctx, scrollY, state.viewportHeight);
    }
    for (const connection of state.rightConnections) {
      connection.draw(ctx, scrollY, state.viewportHeight);
    }
    
    // Update and draw nodes
    for (const node of state.leftNodes) {
      node.update();
      node.draw(ctx, scrollY, state.viewportHeight);
    }
    for (const node of state.rightNodes) {
      node.update();
      node.draw(ctx, scrollY, state.viewportHeight);
    }
    
    // Update and draw particles with cursor info
    for (const particle of state.particles) {
      particle.update(mouse.x, mouse.y, scrollY);
      
      if (particle.dissolved) {
        particle.reset(state.viewportWidth, state.totalHeight, state.contactY);
      }
      
      particle.draw(ctx, scrollY, state.viewportHeight);
    }
    
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const setupCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      
      initializeScene();
    };

    // Mouse tracking
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    };
    
    const handleMouseLeave = () => {
      mouseRef.current.x = null;
      mouseRef.current.y = null;
    };

    setupCanvas();
    
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(setupCanvas, 150);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      clearTimeout(resizeTimeout);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animate, initializeScene]);

  return (
    <canvas
      ref={canvasRef}
      id="ml-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}
