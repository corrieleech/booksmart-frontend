<script>
import axios from "axios";
import

export default {
  data: function () {
    return {
      user: {},
      updateUserParams: {},
      errors: [],
    };
  },
  created: function () {
    axios.get(`/users/${this.$route.params.id}`).then((response) => {
      console.log("Created", response.data);
      this.user = response.data;
    });
  },
  methods: {
    selectEdit: function () {
      this.updateUserParams = this.user;
      document.querySelector("#user-edit").showModal();
    },
    updateUser: function (edits) {
      axios
        .patch(`/users/${this.$route.params.id}`, edits)
        .then((response) => {
          console.log("Updated", response.data);
          this.errors = [];
          this.$router.push(`/users/${this.user.id}`);
        })
        .catch((error) => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
    deleteUser: function (user) {
      if (confirm("Do you really want to delete?")) {
        axios.delete(`/users/${user.id}`).then((response) => {
          console.log("Deleted user", response.data);
        });
        localStorage.removeItem("jwt");
        this.$router.push("/signup");
      }
    },
  },
};
</script>

<template>
  <div class="users-show">
    <button v-on:click="selectEdit()">Edit Profile</button>
    <h1>Profile</h1>
    <font-awesome-icon icon="fa-solid fa-comment-check" />
    <img :src="user.image" />
    <h2>{{ user.name }}</h2>
    <div>
      <p>
        {{ user.location }}
        |
        {{ user.twitter }}
      </p>
      <p>{{ user.about }}</p>
    </div>
    <div>
      <h3>Book Clubs</h3>
      <div v-for="club in user.clubs" v-bind:key="club.id">
        <router-link v-bind:to="`/clubs/${club.id}`">{{ club.name }}</router-link>
        <p v-if="!club.is_active">{{ club.is_active }}</p>
      </div>
    </div>
  </div>
  <dialog id="user-edit">
    <form method="dialog">
      <h2>Edit Profile</h2>
      <label for="name">Name:</label>
      <input type="text" id="name" v-model="updateUserParams.name" />
      <br />
      <br />
      <label for="location">Location:</label>
      <input type="text" id="location" v-model="updateUserParams.location" />
      <br />
      <br />
      <label for="twitter">Twitter Handle:</label>
      <input type="text" id="twitter" v-model="updateUserParams.twitter" />
      <br />
      <br />
      <label for="about">About:</label>
      <input type="text" id="about" v-model="updateUserParams.about" />
      <br />
      <br />
      <label for="image">Image Url:</label>
      <input type="text" id="image" v-model="updateUserParams.image" />
      <br />
      <br />
      <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
      <button value="default" v-on:click="updateUser(updateUserParams)">Update</button>
      <br />
      <br />
      <button v-on:click="deleteUser(updateUserParams)">Delete Profile</button>
      <br />
      <br />
      <button value="cancel">Cancel</button>
    </form>
  </dialog>
</template>

<style></style>
