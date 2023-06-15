import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await fetch("http://localhost:3001/users");
  if (!response.ok) {
    throw new Error("Failed to fetch users.");
  }
  const data = await response.json();
  return data;
});

export const createUser = createAsyncThunk(
  "users/createUser",
  async (newUser) => {
    const response = await fetch("http://localhost:3001/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });
    if (!response.ok) {
      throw new Error("Failed to create user.");
    }
    const data = await response.json();
    return data;
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async (updatedUser) => {
    const response = await fetch(
      `http://localhost:3001/users/${updatedUser.id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to update user.");
    }
    const data = await response.json();
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (userId) => {
    const response = await fetch(`http://localhost:3001/users/${userId}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete user.");
    }
    return userId;
  }
);

const usersSlice = createSlice({
  name: "users",
  initialState: [],
  reducers: {
    fetchUsers: (state, action) => {
      return action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.fulfilled, (state, action) => {
        return action.payload;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const { id, name, email } = action.payload;
        const user = state.find((user) => user.id === id);
        if (user) {
          user.name = name;
          user.email = email;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        const userId = action.payload;
        return state.filter((user) => user.id !== userId);
      });
  },
});

export default usersSlice.reducer;
