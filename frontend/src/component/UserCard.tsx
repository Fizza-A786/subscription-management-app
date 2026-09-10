import type { User } from "../types/user";

interface UserCardProps {
  user: User;
  onEdit: (user: User) => void;
  onPatch: (user: User) => void;
  onDelete: (id: number) => void;
  actionLoading: boolean;
}

const UserCard = ({
  user,
  onEdit,
  onPatch,
  onDelete,
  actionLoading,
}: UserCardProps) => {
  const firstLetter =
    user.name.charAt(0).toUpperCase();

  return (
    <article className="user-card">
      <div className="user-top">
        <div className="avatar">
          {firstLetter}
        </div>

        <div className="user-info">
          <div className="name-row">
            <h3>{user.name}</h3>

            <span
              className={`role-badge ${user.role}`}
            >
              {user.role}
            </span>
          </div>

          <p>{user.email}</p>
        </div>
      </div>

      <div className="user-meta">
        <div>
          <span>User ID</span>
          <strong>#{user.id}</strong>
        </div>

        <div>
          <span>Status</span>
          <strong className="active-status">
            Active
          </strong>
        </div>
      </div>

      <div className="user-actions">
        <button
          type="button"
          className="edit-btn"
          onClick={() => onEdit(user)}
          disabled={actionLoading}
        >
          Edit
        </button>

        <button
          type="button"
          className="patch-btn"
          onClick={() => onPatch(user)}
          disabled={actionLoading}
        >
          Patch
        </button>

        <button
          type="button"
          className="delete-btn"
          onClick={() => onDelete(user.id)}
          disabled={actionLoading}
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default UserCard;