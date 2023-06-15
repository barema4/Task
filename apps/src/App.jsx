import { useState, useEffect } from "react";
import { useQuery, useMutation } from "react-query";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers, createUser, updateUser, deleteUser } from "./usersSlice";

import "./assets/style.css";

const App = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users);

  const { isLoading, data, error } = useQuery("users", fetchUsers);

  useEffect(() => {
    if (data) {
      dispatch(fetchUsers(data));
    }
  }, [data, dispatch]);

  const createUserMutation = useMutation((newUser) =>
    dispatch(createUser(newUser))
  );
  const updateUserMutation = useMutation((updatedUser) =>
    dispatch(updateUser(updatedUser))
  );
  const deleteUserMutation = useMutation((userId) =>
    dispatch(deleteUser(userId))
  );

  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setIsEditing(true);
  };

  const handleCloseEditModal = () => {
    setSelectedUser(null);
    setEditName("");
    setEditEmail("");
    setIsEditing(false);
  };

  const handleCreateUser = (event) => {
    event.preventDefault();
    const newUser = {
      name: event.target.name.value,
      email: event.target.email.value,
    };
    createUserMutation.mutate(newUser);
  };

  const handleUpdateUser = () => {
    const updatedUser = {
      id: selectedUser.id,
      name: editName,
      email: editEmail,
    };
    updateUserMutation.mutate(updatedUser);
    handleCloseEditModal();
  };

  const handleDeleteUser = (userId) => {
    deleteUserMutation.mutate(userId);
  };

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="parent">
      {selectedUser && isEditing ? (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit User</h3>
            <form onSubmit={handleUpdateUser}>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Name"
                className="input-fields"
                required
              />
              <input
                type="email"
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                placeholder="Email"
                className="input-fields"
                required
              />
              <span>
                <button type="submit" className="update-buttons">
                  Update
                </button>
                <button onClick={handleCloseEditModal}>Cancel</button>
              </span>
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h2>Create User</h2>
          <form onSubmit={handleCreateUser}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              required
              className="input-fields"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="input-fields"
            />
            <button type="submit" className="sumbit">
              Create
            </button>
          </form>
        </div>
      )}

      <h1>User List</h1>
      {isLoading ? (
        <p>Loading Data.......</p>
      ) : (
        <ul className="list-users">
          {users.map((user) => (
            <li key={user.id} className="list-items">
              <div>{user.name}</div>
              <div>{user.email}</div>
              <div className="buttons">
                <button onClick={() => handleDeleteUser(user.id)}>
                  Delete
                </button>
                <button onClick={() => handleOpenEditModal(user)}>Edit</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default App;
