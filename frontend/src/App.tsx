import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
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

import ThemeToggle from "./component/ThemeToggle";
import Toast from "./component/Toast";
import Modal from "./component/Modal";
import UserForm from "./component/UserForm";
import UserCard from "./component/UserCard";

import "./App.css";


// ==========================================
// Toast Type
// ==========================================

type ToastState = {
  type: "success" | "error";
  message: string;
} | null;


// ==========================================
// Empty Form
// ==========================================

const emptyForm: UserFormData = {
  name: "",
  email: "",
  role: "customer",
};


// ==========================================
// App
// ==========================================

function App() {

  // ==========================================
  // Users
  // ==========================================

  const [users, setUsers] = useState<User[]>([]);


  // ==========================================
  // Form
  // ==========================================

  const [formData, setFormData] =
    useState<UserFormData>(emptyForm);


  // ==========================================
  // Editing User
  // ==========================================

  const [editingId, setEditingId] =
    useState<number | null>(null);


  // ==========================================
  // Loading
  // ==========================================

  const [loading, setLoading] =
    useState(false);

  const [submitting, setSubmitting] =
    useState(false);

  const [actionLoadingId, setActionLoadingId] =
    useState<number | null>(null);


  // ==========================================
  // Search
  // ==========================================

  const [search, setSearch] =
    useState("");


  // ==========================================
  // Role Filter
  // ==========================================

  const [roleFilter, setRoleFilter] =
    useState<"all" | UserRole>("all");


  // ==========================================
  // Dark Mode
  // ==========================================

  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme =
      localStorage.getItem("darkMode");

    return savedTheme === "true";
  });


  // ==========================================
  // Toast
  // ==========================================

  const [toast, setToast] =
    useState<ToastState>(null);


  // ==========================================
  // Delete Modal
  // ==========================================

  const [deleteId, setDeleteId] =
    useState<number | null>(null);


  // ==========================================
  // PATCH Modal
  // ==========================================

  const [patchTarget, setPatchTarget] =
    useState<User | null>(null);

  const [patchName, setPatchName] =
    useState("");


  // ==========================================
  // Fetch Users
  // ==========================================

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data.users);

    } catch (error) {

      console.error(
        "Error fetching users:",
        error
      );

      setToast({
        type: "error",
        message: "Failed to load users",
      });

    } finally {

      setLoading(false);

    }
  }, []);


  // ==========================================
  // Initial API Request
  // ==========================================

  useEffect(() => {

    let ignore = false;

    const loadUsers = async () => {

      try {

        setLoading(true);

        const data = await getUsers();

        if (!ignore) {
          setUsers(data.users);
        }

      } catch (error) {

        if (!ignore) {

          console.error(
            "Error fetching users:",
            error
          );

          setToast({
            type: "error",
            message: "Failed to load users",
          });
        }

      } finally {

        if (!ignore) {
          setLoading(false);
        }

      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };

  }, []);


  // ==========================================
  // Dark Mode
  // ==========================================

  useEffect(() => {

    document.documentElement.classList.toggle(
      "dark",
      darkMode
    );

    localStorage.setItem(
      "darkMode",
      String(darkMode)
    );

  }, [darkMode]);


  // ==========================================
  // Handle Input Change
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {

    const {
      name,
      value,
    } = event.target;

    setFormData(
      (previous: UserFormData) => ({
        ...previous,
        [name]: value,
      })
    );
  };


  // ==========================================
  // Submit Form
  // POST + PUT
  // ==========================================

  const handleSubmit = async (
    event: React.FormEvent
  ) => {

    event.preventDefault();


    // ------------------------------------------
    // Validation
    // ------------------------------------------

    if (!formData.name.trim()) {

      setToast({
        type: "error",
        message: "Please enter a name",
      });

      return;
    }


    if (!formData.email.trim()) {

      setToast({
        type: "error",
        message: "Please enter an email",
      });

      return;
    }


    try {

      setSubmitting(true);


      // ----------------------------------------
      // PUT
      // ----------------------------------------

      if (editingId !== null) {

        await updateUser(
          editingId,
          formData
        );

        setToast({
          type: "success",
          message: "User updated successfully",
        });

      }


      // ----------------------------------------
      // POST
      // ----------------------------------------

      else {

        await createUser(formData);

        setToast({
          type: "success",
          message: "User created successfully",
        });

      }


      // Refresh users

      await fetchUsers();

      // Reset form

      resetForm();

    } catch (error) {

      console.error(
        "Error saving user:",
        error
      );

      setToast({
        type: "error",
        message: "Failed to save user",
      });

    } finally {

      setSubmitting(false);

    }
  };


  // ==========================================
  // Edit User
  // ==========================================

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


  // ==========================================
  // Reset Form
  // ==========================================

  const resetForm = () => {

    setEditingId(null);

    setFormData({
      ...emptyForm,
    });
  };


  // ==========================================
  // Open PATCH Modal
  // ==========================================

  const handlePatch = (user: User) => {

    setPatchTarget(user);

    setPatchName(user.name);
  };


  // ==========================================
  // PATCH User
  // ==========================================

  const handlePatchSubmit = async () => {

    if (!patchTarget) {
      return;
    }


    if (!patchName.trim()) {

      setToast({
        type: "error",
        message: "Please enter a name",
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
        type: "success",
        message: "User patched successfully",
      });


      setPatchTarget(null);

      setPatchName("");


      await fetchUsers();

    } catch (error) {

      console.error(
        "Error patching user:",
        error
      );

      setToast({
        type: "error",
        message: "Failed to patch user",
      });

    } finally {

      setActionLoadingId(null);

    }
  };


  // ==========================================
  // Delete User
  // ==========================================

  const handleDelete = async () => {

    if (deleteId === null) {
      return;
    }


    try {

      setActionLoadingId(deleteId);


      await deleteUser(deleteId);


      setToast({
        type: "success",
        message: "User deleted successfully",
      });


      setDeleteId(null);


      await fetchUsers();

    } catch (error) {

      console.error(
        "Error deleting user:",
        error
      );

      setToast({
        type: "error",
        message: "Failed to delete user",
      });

    } finally {

      setActionLoadingId(null);

    }
  };


  // ==========================================
  // Filter Users
  // ==========================================

  const filteredUsers = useMemo(() => {

    return users.filter((user) => {

      const matchesSearch =
        user.name
          .toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||

        user.email
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );


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


  // ==========================================
  // Counts
  // ==========================================

  const adminCount =
    users.filter(
      (user) => user.role === "admin"
    ).length;


  const customerCount =
    users.filter(
      (user) => user.role === "customer"
    ).length;



  // ==========================================
  // RETURN UI
  // ==========================================

  return (

    <div
      className={
        darkMode
          ? "app dark"
          : "app"
      }
    >


      {/* ========================================
          HEADER
      ======================================== */}

      <header className="app-header">

        <div className="header-content">

          <div>

            <p className="eyebrow">
              SUBSCRIPTION MANAGEMENT
            </p>

            <h1>
              User Management
            </h1>

            <p className="header-description">
              Manage users, roles and account
              information from one place.
            </p>

          </div>


          {/* Theme Toggle */}

          <ThemeToggle
            darkMode={darkMode}
            onToggle={() =>
              setDarkMode(
                (previous) =>
                  !previous
              )
            }
          />

        </div>

      </header>



      {/* ========================================
          MAIN
      ======================================== */}

      <main className="app-main">


        {/* ========================================
            STATS
        ======================================== */}

        <section className="stats-grid">

          <div className="stat-card">

            <span className="stat-label">
              Total Users
            </span>

            <strong className="stat-value">
              {users.length}
            </strong>

          </div>


          <div className="stat-card">

            <span className="stat-label">
              Admins
            </span>

            <strong className="stat-value">
              {adminCount}
            </strong>

          </div>


          <div className="stat-card">

            <span className="stat-label">
              Customers
            </span>

            <strong className="stat-value">
              {customerCount}
            </strong>

          </div>

        </section>



        {/* ========================================
            USER FORM
        ======================================== */}

        <section className="section">

          <UserForm
            formData={formData}
            editingId={editingId}
            loading={submitting}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancel={resetForm}
          />

        </section>



        {/* ========================================
            USERS
        ======================================== */}

        <section className="users-section">


          {/* Section Header */}

          <div className="section-header">

            <div>

              <p className="eyebrow">
                USERS
              </p>

              <h2>
                All Users
              </h2>

            </div>


            <span className="user-count">
              {filteredUsers.length} users
            </span>

          </div>



          {/* ========================================
              SEARCH + FILTER
          ======================================== */}

          <div className="filters">

            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value
                )
              }
              className="search-input"
            />


            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(
                  event.target.value as
                    | "all"
                    | UserRole
                )
              }
              className="role-filter"
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



          {/* ========================================
              LOADING
          ======================================== */}

          {loading ? (

            <div className="loading-state">

              <div className="loader"></div>

              <p>
                Loading users...
              </p>

            </div>

          ) : filteredUsers.length === 0 ? (

            <div className="empty-state">

              <h3>
                No users found
              </h3>

              <p>
                Try changing your search
                or filter.
              </p>

            </div>

          ) : (

            <div className="users-grid">

              {filteredUsers.map(
                (user) => (

                  <UserCard
                    key={user.id}
                    user={user}
                    onEdit={handleEdit}
                    onPatch={handlePatch}
                    onDelete={(id) =>
                      setDeleteId(id)
                    }


                    actionLoading={
                      actionLoadingId ===
                      user.id
                    }
                  />

                )
              )}

            </div>

          )}

        </section>

      </main>



      {/* ========================================
          TOAST
      ======================================== */}

      {toast && (

        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() =>
            setToast(null)
          }
        />

      )}



      {/* ========================================
          DELETE MODAL
      ======================================== */}

      {deleteId !== null && (

        <Modal
          title="Delete User"
          onClose={() =>
            setDeleteId(null)
          }
        >

          <div className="modal-content">

            <p>
              Are you sure you want to
              delete this user?
            </p>

            <p className="modal-warning">
              This action cannot be undone.
            </p>


            <div className="modal-actions">

              <button
                type="button"
                onClick={() =>
                  setDeleteId(null)
                }
                className="btn btn-secondary"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={handleDelete}
                className="btn btn-danger"
                disabled={
                  actionLoadingId ===
                  deleteId
                }
              >

                {actionLoadingId ===
                deleteId
                  ? "Deleting..."
                  : "Delete"}

              </button>

            </div>

          </div>

        </Modal>

      )}



      {/* ========================================
          PATCH MODAL
      ======================================== */}

      {patchTarget && (

        <Modal
          title="Patch User"
          onClose={() => {

            setPatchTarget(null);

            setPatchName("");

          }}
        >

          <div className="modal-content">

            <p>
              Update only the user's name.
            </p>


            <input
              type="text"
              value={patchName}
              onChange={(event) =>
                setPatchName(
                  event.target.value
                )
              }
              placeholder="Enter new name"
              className="modal-input"
            />


            <div className="modal-actions">

              <button
                type="button"
                onClick={() => {

                  setPatchTarget(null);

                  setPatchName("");

                }}
                className="btn btn-secondary"
              >
                Cancel
              </button>


              <button
                type="button"
                onClick={
                  handlePatchSubmit
                }
                className="btn btn-primary"
                disabled={
                  actionLoadingId ===
                  patchTarget.id
                }
              >

                {actionLoadingId ===
                patchTarget.id
                  ? "Updating..."
                  : "Update"}

              </button>

            </div>

          </div>

        </Modal>

      )}

    </div>
  );
}


export default App;