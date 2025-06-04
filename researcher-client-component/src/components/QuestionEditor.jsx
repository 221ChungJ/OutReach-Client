import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';

function QuestionEditor({ initialQuestions = [], onQuestionsChange }) {
  const [questions, setQuestions] = useState(
    initialQuestions.map(q => typeof q === 'string' ? { question: q, rationale: '' } : q)
  );
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    rationale: ''
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => `question-${item.question || item}` === active.id);
        const newIndex = items.findIndex((item) => `question-${item.question || item}` === over.id);
        const newItems = arrayMove(items, oldIndex, newIndex);
        if (onQuestionsChange) onQuestionsChange(newItems.map(q => q.question || q));
        return newItems;
      });
    }
  };

  const handleAddQuestion = () => {
    if (newQuestion.question.trim()) {
      const updatedQuestions = [...questions, { ...newQuestion }];
      setQuestions(updatedQuestions);
      setNewQuestion({
        question: '',
        rationale: ''
      });
      if (onQuestionsChange) onQuestionsChange(updatedQuestions.map(q => q.question));
    }
  };

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
    if (onQuestionsChange) onQuestionsChange(updatedQuestions.map(q => q.question));
  };

  const handleQuestionEdit = (index, updatedQuestion) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = updatedQuestion;
    setQuestions(updatedQuestions);
    if (onQuestionsChange) onQuestionsChange(updatedQuestions.map(q => q.question));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddQuestion();
    }
  };

  return (
    <div className="">
      <h2>Edit Questions</h2>
      
      <div className="form-group">
        <div className="question-fields">
          <div className="question-field">
            <label>New Question:</label>
            <textarea
              value={newQuestion.question}
              onChange={(e) => setNewQuestion(prev => ({ ...prev, question: e.target.value }))}
              onKeyPress={handleKeyPress}
              placeholder="Type new question here..."
              className="question-input"
              rows="3"
            />
          </div>
          <div className="question-field">
            <label>Rationale:</label>
            <textarea
              value={newQuestion.rationale}
              onChange={(e) => setNewQuestion(prev => ({ ...prev, rationale: e.target.value }))}
              placeholder="Why is this question important?"
              className="question-input"
              rows="2"
            />
          </div>
        </div>
        <button 
          onClick={handleAddQuestion} 
          className="add-button"
          disabled={!newQuestion.question.trim()}
        >
          Add Question
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={questions.map(q => `question-${q.question || q}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="questions-list">
            {questions.map((question, index) => (
              <SortableItem
                key={`question-${question.question || question}`}
                id={`question-${question.question || question}`}
                value={question}
                onEdit={(newValue) => handleQuestionEdit(index, newValue)}
                onRemove={() => handleRemoveQuestion(index)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}

export default QuestionEditor;
