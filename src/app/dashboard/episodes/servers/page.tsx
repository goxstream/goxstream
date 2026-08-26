"use client";

import { useState } from "react";
import { ServerHeader } from "./components/server-header";
import { ServerNodesGrid } from "./components/server-nodes-grid";
import { ServerFallbackConfig } from "./components/server-fallback-config";
import { ServerModal } from "./components/server-modal";
import { MOCK_SERVER_NODES } from "../constants";
import type { ServerNode } from "../types";

export default function VideoServersPage() {
  const [nodes, setNodes] = useState<ServerNode[]>(MOCK_SERVER_NODES);
  const [editingNode, setEditingNode] = useState<ServerNode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddClick = () => {
    setEditingNode(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (node: ServerNode) => {
    setEditingNode(node);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const handleSaveNode = (partial: Partial<ServerNode>) => {
    if (editingNode) {
      setNodes((prev) =>
        prev.map((n) => (n.id === editingNode.id ? ({ ...n, ...partial } as ServerNode) : n))
      );
    } else {
      const newNode: ServerNode = {
        id: `srv-node-${Date.now()}`,
        name: partial.name || "New CDN Node",
        region: partial.region || "Asia Pacific",
        provider: partial.provider || "Custom Provider",
        endpoint: partial.endpoint || "https://cdn.goxstream.tv/",
        status: partial.status || "online",
        latencyMs: 40,
        activeConnections: 0,
        bandwidthUsageGbps: 0,
        totalCapacityGbps: partial.totalCapacityGbps || 10,
        isPrimary: partial.isPrimary || false,
      };
      setNodes((prev) => [...prev, newNode]);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <ServerHeader onAddClick={handleAddClick} />

      <ServerNodesGrid
        nodes={nodes}
        onEdit={handleEditClick}
        onDelete={handleDelete}
      />

      <ServerFallbackConfig />

      <ServerModal
        node={editingNode}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveNode}
      />
    </div>
  );
}
