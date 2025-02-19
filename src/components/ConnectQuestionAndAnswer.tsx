import React, { useState, useRef, useEffect } from 'react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

interface Answer {
  id: number;
  text: string;
}

interface Question {
  id: number;
  question: string;
  answer: number | null;
}

interface Point {
  x: number;
  y: number;
}

interface LinePosition {
  start: Point;
  end: Point;
  questionId: number;
}

const ItemType = 'ANSWER';

const Quiz: React.FC = () => {
  const [questions, setQuestions] = useState<Question[]>([
    { id: 1, question: 'Câu hỏi 1', answer: null },
    { id: 2, question: 'Câu hỏi 2', answer: null },
  ]);

  const [answers] = useState<Answer[]>([
    { id: 1, text: 'Đáp án 1' },
    { id: 2, text: 'Đáp án 2' },
    { id: 3, text: 'Đáp án 3' },
  ]);

  const [lines, setLines] = useState<LinePosition[]>([]);
  const questionRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});
  const answerRefs = useRef<{ [key: number]: HTMLDivElement | null }>({});

  const updateLine = (questionId: number) => {
    const question = questions.find(q => q.id === questionId);
    if (!question || !question.answer) return;

    const questionElement = questionRefs.current[questionId];
    const answerElement = answerRefs.current[question.answer];

    if (questionElement && answerElement) {
      const questionRect = questionElement.getBoundingClientRect();
      const answerRect = answerElement.getBoundingClientRect();
      const containerRect = questionElement.parentElement?.getBoundingClientRect() || new DOMRect();

      const start = {
        x: questionRect.right - containerRect.left,
        y: questionRect.top - containerRect.top + questionRect.height / 2
      };

      const end = {
        x: answerRect.left - containerRect.left,
        y: answerRect.top - containerRect.top + answerRect.height / 2
      };

      setLines(prev => {
        const newLines = prev.filter(l => l.questionId !== questionId);
        return [...newLines, { start, end, questionId }];
      });
    }
  };

  useEffect(() => {
    questions.forEach(question => {
      if (question.answer) {
        updateLine(question.id);
      }
    });
  }, [questions]);

  const moveAnswerToQuestion = (answerId: number, questionId: number) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, answer: answerId } : q
    ));
  };

  const DraggableAnswer: React.FC<{ answer: Answer }> = ({ answer }) => {
    const [{ isDragging }, drag] = useDrag({
      type: ItemType,
      item: { id: answer.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    });

    return (
      <div
        ref={(el) => {
          drag(el);
          answerRefs.current[answer.id] = el;
        }}
        className={`answer ${isDragging ? 'dragging' : ''}`}
      >
        {answer.text}
      </div>
    );
  };

  const DroppableQuestion: React.FC<{ question: Question }> = ({ question }) => {
    const [{ isOver }, drop] = useDrop({
      accept: ItemType,
      drop: (item: { id: number }) => {
        moveAnswerToQuestion(item.id, question.id);
        setTimeout(() => updateLine(question.id), 0);
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    });

    const answer = answers.find(a => a.id === question.answer);

    return (
      <div
        ref={(el) => {
          drop(el);
          questionRefs.current[question.id] = el;
        }}
        className={`question ${isOver ? 'over' : ''} ${answer ? 'has-answer' : ''}`}
      >
        <h3>{question.question}</h3>
        <div className="answer-slot">
          {answer ? answer.text : 'Kéo đáp án vào đây'}
        </div>
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="quiz-container">
        <div className="quiz-content">
          <div className="questions-container">
            {questions.map(question => (
              <DroppableQuestion key={question.id} question={question} />
            ))}
          </div>
          <div className="answers-container">
            {answers.map(answer => (
              <DraggableAnswer key={answer.id} answer={answer} />
            ))}
          </div>
        </div>
        <svg className="connection-lines">
          {lines.map(({ start, end, questionId }) => (
            <line
              key={questionId}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="black"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>
    </DndProvider>
  );
};

export default Quiz;