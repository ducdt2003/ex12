import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  isFirst,
  isLast,
  onPageChange,
}) => {
  // Tạo mảng số trang [0, 1, 2...] dựa trên totalPages nhận được
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i);

  return (
    <div
      className="pagination"
      style={{
        display: "flex",
        gap: "8px",
        justifyContent: "center",
        marginTop: "20px",
      }}
    >
      {/* Nút Trước */}
      <button
        disabled={isFirst}
        onClick={() => onPageChange(currentPage - 1)}
        style={{
          padding: "6px 12px",
          cursor: isFirst ? "not-allowed" : "pointer",
        }}
      >
        Trước
      </button>

      {/* Danh sách các số trang */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          onClick={() => onPageChange(number)}
          style={{
            padding: "6px 12px",
            backgroundColor: currentPage === number ? "#007bff" : "#fff",
            color: currentPage === number ? "#fff" : "#000",
            border: "1px solid #ccc",
            fontWeight: currentPage === number ? "bold" : "normal",
            cursor: "pointer",
          }}
        >
          {number + 1}{" "}
          {/* Hiển thị trang bắt đầu từ 1 cho người dùng dễ nhìn */}
        </button>
      ))}

      {/* Nút Sau */}
      <button
        disabled={isLast}
        onClick={() => onPageChange(currentPage + 1)}
        style={{
          padding: "6px 12px",
          cursor: isLast ? "not-allowed" : "pointer",
        }}
      >
        Sau
      </button>
    </div>
  );
};

export default Pagination;
