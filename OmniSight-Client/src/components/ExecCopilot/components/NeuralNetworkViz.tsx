import React, { useEffect, useRef } from 'react';

interface NeuralNetworkVizProps {
  isThinking?: boolean;
  className?: string;
}

const NeuralNetworkViz: React.FC<NeuralNetworkVizProps> = ({ 
  isThinking = false,
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    let animationId: number;
    let time = 0;

    const nodes = Array.from({ length: 12 }, (_, i) => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: [] as number[]
    }));

    // Create connections between nearby nodes
    nodes.forEach((node, i) => {
      nodes.forEach((otherNode, j) => {
        if (i !== j) {
          const dist = Math.sqrt(
            Math.pow(node.x - otherNode.x, 2) + 
            Math.pow(node.y - otherNode.y, 2)
          );
          if (dist < 150) {
            node.connections.push(j);
          }
        }
      });
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      time += 0.02;

      // Update node positions
      nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off edges
        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        // Keep within bounds
        node.x = Math.max(0, Math.min(canvas.width, node.x));
        node.y = Math.max(0, Math.min(canvas.height, node.y));
      });

      // Draw connections
      ctx.strokeStyle = isThinking 
        ? `rgba(0, 245, 160, ${0.3 + Math.sin(time * 2) * 0.2})`
        : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;

      nodes.forEach((node, i) => {
        node.connections.forEach(connectedIndex => {
          const connectedNode = nodes[connectedIndex];
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(connectedNode.x, connectedNode.y);
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach((node, i) => {
        const pulse = isThinking ? 1 + Math.sin(time * 3 + i) * 0.3 : 1;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 3 * pulse, 0, Math.PI * 2);
        ctx.fillStyle = isThinking 
          ? `rgba(0, 245, 160, ${0.8 + Math.sin(time * 2 + i) * 0.2})`
          : 'rgba(255, 255, 255, 0.6)';
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [isThinking]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default NeuralNetworkViz;
