import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";

import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./component/Login";
import Signup from "./component/Signup";
import ProtectedRoute from "./component/ProtectedRoute";

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

import Modal from "./component/Modal";
import Toast from "./component/Toast";

import "./App.css";

interface ToastState {
  message: string;
  type: "success" | "error";
}

const initialFormData: UserFormData = {
  name: "",
  email: "",
  role: "customer",
};

function App() {
  /* =========================================
     STATE
     ========================================= */

  const [users, setUsers] = useState<User[]>([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [actionLoadingId, setActionLoadingId] =
    useState<number | null>(null);

  const [formData, setFormData] =
    useState<UserFormData>(initialFormData);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [formModalOpen, setFormModalOpen] =
    useState(false);

  const [deleteId, setDeleteId] =
    useState<number | null>(null);

  const [patchTarget, setPatchTarget] =
    useState<User | null>(null);

  const [patchName, setPatchName] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [roleFilter, setRoleFilter] =
    useState<"all" | UserRole>("all");

  const [activePage, setActivePage] =
    useState("Dashboard");

  const [darkMode, setDarkMode] =
    useState(() => {
      const savedTheme =
        localStorage.getItem("theme");

      return savedTheme !== "light";
    });

  const [toast, setToast] =
    useState<ToastState | null>(null);

  /* =========================================
     TOAST
     ========================================= */

  const showToast = (
    message: string,
    type: "success" | "error"
  ) => {
    setToast({
      message,
      type,
    });

    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  /* =========================================
     FETCH USERS
     ========================================= */

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const data = await getUsers();

      setUsers(data);
    } catch (error) {
      console.error(
        "Error fetching users:",
        error
      );

      showToast(
        "Unable to load users.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================================
     DARK / LIGHT MODE
     ========================================= */

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "dark"
      );
    } else {
      document.documentElement.classList.remove(
        "dark"
      );

      localStorage.setItem(
        "theme",
        "light"
      );
    }
  }, [darkMode]);

  /* =========================================
     FORM CHANGE
     ========================================= */

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =========================================
     OPEN ADD MODAL
     ========================================= */

  const openAddModal = () => {
    setEditingId(null);

    setFormData({
      ...initialFormData,
    });

    setFormModalOpen(true);
  };

  /* =========================================
     OPEN EDIT MODAL
     ========================================= */

  const openEditModal = (user: User) => {
    setEditingId(user.id);

    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    setFormModalOpen(true);
  };

  /* =========================================
     CLOSE FORM MODAL
     ========================================= */

  const closeFormModal = () => {
    if (saving) return;

    setFormModalOpen(false);

    setEditingId(null);

    setFormData({
      ...initialFormData,
    });
  };

  /* =========================================
     ADD / UPDATE USER
     ========================================= */

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const name =
      formData.name.trim();

    const email =
      formData.email.trim();

    if (!name || !email) {
      showToast(
        "Please fill in all required fields.",
        "error"
      );

      return;
    }

    try {
      setSaving(true);

      /* UPDATE USER */

      if (editingId !== null) {
        const updatedUser =
          await updateUser(
            editingId,
            {
              ...formData,
              name,
              email,
            }
          );

        setUsers((previous) =>
          previous.map((user) =>
            user.id === editingId
              ? updatedUser
              : user
          )
        );

        showToast(
          "User updated successfully.",
          "success"
        );
      }

      /* CREATE USER */

      else {
        const newUser =
          await createUser({
            ...formData,
            name,
            email,
          });

        setUsers((previous) => [
          newUser,
          ...previous,
        ]);

        showToast(
          "User created successfully.",
          "success"
        );
      }

      setFormModalOpen(false);

      setEditingId(null);

      setFormData({
        ...initialFormData,
      });
    } catch (error) {
      console.error(
        "Error saving user:",
        error
      );

      showToast(
        "Unable to save user. Please try again.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     PATCH
     ========================================= */

  const openPatchModal = (user: User) => {
    setPatchTarget(user);

    setPatchName(user.name);
  };

  const closePatchModal = () => {
    if (actionLoadingId !== null) {
      return;
    }

    setPatchTarget(null);

    setPatchName("");
  };

  const handlePatchSubmit =
    async () => {
      if (!patchTarget) {
        return;
      }

      const name =
        patchName.trim();

      if (!name) {
        showToast(
          "Name cannot be empty.",
          "error"
        );

        return;
      }

      try {
        setActionLoadingId(
          patchTarget.id
        );

        const updatedUser =
          await patchUser(
            patchTarget.id,
            {
              name,
            }
          );

        setUsers((previous) =>
          previous.map((user) =>
            user.id === patchTarget.id
              ? updatedUser
              : user
          )
        );

        showToast(
          "User updated successfully.",
          "success"
        );

        setPatchTarget(null);

        setPatchName("");
      } catch (error) {
        console.error(
          "Error patching user:",
          error
        );

        showToast(
          "Unable to update user.",
          "error"
        );
      } finally {
        setActionLoadingId(null);
      }
    };

  /* =========================================
     DELETE
     ========================================= */

  const openDeleteModal = (
    id: number
  ) => {
    setDeleteId(id);
  };

  const closeDeleteModal = () => {
    if (actionLoadingId !== null) {
      return;
    }

    setDeleteId(null);
  };

  const confirmDelete =
    async () => {
      if (deleteId === null) {
        return;
      }

      try {
        setActionLoadingId(deleteId);

        await deleteUser(deleteId);

        setUsers((previous) =>
          previous.filter(
            (user) =>
              user.id !== deleteId
          )
        );

        showToast(
          "User deleted successfully.",
          "success"
        );

        setDeleteId(null);
      } catch (error) {
        console.error(
          "Error deleting user:",
          error
        );

        showToast(
          "Unable to delete user.",
          "error"
        );
      } finally {
        setActionLoadingId(null);
      }
    };

  /* =========================================
     SEARCH + FILTER
     ========================================= */

  const filteredUsers =
    useMemo(() => {
      const searchValue =
        search
          .toLowerCase()
          .trim();

      return users.filter(
        (user) => {
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
        }
      );
    }, [
      users,
      search,
      roleFilter,
    ]);

  /* =========================================
     STATISTICS
     ========================================= */

  const totalUsers =
    users.length;

  const adminCount =
    users.filter(
      (user) =>
        user.role === "admin"
    ).length;

  const customerCount =
    users.filter(
      (user) =>
        user.role === "customer"
    ).length;

  /* =========================================
     RECENT USERS
     ========================================= */

  const recentUsers =
    users.slice(0, 5);

  /* =========================================
     DELETE USER DATA
     ========================================= */

  const deleteUserData =
    users.find(
      (user) =>
        user.id === deleteId
    );

  /* =========================================
     SIDEBAR PAGE CLICK
     ========================================= */

  const handlePageChange = (
    page: string
  ) => {
    setActivePage(page);

    if (page === "Users") {
      document
        .getElementById(
          "users-section"
        )
        ?.scrollIntoView({
          behavior: "smooth",
        });
    }
  };

  /* =========================================
     RENDER
     ========================================= */

  return (
    <Routes>

      {/* =====================================
          LOGIN
          ===================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* =====================================
          SIGNUP
          ===================================== */}

      <Route
        path="/signup"
        element={<Signup />}
      />

      {/* =====================================
          PROTECTED DASHBOARD
          ===================================== */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <div
              className={`app ${
                darkMode
                  ? "dark"
                  : "light"
              }`}
            >

              {/* =====================================
                  SIDEBAR
                  ===================================== */}

              <aside className="sidebar">

                <div className="sidebar-top">

                  {/* LOGO */}

                  <div className="brand">

                    <div className="brand-mark">
                      ✦
                    </div>

                    <div className="brand-text">

                      <strong>
                        UserFlow
                      </strong>

                      <span>
                        SaaS Platform
                      </span>

                    </div>

                  </div>

                  {/* MAIN NAVIGATION */}

                  <nav className="sidebar-nav">

                    <div className="nav-group">

                      <span className="nav-label">
                        MAIN
                      </span>

                      <button
                        type="button"
                        className={`nav-item ${
                          activePage ===
                          "Dashboard"
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handlePageChange(
                            "Dashboard"
                          )
                        }
                      >

                        <span className="nav-icon">
                          ▦
                        </span>

                        <span>
                          Dashboard
                        </span>

                      </button>

                      <button
                        type="button"
                        className={`nav-item ${
                          activePage ===
                          "Users"
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handlePageChange(
                            "Users"
                          )
                        }
                      >

                        <span className="nav-icon">
                          ♙
                        </span>

                        <span>
                          Users
                        </span>

                        <span className="nav-count">
                          {totalUsers}
                        </span>

                      </button>

                      <button
                        type="button"
                        className={`nav-item ${
                          activePage ===
                          "Settings"
                            ? "active"
                            : ""
                        }`}
                        onClick={() =>
                          handlePageChange(
                            "Settings"
                          )
                        }
                      >

                        <span className="nav-icon">
                          ⚙
                        </span>

                        <span>
                          Settings
                        </span>

                        <span className="nav-arrow">
                          ›
                        </span>

                      </button>

                    </div>

                    <div className="nav-group">

                      <span className="nav-label">
                        OTHERS
                      </span>

                      <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                          showToast(
                            "Components section is coming soon.",
                            "success"
                          )
                        }
                      >

                        <span className="nav-icon">
                          ◈
                        </span>

                        <span>
                          Components
                        </span>

                      </button>

                      <button
                        type="button"
                        className="nav-item"
                        onClick={() =>
                          showToast(
                            "Blocks section is coming soon.",
                            "success"
                          )
                        }
                      >

                        <span className="nav-icon">
                          ▤
                        </span>

                        <span>
                          Blocks
                        </span>

                      </button>

                    </div>

                  </nav>

                </div>

                {/* SIDEBAR FOOTER */}

                <div className="sidebar-footer">

                  <div className="sidebar-status">

                    <span className="status-dot"></span>

                    <span>
                      API Connected
                    </span>

                  </div>

                  <div className="sidebar-user">

                    <div className="profile-avatar">
                      F
                    </div>

                    <div className="profile-info">

                      <strong>
                        Admin
                      </strong>

                      <span>
                        Manage account
                      </span>

                    </div>

                    <span className="profile-more">
                      ⋮
                    </span>

                  </div>

                </div>

              </aside>

              {/* =====================================
                  MAIN AREA
                  ===================================== */}

              <div className="main-area">

                {/* TOPBAR */}

                <header className="topbar">

                  <div className="topbar-left">

                    <div className="mobile-brand">

                      <div className="brand-mark">
                        ✦
                      </div>

                      <strong>
                        UserFlow
                      </strong>

                    </div>

                    <div className="search-box">

                      <span>
                        ⌕
                      </span>

                      <input
                        type="text"
                        placeholder="Search"
                        value={search}
                        onChange={(event) =>
                          setSearch(
                            event.target.value
                          )
                        }
                      />

                      <kbd>
                        ⌘ K
                      </kbd>

                    </div>

                  </div>

                  <div className="topbar-actions">

                    <button
                      type="button"
                      className="topbar-icon"
                      onClick={() =>
                        setDarkMode(
                          (previous) =>
                            !previous
                        )
                      }
                      title={
                        darkMode
                          ? "Light mode"
                          : "Dark mode"
                      }
                    >
                      {darkMode
                        ? "☀"
                        : "☾"}
                    </button>

                    <button
                      type="button"
                      className="topbar-icon"
                      onClick={() =>
                        showToast(
                          "No new notifications.",
                          "success"
                        )
                      }
                    >
                      ◌
                    </button>

                    <div className="topbar-avatar">
                      F
                    </div>

                  </div>

                </header>

                {/* CONTENT */}

                <main className="dashboard">

                  {/* HEADER */}

                  <section className="dashboard-heading">

                    <div>

                      <h1>
                        Dashboard
                      </h1>

                      <p>
                        Welcome back! Here's
                        what's happening with
                        your users.
                      </p>

                    </div>

                    <button
                      type="button"
                      className="add-user-button"
                      onClick={
                        openAddModal
                      }
                    >
                      <span>
                        ＋
                      </span>

                      Add User
                    </button>

                  </section>

                  {/* STATS */}

                  <section className="stats-grid">

                    <div className="stat-card">

                      <div className="stat-top">

                        <span>
                          Total Users
                        </span>

                        <div className="stat-icon purple">
                          ♙
                        </div>

                      </div>

                      <strong>
                        {totalUsers}
                      </strong>

                      <p>

                        <span className="growth">
                          ↗
                        </span>

                        All registered
                        users

                      </p>

                    </div>

                    <div className="stat-card">

                      <div className="stat-top">

                        <span>
                          Active Users
                        </span>

                        <div className="stat-icon blue">
                          ◉
                        </div>

                      </div>

                      <strong>
                        {customerCount}
                      </strong>

                      <p>

                        <span className="growth">
                          ↗
                        </span>

                        Customer accounts

                      </p>

                    </div>

                    <div className="stat-card">

                      <div className="stat-top">

                        <span>
                          Administrators
                        </span>

                        <div className="stat-icon purple">
                          ✦
                        </div>

                      </div>

                      <strong>
                        {adminCount}
                      </strong>

                      <p>

                        <span className="growth">
                          ↗
                        </span>

                        Admin accounts

                      </p>

                    </div>

                    <div className="stat-card">

                      <div className="stat-top">

                        <span>
                          Customer Rate
                        </span>

                        <div className="stat-icon green">
                          ↗
                        </div>

                      </div>

                      <strong>
                        {totalUsers
                          ? Math.round(
                              (customerCount /
                                totalUsers) *
                                100
                            )
                          : 0}
                        %
                      </strong>

                      <p>

                        <span className="growth">
                          ↗
                        </span>

                        Of total users

                      </p>

                    </div>

                  </section>

                  {/* RECENT USERS + QUICK ACTIONS */}

                  <section className="middle-grid">

                    {/* RECENT USERS */}

                    <div className="panel recent-panel">

                      <div className="panel-header">

                        <div>

                          <h2>
                            Recent Users
                          </h2>

                          <p>
                            Latest users in
                            your system
                          </p>

                        </div>

                        <button
                          type="button"
                          className="view-all"
                          onClick={() =>
                            handlePageChange(
                              "Users"
                            )
                          }
                        >
                          View all
                        </button>

                      </div>

                      <div className="recent-users">

                        {loading ? (

                          <div className="panel-loading">

                            <div className="spinner"></div>

                            Loading users...

                          </div>

                        ) : recentUsers.length ===
                          0 ? (

                          <div className="panel-empty">
                            No users yet.
                          </div>

                        ) : (

                          recentUsers.map(
                            (user) => (

                              <div
                                className="recent-user"
                                key={user.id}
                              >

                                <div
                                  className={`user-avatar avatar-${
                                    (user.id % 5) +
                                    1
                                  }`}
                                >
                                  {user.name
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div className="recent-user-info">

                                  <strong>
                                    {user.name}
                                  </strong>

                                  <span>
                                    {user.email}
                                  </span>

                                </div>

                                <div className="recent-user-status">

                                  <span
                                    className={`role-pill ${user.role}`}
                                  >
                                    {user.role}
                                  </span>

                                  <span className="active-pill">
                                    Active
                                  </span>

                                </div>

                              </div>

                            )
                          )

                        )}

                      </div>

                    </div>

                    {/* QUICK ACTIONS */}

                    <div className="panel quick-panel">

                      <div className="panel-header">

                        <div>

                          <h2>
                            Quick Actions
                          </h2>

                          <p>
                            Common actions
                          </p>

                        </div>

                      </div>

                      <div className="quick-actions">

                        <button
                          type="button"
                          className="quick-action primary"
                          onClick={
                            openAddModal
                          }
                        >

                          <span>
                            ♙
                          </span>

                          <strong>
                            Add New User
                          </strong>

                          <b>
                            →
                          </b>

                        </button>

                        <button
                          type="button"
                          className="quick-action"
                          onClick={() =>
                            handlePageChange(
                              "Users"
                            )
                          }
                        >

                          <span>
                            ▥
                          </span>

                          <strong>
                            View Users
                          </strong>

                          <b>
                            →
                          </b>

                        </button>

                        <button
                          type="button"
                          className="quick-action"
                          onClick={() =>
                            showToast(
                              "Analytics are coming soon.",
                              "success"
                            )
                          }
                        >

                          <span>
                            ◒
                          </span>

                          <strong>
                            View Analytics
                          </strong>

                          <b>
                            →
                          </b>

                        </button>

                        <button
                          type="button"
                          className="quick-action"
                          onClick={() =>
                            showToast(
                              "Settings are coming soon.",
                              "success"
                            )
                          }
                        >

                          <span>
                            ⚙
                          </span>

                          <strong>
                            Settings
                          </strong>

                          <b>
                            →
                          </b>

                        </button>

                      </div>

                    </div>

                  </section>

                  {/* SMALL INFORMATION CARDS */}

                  <section className="bottom-grid">

                    <div className="panel mini-panel">

                      <div className="panel-header">

                        <h2>
                          User Roles
                        </h2>

                      </div>

                      <div className="mini-list">

                        <div>

                          <span>
                            Administrators
                          </span>

                          <strong className="purple-number">
                            {adminCount}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Customers
                          </span>

                          <strong>
                            {customerCount}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Total Accounts
                          </span>

                          <strong>
                            {totalUsers}
                          </strong>

                        </div>

                      </div>

                    </div>

                    <div className="panel mini-panel">

                      <div className="panel-header">

                        <h2>
                          User Status
                        </h2>

                      </div>

                      <div className="mini-list">

                        <div>

                          <span>
                            Active
                          </span>

                          <strong className="purple-number">
                            {totalUsers}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Admins
                          </span>

                          <strong>
                            {adminCount}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Customers
                          </span>

                          <strong>
                            {customerCount}
                          </strong>

                        </div>

                      </div>

                    </div>

                    <div className="panel mini-panel">

                      <div className="panel-header">

                        <h2>
                          This Month
                        </h2>

                      </div>

                      <div className="mini-list">

                        <div>

                          <span>
                            Total Users
                          </span>

                          <strong className="green-number">
                            {totalUsers}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Admin Accounts
                          </span>

                          <strong>
                            {adminCount}
                          </strong>

                        </div>

                        <div>

                          <span>
                            Customer Accounts
                          </span>

                          <strong>
                            {customerCount}
                          </strong>

                        </div>

                      </div>

                    </div>

                  </section>

                  {/* USER MANAGEMENT */}

                  <section
                    className="users-section"
                    id="users-section"
                  >

                    <div className="section-title-row">

                      <div>

                        <span className="section-overline">
                          MANAGEMENT
                        </span>

                        <h2>
                          All Users
                        </h2>

                        <p>
                          Manage users and
                          account information.
                        </p>

                      </div>

                      <button
                        type="button"
                        className="add-user-button"
                        onClick={
                          openAddModal
                        }
                      >

                        <span>
                          ＋
                        </span>

                        Add User

                      </button>

                    </div>

                    <div className="users-toolbar">

                      <div className="management-search">

                        <span>
                          ⌕
                        </span>

                        <input
                          type="text"
                          placeholder="Search by name or email..."
                          value={search}
                          onChange={(event) =>
                            setSearch(
                              event.target.value
                            )
                          }
                        />

                        {search && (

                          <button
                            type="button"
                            onClick={() =>
                              setSearch("")
                            }
                          >
                            ×
                          </button>

                        )}

                      </div>

                      <select
                        value={roleFilter}
                        onChange={(event) =>
                          setRoleFilter(
                            event.target
                              .value as
                              | "all"
                              | UserRole
                          )
                        }
                      >

                        <option value="all">
                          All Roles
                        </option>

                        <option value="admin">
                          Admins
                        </option>

                        <option value="customer">
                          Customers
                        </option>

                      </select>

                    </div>

                    {loading ? (

                      <div className="table-loading">

                        <div className="spinner"></div>

                        <p>
                          Loading users...
                        </p>

                      </div>

                    ) : filteredUsers.length ===
                      0 ? (

                      <div className="empty-users">

                        <div className="empty-users-icon">
                          ♙
                        </div>

                        <h3>
                          No users found
                        </h3>

                        <p>
                          {search ||
                          roleFilter !==
                            "all"
                            ? "Try changing your search or filter."
                            : "Add your first user to get started."}
                        </p>

                        <button
                          type="button"
                          className="add-user-button"
                          onClick={
                            search ||
                            roleFilter !==
                              "all"
                              ? () => {
                                  setSearch("");
                                  setRoleFilter(
                                    "all"
                                  );
                                }
                              : openAddModal
                          }
                        >

                          {search ||
                          roleFilter !==
                            "all"
                            ? "Clear Filters"
                            : "Add User"}

                        </button>

                      </div>

                    ) : (

                      <div className="table-wrapper">

                        <table className="users-table">

                          <thead>

                            <tr>

                              <th>
                                USER
                              </th>

                              <th>
                                EMAIL
                              </th>

                              <th>
                                ROLE
                              </th>

                              <th>
                                STATUS
                              </th>

                              <th>
                                ID
                              </th>

                              <th>
                                ACTIONS
                              </th>

                            </tr>

                          </thead>

                          <tbody>

                            {filteredUsers.map(
                              (user) => (

                                <tr
                                  key={user.id}
                                >

                                  <td>

                                    <div className="table-user">

                                      <div
                                        className={`table-avatar avatar-${
                                          (user.id % 5) +
                                          1
                                        }`}
                                      >
                                        {user.name
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>

                                      <div>

                                        <strong>
                                          {user.name}
                                        </strong>

                                        <span>
                                          User
                                        </span>

                                      </div>

                                    </div>

                                  </td>

                                  <td className="email-column">
                                    {user.email}
                                  </td>

                                  <td>

                                    <span
                                      className={`role-pill ${user.role}`}
                                    >
                                      {user.role}
                                    </span>

                                  </td>

                                  <td>

                                    <span className="table-status">

                                      <i></i>

                                      Active

                                    </span>

                                  </td>

                                  <td className="id-column">
                                    #{user.id}
                                  </td>

                                  <td>

                                    <div className="row-actions">

                                      <button
                                        type="button"
                                        title="Edit user"
                                        onClick={() =>
                                          openEditModal(
                                            user
                                          )
                                        }
                                        disabled={
                                          actionLoadingId ===
                                          user.id
                                        }
                                      >
                                        ✎
                                      </button>

                                      <button
                                        type="button"
                                        title="Quick PATCH"
                                        onClick={() =>
                                          openPatchModal(
                                            user
                                          )
                                        }
                                        disabled={
                                          actionLoadingId ===
                                          user.id
                                        }
                                      >
                                        ↻
                                      </button>

                                      <button
                                        type="button"
                                        className="delete-action"
                                        title="Delete user"
                                        onClick={() =>
                                          openDeleteModal(
                                            user.id
                                          )
                                        }
                                        disabled={
                                          actionLoadingId ===
                                          user.id
                                        }
                                      >
                                        ×
                                      </button>

                                    </div>

                                  </td>

                                </tr>

                              )
                            )}

                          </tbody>

                        </table>

                      </div>

                    )}

                  </section>

                </main>

              </div>

              {/* =====================================
                  ADD / EDIT MODAL
                  ===================================== */}

              {formModalOpen && (

                <Modal
                  title={
                    editingId !== null
                      ? "Edit User"
                      : "Add New User"
                  }
                  onClose={
                    closeFormModal
                  }
                >

                  <form
                    className="modal-form"
                    onSubmit={
                      handleSubmit
                    }
                  >

                    <div className="modal-intro">

                      <div className="modal-form-icon">
                        {editingId !== null
                          ? "✎"
                          : "＋"}
                      </div>

                      <div>

                        <h4>
                          {editingId !== null
                            ? "Update user information"
                            : "Create a new user"}
                        </h4>

                        <p>
                          {editingId !== null
                            ? "Make changes to this user's account."
                            : "Enter the details below to add a new user."}
                        </p>

                      </div>

                    </div>

                    <div className="form-grid">

                      <div className="form-field full">

                        <label htmlFor="name">
                          Full Name
                        </label>

                        <input
                          id="name"
                          name="name"
                          type="text"
                          placeholder="e.g. Fiza Ahmed"
                          value={
                            formData.name
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          autoComplete="name"
                        />

                      </div>

                      <div className="form-field full">

                        <label htmlFor="email">
                          Email Address
                        </label>

                        <input
                          id="email"
                          name="email"
                          type="email"
                          placeholder="e.g. fiza@example.com"
                          value={
                            formData.email
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
                          autoComplete="email"
                        />

                      </div>

                      <div className="form-field full">

                        <label htmlFor="role">
                          Role
                        </label>

                        <select
                          id="role"
                          name="role"
                          value={
                            formData.role
                          }
                          onChange={
                            handleChange
                          }
                          disabled={saving}
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

                    <div className="modal-footer">

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={
                          closeFormModal
                        }
                        disabled={saving}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="save-button"
                        disabled={saving}
                      >

                        {saving ? (

                          <>
                            <span className="button-spinner"></span>

                            Saving...
                          </>

                        ) : (

                          <>
                            {editingId !== null
                              ? "Save Changes"
                              : "Create User"}
                          </>

                        )}

                      </button>

                    </div>

                  </form>

                </Modal>

              )}

              {/* =====================================
                  PATCH MODAL
                  ===================================== */}

              {patchTarget && (

                <Modal
                  title="Quick Update"
                  onClose={
                    closePatchModal
                  }
                >

                  <div className="patch-modal">

                    <div className="modal-intro">

                      <div className="modal-form-icon">
                        ↻
                      </div>

                      <div>

                        <h4>
                          Quick name update
                        </h4>

                        <p>
                          This uses the PATCH
                          API method to update
                          only the name.
                        </p>

                      </div>

                    </div>

                    <div className="form-field">

                      <label htmlFor="patch-name">
                        User Name
                      </label>

                      <input
                        id="patch-name"
                        type="text"
                        value={
                          patchName
                        }
                        onChange={(event) =>
                          setPatchName(
                            event.target
                              .value
                          )
                        }
                        placeholder="Enter user name"
                        disabled={
                          actionLoadingId !==
                          null
                        }
                      />

                    </div>

                    <div className="modal-footer">

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={
                          closePatchModal
                        }
                        disabled={
                          actionLoadingId !==
                          null
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="save-button"
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

              {/* =====================================
                  DELETE MODAL
                  ===================================== */}

              {deleteId !== null && (

                <Modal
                  title="Delete User"
                  onClose={
                    closeDeleteModal
                  }
                >

                  <div className="delete-modal">

                    <div className="delete-icon">
                      !
                    </div>

                    <h3>
                      Delete{" "}
                      {deleteUserData?.name ||
                        "this user"}
                      ?
                    </h3>

                    <p>
                      This action will remove
                      the user from the current
                      user list. Are you sure
                      you want to continue?
                    </p>

                    <div className="modal-footer">

                      <button
                        type="button"
                        className="cancel-button"
                        onClick={
                          closeDeleteModal
                        }
                        disabled={
                          actionLoadingId !==
                          null
                        }
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="delete-confirm-button"
                        onClick={
                          confirmDelete
                        }
                        disabled={
                          actionLoadingId ===
                          deleteId
                        }
                      >

                        {actionLoadingId ===
                        deleteId
                          ? "Deleting..."
                          : "Delete User"}

                      </button>

                    </div>

                  </div>

                </Modal>

              )}

              {/* =====================================
                  TOAST
                  ===================================== */}

              {toast && (

                <Toast
                  message={
                    toast.message
                  }
                  type={
                    toast.type
                  }
                  onClose={() =>
                    setToast(null)
                  }
                />

              )}

            </div>
          </ProtectedRoute>
        }
      />

      {/* =====================================
          UNKNOWN ROUTE
          ===================================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />

    </Routes>
  );
}

export default App;