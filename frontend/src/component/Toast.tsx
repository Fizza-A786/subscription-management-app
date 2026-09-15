interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
}

const Toast = ({
  message,
  type,
  onClose,
}: ToastProps) => {
  return (
    <div
      className={`toast ${type}`}
      role="alert"
    >
      <div className="toast-icon">
        {type === "success" ? "✓" : "!"}
      </div>

      <div className="toast-content">
        <strong>
          {type === "success" ? "Success" : "Error"}
        </strong>

        <span>{message}</span>
      </div>

      <button
        type="button"
        className="toast-close"
        onClick={onClose}
        aria-label="Close notification"
      >
        ×
      </button>
    </div>
  );
};

export default Toast;