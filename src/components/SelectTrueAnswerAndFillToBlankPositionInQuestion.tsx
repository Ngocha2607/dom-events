import React, { useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const SelectTrueAnswerAndFillToBlankPositionInQuestion = () => {
  // Câu hỏi và các vị trí trống
  const questionTemplate = "Học React là ____ vui và ____.";
  
  // Đáp án cho các vị trí trống
  const correctAnswers = ["rất", "hấp dẫn"];
  
  // Các từ đáp án có thể chọn
  const [answers, setAnswers] = useState(["rất", "hấp dẫn", "khá", "sáng tạo"]);
  
  // Trạng thái lưu kết quả đã chọn của người dùng
  const [userAnswers, setUserAnswers] = useState(["____", "____"]);

  // Hàm cập nhật đáp án người dùng đã chọn
  const handleSelectAnswer = (index: number, selectedAnswer: string) => {    
    const updatedAnswers = [...userAnswers];
    updatedAnswers[index] = selectedAnswer;
    setUserAnswers(updatedAnswers);

    // Loại bỏ đáp án khỏi hộp đáp án
    setAnswers((prevAnswers) => prevAnswers.filter((answer) => answer !== selectedAnswer));
  };

    // Hàm xử lý khi người dùng thả đáp án vào khu vực trống
    const handleDropAnswer = (index: number, selectedAnswer: string) => {

        console.log(index, selectedAnswer);

        if (userAnswers[index] !== "____") return; // Nếu đã có đáp án, không cho chọn lại
    
        const updatedAnswers = [...userAnswers];
        updatedAnswers[index] = selectedAnswer;

        console.log(updatedAnswers);
        
        setUserAnswers(updatedAnswers);
    
        // Loại bỏ đáp án đã chọn khỏi hộp đáp án
        setAnswers((prevAnswers) => prevAnswers.filter((answer) => answer !== selectedAnswer));
      };

  // Kiểm tra kết quả người dùng đã điền đúng hay chưa
  const checkResult = () => {
    return userAnswers.every((answer, index) => answer === correctAnswers[index]);
  };

    // Hàm để tạo câu hỏi với các đáp án điền vào
    const generateQuestionWithAnswers = () => {
        let question = questionTemplate;
        userAnswers.forEach((answer) => {
          question = question.replace("____", answer);
        });
        return question;
      };
      
  return (
    <DndProvider backend={HTML5Backend}>
    <div style={{ padding: "20px" }}>
      <h1>Trắc nghiệm điền từ vào chỗ trống</h1>
      <p><strong>Câu hỏi:</strong> {generateQuestionWithAnswers()}</p>
      

      <div style={{ marginTop: "20px" }}>
        <h3>Chọn từ đúng từ hộp đáp án:</h3>
        <div>
          {answers.map((answer, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(userAnswers.indexOf("____"), answer)}
              style={{
                marginRight: "10px",
                padding: "5px 10px",
                backgroundColor: "#f0f0f0",
                border: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              {answer}
            </button>
          ))}
        </div>
      </div>
      <div style={{ marginTop: "20px" }}>
          <h3>Chọn từ đúng từ hộp đáp án:</h3>
          <div>
            {answers.map((answer, index) => (
              <DraggableAnswer key={index} answer={answer} />
            ))}
          </div>
        </div>

        <div style={{ marginTop: "20px" }}>
          <h3>Thả đáp án vào các vị trí trống:</h3>
          <div>
            {userAnswers.map((answer, index) => (
              <DropZone key={index} index={userAnswers.indexOf("____")} onDrop={handleDropAnswer}>
              {answer === "____" ? "____" : answer}
            </DropZone>
            ))}
          </div>
        </div>

      <div style={{ marginTop: "20px" }}>
        <button
          onClick={() => alert(checkResult() ? "Chúc mừng bạn đã điền đúng!" : "Còn sai, hãy thử lại!")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            cursor: "pointer",
          }}
        >
          Kiểm tra kết quả
        </button>
      </div>
    </div>
    </DndProvider>
  );
};

interface DraggableAnswerProps {
    answer: string;
  }
  
  const DraggableAnswer: React.FC<DraggableAnswerProps> = ({ answer }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
      type: "ANSWER",
      item: { answer },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
    }));
  
    return (
      <div
        ref={drag}
        style={{
          marginRight: "10px",
          padding: "5px 10px",
          backgroundColor: isDragging ? "#f0f0f0" : "#e0e0e0",
          border: "1px solid #ccc",
          cursor: "move",
        }}
      >
        {answer}
      </div>
    );
  };

  // Type for drop zone props
interface DropZoneProps {
    index: number;
    onDrop: (index: number, selectedAnswer: string) => void;
    children: string;
  }
const DropZone: React.FC<DropZoneProps> = ({ index, onDrop, children }) => {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "ANSWER",
    drop: (item: { answer: string }) => {onDrop(index, item.answer); console.log(item, "1212");
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  return (
    <div
      ref={drop}
      style={{
        display: "inline-block",
        width: "100px",
        height: "30px",
        border: "1px dashed #ccc",
        marginRight: "10px",
        textAlign: "center",
        lineHeight: "30px",
        backgroundColor: isOver ? "#e0e0e0" : "#f9f9f9",
      }}
    >
      {children}
    </div>
  );
};
export default SelectTrueAnswerAndFillToBlankPositionInQuestion;
