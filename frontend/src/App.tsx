import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  createUser,
  deleteUser,
  getUsers,
  patchUser,
  updateUser,
} from "./pages/services/userApi";

import type {
  User,
  UserFormData,
  UserRole,
} from "./types/user";

import ThemeToggle from "../src/component/ThemeToggle";
import Toast from "../src/component/Toast";
import Modal from "../src/component/Modal";
import UserForm from "../src/component/UserForm";
import UserCard from "../src/component/UserCard";

import "./App.css";

type ToastState = {
  message: string;
  type: "success" | "error";
} | null;

const emptyForm: UserFormData = {
  name: "",
  email: "",
  role: "customer",
};

const App = () => {
  const [users, setUsers] =
    useState<User[]>([]);

  const [formData, setFormData] =
    useState<UserFormData>(emptyForm);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [loadingUsers, setLoadingUsers] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [actionLoadingId, setActionLoadingId] =
    useState<number | null>(null);

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<"all" | UserRole>("all");

  const [darkMode, setDarkMode] =
    useState(() => {
      const savedTheme =
        localStorage.getItem(
          "user-dashboard-theme"
        );

      return savedTheme === "dark";
    });

  const [toast, setToast] =
    useState<ToastState>(null);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [patchTarget, setPatchTarget] =
    useState<User | null>(null);

  const [patchName, setPatchName] =
    useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "user-dashboard-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    if (!toast) {
      return;
    }

    const timer =
      setTimeout(() => {
        setToast(null);
      }, 3000);

    return () => clearTimeout(timer);
  }, [toast]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);

      const data = await getUsers();

      setUsers(data.users);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );

      setToast({
        message: "Failed to fetch users",
        type: "error",
      });
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setToast({
        message: "Name is required",
        type: "error",
      });

      return;
    }

    if (!formData.email.trim()) {
      setToast({
        message: "Email is required",
        type: "error",
      });

      return;
    }

    try {
      setSubmitting(true);

      if (editingId === null) {
        await createUser(formData);

        setToast({
          message:
            "User created successfully",
          type: "success",
        });
      } else {
        await updateUser(
          editingId,
          formData
        );

        setToast({
          message:
            "User updated successfully",
          type: "success",
        });
      }

      await fetchUsers();

      resetForm();
    } catch (error) {
      console.error(
        "Submit error:",
        error
      );

      setToast({
        message:
          "Something went wrong",
        type: "error",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (user: User) => {
    setEditingId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
  };

  const handlePatchOpen = (
    user: User
  ) => {
    setPatchTarget(user);
    setPatchName(user.name);
  };

  const handlePatchSubmit =
    async () => {
      if (!patchTarget) {
        return;
      }

      if (!patchName.trim()) {
        setToast({
          message: "Name cannot be empty",
          type: "error",
        });

        return;
      }

      try {
        setActionLoadingId(
          patchTarget.id
        );

        await patchUser(
          patchTarget.id,
          {
            name: patchName,
          }
        );

        setToast({
          message:
            "User name patched successfully",
          type: "success",
        });

        setPatchTarget(null);
        setPatchName("");

        await fetchUsers();
      } catch (error) {
        console.error(
          "Patch error:",
          error
        );

        setToast({
          message:
            "Failed to patch user",
          type: "error",
        });
      } finally {
        setActionLoadingId(null);
      }
    };

  const handleDelete = (
    id: number
  ) => {
    setDeleteId(id);
  };

  const confirmDelete =
    async () => {
      if (deleteId === null) {
        return;
      }

      try {
        setActionLoadingId(deleteId);

        await deleteUser(deleteId);

        setToast({
          message:
            "User deleted successfully",
          type: "success",
        });

        if (editingId === deleteId) {
          resetForm();
        }

        setDeleteId(null);

        await fetchUsers();
      } catch (error) {
        console.error(
          "Delete error:",
          error
        );

        setToast({
          message:
            "Failed to delete user",
          type: "error",
        });
      } finally {
        setActionLoadingId(null);
      }
    };

  const filteredUsers = useMemo(() => {
    const searchValue =
      search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(searchValue) ||
        user.email
          .toLowerCase()
          .includes(searchValue);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesRole
      );
    });
  }, [
    users,
    search,
    roleFilter,
  ]);

  const adminCount = users.filter(
    (user) => user.role === "admin"
  ).length;

  const customerCount =
    users.filter(
      (user) =>
        user.role === "customer"
    ).length;

  const deleteTarget =
    users.find(
      (user) => user.id === deleteId
    );

  return (
    <div
      className={`app ${
        darkMode ? "dark" : ""
      }`}
    >
      <div className="background-shape shape-one" />
      <div className="background-shape shape-two" />

      <main className="container">
        <header className="header">
          <div className="brand-area">
            <div className="brand-icon">
              U
            </div>

            <div>
              <span className="eyebrow">
                ADMIN DASHBOARD
              </span>

              <h1>
                User Management
              </h1>

              <p>
                Manage users, roles and
                account information.
              </p>
            </div>
          </div>

          <ThemeToggle
            darkMode={darkMode}
            onToggle={() =>
              setDarkMode(
                (previous) =>
                  !previous
              )
            }
          />
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              #
            </div>

            <div>
              <span>Total Users</span>
              <strong>
                {users.length}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              A
            </div>

            <div>
              <span>Admins</span>
              <strong>
                {adminCount}
              </strong>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              C
            </div>

            <div>
              <span>Customers</span>
              <strong>
                {customerCount}
              </strong>
            </div>
          </div>
        </section>

        <UserForm
          formData={formData}
          editingId={editingId}
          loading={submitting}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onCancel={resetForm}
        />

        <section className="users-section">
          <div className="section-header">
            <div>
              <span className="section-label">
                USER DIRECTORY
              </span>

              <h2>
                All Users
              </h2>

              <p>
                {filteredUsers.length}{" "}
                {filteredUsers.length === 1
                  ? "user"
                  : "users"}{" "}
                found
              </p>
            </div>

            <div className="filters">
              <div className="search-wrapper">
                <span className="search-icon">
                  ⌕
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(e) =>
                    setSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search name or email..."
                />

                {search && (
                  <button
                    type="button"
                    className="clear-search"
                    onClick={() =>
                      setSearch("")
                    }
                  >
                    ×
                  </button>
                )}
              </div>

              <select
                className="role-filter"
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(
                    e.target.value as
                      | "all"
                      | UserRole
                  )
                }
              >
                <option value="all">
                  All Roles
                </option>

                <option value="admin">
                  Admin
                </option>

                <option value="customer">
                  Customer
                </option>
              </select>
            </div>
          </div>

          {loadingUsers ? (
            <div className="loading">
              <div className="spinner" />
              <p>
                Loading users...
              </p>
            </div>
          ) : filteredUsers.length >
            0 ? (
            <div className="users-grid">
              {filteredUsers.map(
                (user) => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={
                      handleEdit
                    }
                    onPatch={
                      handlePatchOpen
                    }
                    onDelete={
                      handleDelete
                    }
                    actionLoading={
                      actionLoadingId ===
                      user.id
                    }
                  />
                )
              )}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">
                ◌
              </div>

              <h3>
                {search ||
                roleFilter !== "all"
                  ? "No users found"
                  : "No users yet"}
              </h3>

              <p>
                {search ||
                roleFilter !== "all"
                  ? "Try changing your search or filter."
                  : "Add your first user using the form above."}
              </p>
            </div>
          )}
        </section>
      </main>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() =>
            setToast(null)
          }
        />
      )}

      {deleteTarget && (
        <Modal
          title="Delete User"
          onClose={() =>
            setDeleteId(null)
          }
        >
          <div className="confirm-content">
            <div className="confirm-icon">
              !
            </div>

            <h3>
              Delete{" "}
              {deleteTarget.name}?
            </h3>

            <p>
              This action cannot be
              undone. The user will be
              permanently removed.
            </p>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() =>
                  setDeleteId(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={confirmDelete}
                disabled={
                  actionLoadingId ===
                  deleteId
                }
              >
                {actionLoadingId ===
                deleteId
                  ? "Deleting..."
                  : "Yes, Delete"}
              </button>
            </div>
          </div>
        </Modal>
      )}

      {patchTarget && (
        <Modal
          title="Patch User"
          onClose={() => {
            setPatchTarget(null);
            setPatchName("");
          }}
        >
          <div className="patch-content">
            <p className="modal-description">
              PATCH updates only the
              field you provide.
            </p>

            <div className="form-group">
              <label htmlFor="patchName">
                New Name
              </label>

              <input
                id="patchName"
                type="text"
                value={patchName}
                onChange={(e) =>
                  setPatchName(
                    e.target.value
                  )
                }
              />
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => {
                  setPatchTarget(
                    null
                  );
                  setPatchName("");
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                className="primary-btn"
                onClick={
                  handlePatchSubmit
                }
                disabled={
                  actionLoadingId ===
                  patchTarget.id
                }
              >
                {actionLoadingId ===
                patchTarget.id
                  ? "Updating..."
                  : "Update Name"}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default App;