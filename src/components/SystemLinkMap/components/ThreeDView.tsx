import React, { useRef, useEffect } from 'react';
import ForceGraph3D, { ForceGraphMethods } from 'react-force-graph-3d';
import * as THREE from 'three';

// Mock data for demonstration
const mockNodes = [
  { id: '1', name: 'ERP', group: 'erp' },
  { id: '2', name: 'CRM', group: 'crm' },
  { id: '3', name: 'HR', group: 'hr' },
  { id: '4', name: 'Finance', group: 'finance' },
  { id: '5', name: 'Marketing', group: 'marketing' },
];

const mockLinks = [
  { source: '1', target: '2' },
  { source: '2', target: '3' },
  { source: '3', target: '4' },
  { source: '4', target: '5' },
  { source: '5', target: '1' },
];

const groupColor: Record<string, string> = {
  erp: '#3b82f6',
  crm: '#10b981',
  hr: '#8b5cf6',
  finance: '#eab308',
  marketing: '#f97316',
  default: '#64748b',
};

type NodeType = { id: string; name: string; group: string };

const ThreeDView: React.FC = () => {
  const fgRef = useRef<ForceGraphMethods>();

  useEffect(() => {
    // Optionally, zoom to fit on mount
    if (fgRef.current) {
      fgRef.current.zoomToFit(400);
    }
  }, []);

  return (
    <div style={{ width: '100%', height: '100%', background: '#f8fafc' }}>
      <ForceGraph3D
        ref={fgRef}
        graphData={{ nodes: mockNodes, links: mockLinks }}
        nodeAutoColorBy="group"
        nodeLabel={(node: NodeType) => node.name}
        nodeThreeObjectExtend={true}
        linkDirectionalParticles={2}
        linkDirectionalParticleWidth={2}
        linkColor={() => '#64748b'}
        nodeThreeObject={(node: NodeType) => {
          // Custom node appearance (sphere with color)
          const geometry = new THREE.SphereGeometry(7, 16, 16);
          const material = new THREE.MeshBasicMaterial({ color: groupColor[node.group] || groupColor.default });
          const mesh = new THREE.Mesh(geometry, material);
          return mesh;
        }}
      />
    </div>
  );
};

export default ThreeDView; 