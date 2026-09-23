const UserCard = ({ user, onEdit, onPatch, onDelete, actionLoading, }) => {
    const firstLetter = user.name.trim().charAt(0).toUpperCase();
    return (<article className="user-card">
      {/* User information */}
      <div className="user-top">
        <div className="avatar">
          {firstLetter || "U"}
        </div>

        <div className="user-info">
          <div className="name-row">
            <h3>{user.name}</h3>

            <span className={`role-badge ${user.role}`}>
              {user.role}
            </span>
          </div>

          <p>{user.email}</p>
        </div>
      </div>

      {/* User metadata */}
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

      {/* Actions */}
      <div className="user-actions">
        <button type="button" className="edit-btn" onClick={() => onEdit(user)} disabled={actionLoading}>
          {actionLoading ? "..." : "Edit"}
        </button>

        <button type="button" className="patch-btn" onClick={() => onPatch(user)} disabled={actionLoading}>
          Patch
        </button>

        <button type="button" className="delete-btn" onClick={() => onDelete(user.id)} disabled={actionLoading}>
          Delete
        </button>
      </div>
    </article>);
};
export default UserCard;
