import type {
  ChangeEvent,
  FormEvent,
} from "react";

import type {
  UserFormData,
} from "../types/user";

interface UserFormProps {
  formData: UserFormData;
  editingId: number | null;
  loading: boolean;
  onChange: (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => void;
  onSubmit: (
    e: FormEvent<HTMLFormElement>
  ) => void;
  onCancel: () => void;
}

const UserForm = ({
  formData,
  editingId,
  loading,
  onChange,
  onSubmit,
  onCancel,
}: UserFormProps) => {
  const isEditing =
    editingId !== null;

  return (
    <section className="form-card">
      <div className="card-header">
        <div>
          <span className="section-label">
            {isEditing
              ? "UPDATE USER"
              : "NEW USER"}
          </span>

          <h2>
            {isEditing
              ? "Edit User"
              : "Add New User"}
          </h2>

          <p>
            {isEditing
              ? "Update the user's information."
              : "Create a new user account."}
          </p>
        </div>

        {isEditing && (
          <span className="edit-badge">
            Editing #{editingId}
          </span>
        )}
      </div>

      <form onSubmit={onSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="name">
              Full Name
            </label>

            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={onChange}
              placeholder="e.g. Ali Ahmed"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">
              Email Address
            </label>

            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={onChange}
              placeholder="e.g. ali@gmail.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="role">
              Role
            </label>

            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={onChange}
            >
              <option value="customer">
                Customer
              </option>

              <option value="admin">
                Admin
              </option>
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="primary-btn"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isEditing
              ? "Save Changes"
              : "Add User"}
          </button>

          {isEditing && (
            <button
              type="button"
              className="secondary-btn"
              onClick={onCancel}
              disabled={loading}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
};

export default UserForm;