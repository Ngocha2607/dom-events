import React, { useState } from "react";

function SelectTextAndAddComment() {
  const [selectedText, setSelectedText] = useState("");
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);

  const handleMouseUp = () => {
    const selection = window.getSelection()?.toString().trim();

    console.log("Selection: ", selection);
    
    if (selection) {
      setSelectedText(selection);
      setShowCommentBox(true);
    }
  };

  const handleSubmitComment = () => {
    // Xử lý nhận xét (ví dụ: lưu vào cơ sở dữ liệu, hiển thị trên UI, v.v.)
    console.log("Nhận xét: ", comment);
    alert(`Nhận xét cho "${selectedText}": ${comment}`);
    setComment("");
    setShowCommentBox(false);
  };

  return (
    <div onMouseUp={handleMouseUp} style={{ padding: "20px" }}>
      <h1>Ứng dụng nhận xét văn bản</h1>
      <p>
        Đây là một đoạn văn bản mẫu. Bạn có thể bôi đen đoạn văn bản này để
        nhận xét.
      </p>

      {showCommentBox && (
        <div style={{ marginTop: "10px", border: "1px solid #ccc", padding: "10px" }}>
          <p>Đoạn văn bản bạn đã chọn: <strong>{selectedText}</strong></p>
          <textarea
            value={comment}
            onChange={e => setComment(e?.target?.value)}
            placeholder="Nhập nhận xét của bạn ở đây..."
            rows={4}
            style={{ width: "100%" }}
          />
          <button onClick={handleSubmitComment} style={{ marginTop: "10px" }}>
            Gửi nhận xét
          </button>
        </div>
      )}
    </div>
  );
}

export default SelectTextAndAddComment;
