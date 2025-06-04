import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, value, onEdit, onRemove }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleQuestionChange = (newQuestion) => {
    onEdit({
      ...value,
      question: newQuestion
    });
  };

  const handleRationaleChange = (newRationale) => {
    onEdit({
      ...value,
      rationale: newRationale
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`question-item ${isDragging ? 'dragging' : ''}`}
      {...attributes}
    >
      <div className="question-content">
        <span className="drag-handle" {...listeners}>⋮⋮</span>
        <div className="question-fields">
          <div className="question-field">
            <label>Question:</label>
            <textarea
              value={value.question || value}
              onChange={(e) => handleQuestionChange(e.target.value)}
              className="question-input"
              rows="3"
            />
          </div>
          <div className="question-field">
            <label>Rationale:</label>
            <textarea
              value={value.rationale || ''}
              onChange={(e) => handleRationaleChange(e.target.value)}
              className="question-input"
              rows="2"
              placeholder="Why is this question important?"
            />
          </div>
        </div>
        <button
          onClick={onRemove}
          className="remove-button"
        >
          ×
        </button>
      </div>
    </div>
  );
} 