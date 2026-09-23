const UserForm = ({ formData, editingId, loading, onChange, onSubmit, onCancel, }) => {
    const isEditing = editingId !== null;
    return (<section className="form-card">
      <div className="form-heading">
        <div>
          <span className="section-label">
            {isEditing ? "UPDATE USER" : "NEW USER"}
          </span>

          <h2>
            {isEditing
            ? "Edit User"
            : "Add New User"}
          </h2>

          <p>
            {isEditing
            ? "Update the user's information below."
            : "Create a new user and add them to your system."}
          </p>
        </div>

        {isEditing && (<span className="editing-badge">
            Editing #{editingId}
          </span>)}
      </div>

      <form className="user-form" onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Full Name
          </label>

          <input id="name" name="name" type="text" value={formData.name} onChange={onChange} placeholder="Enter full name" autoComplete="name" disabled={loading}/>
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email Address
          </label>

          <input id="email" name="email" type="email" value={formData.email} onChange={onChange} placeholder="Enter email address" autoComplete="email" disabled={loading}/>
        </div>

        <div className="form-group">
          <label htmlFor="role">
            Role
          </label>

          <select id="role" name="role" value={formData.role} onChange={onChange} disabled={loading}>
            <option value="customer">
              Customer
            </option>

            <option value="admin">
              Admin
            </option>
          </select>
        </div>

        <div className="form-actions">
          <button type="submit" className="primary-btn" disabled={loading}>
            {loading
            ? "Saving..."
            : isEditing
                ? "Save Changes"
                : "Add User"}
          </button>

          {isEditing && (<button type="button" className="secondary-btn" onClick={onCancel} disabled={loading}>
              Cancel
            </button>)}
        </div>
      </form>
    </section>);
};
export default UserForm;
