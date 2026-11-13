import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, GripVertical, ListOrdered } from 'lucide-react';

export default function DragOrder({ question, currentOrder = [], onChange, disabled = false }) {
  const items = question.items || [];

  // currentOrder is an array of original indices e.g. [2, 0, 3, 1]
  // Initialize if empty
  const [order, setOrder] = useState(() => {
    if (Array.isArray(currentOrder) && currentOrder.length === items.length) {
      return currentOrder;
    }
    return items.map((_, i) => i);
  });

  const [draggedIdx, setDraggedIdx] = useState(null);

  useEffect(() => {
    if (Array.isArray(currentOrder) && currentOrder.length === items.length) {
      setOrder(currentOrder);
    }
  }, [currentOrder, items.length]);

  const updateOrder = (newOrder) => {
    setOrder(newOrder);
    onChange(newOrder);
  };

  const moveItem = (fromIdx, toIdx) => {
    if (disabled) return;
    if (toIdx < 0 || toIdx >= order.length) return;
    const copy = [...order];
    const [moved] = copy.splice(fromIdx, 1);
    copy.splice(toIdx, 0, moved);
    updateOrder(copy);
  };

  // Drag and Drop handlers
  const handleDragStart = (e, index) => {
    if (disabled) return;
    setDraggedIdx(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (disabled || draggedIdx === null || draggedIdx === index) return;
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetIdx) => {
    e.preventDefault();
    if (disabled || draggedIdx === null) return;
    moveItem(draggedIdx, targetIdx);
    setDraggedIdx(null);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-800 leading-snug">
          {question.question}
        </div>
        <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200 flex-shrink-0 ml-2">
          <ListOrdered className="w-3.5 h-3.5" /> Drag or use arrows to order
        </span>
      </div>

      <p className="text-xs text-slate-500">
        Arrange the sequence into the correct logical or chronological order (top is first):
      </p>

      <div className="space-y-2">
        {order.map((itemOriginalIndex, pos) => {
          const itemText = items[itemOriginalIndex];
          const isDragging = draggedIdx === pos;

          return (
            <div
              key={itemOriginalIndex}
              draggable={!disabled}
              onDragStart={(e) => handleDragStart(e, pos)}
              onDragOver={(e) => handleDragOver(e, pos)}
              onDrop={(e) => handleDrop(e, pos)}
              className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 bg-white ${
                isDragging ? 'opacity-40 border-dashed border-brand-500' : 'border-slate-200/90 shadow-sm hover:border-slate-300'
              } ${disabled ? 'cursor-not-allowed' : 'cursor-grab active:cursor-grabbing'}`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <GripVertical className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {pos + 1}
                </span>
                <span className="text-xs font-medium text-slate-800 leading-relaxed truncate sm:whitespace-normal">
                  {itemText}
                </span>
              </div>

              {/* Accessible Reorder Arrow Controls */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  type="button"
                  disabled={disabled || pos === 0}
                  onClick={() => moveItem(pos, pos - 1)}
                  className="p-1 text-slate-400 hover:text-brand-600 disabled:opacity-20 hover:bg-slate-50 rounded"
                  title="Move Up"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={disabled || pos === order.length - 1}
                  onClick={() => moveItem(pos, pos + 1)}
                  className="p-1 text-slate-400 hover:text-brand-600 disabled:opacity-20 hover:bg-slate-50 rounded"
                  title="Move Down"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
