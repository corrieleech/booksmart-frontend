<script>
import axios from "axios";

export default {
  data: function () {
    return {
      user: {},
      updateUserParams: {},
      errors: [],
      profile: localStorage.getItem("profile"),
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
      if (
        confirm(
          "Are you sure you want to delete your account? Doing so will also delete  all your messages from your book clubs."
        )
      ) {
        axios.delete(`/users/${user.id}`).then((response) => {
          console.log("Deleted user", response.data);
        });
        localStorage.removeItem("jwt");
        localStorage.removeItem("profile");
        this.$router.push("/signup");
      }
    },
  },
};
</script>

<template>
  <div class="users-show">
    <section class="section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <img :src="user.image" alt="member-img" class="img-fluid rounded-3" />
          </div>
          <div class="col-lg-6">
            <div>
              <h4>{{ user.name }}</h4>
            </div>
            <div class="d-flex align-items-center py-3">
              <h6 class="me-4">
                Location :
                <span class="fw-normal text-muted ms-1">{{ user.location }}</span>
              </h6>
              <h6>
                Twitter :
                <span class="fw-normal text-muted ms-1">{{ user.twitter }}</span>
              </h6>
            </div>

            <h6>About</h6>
            <p class="text-muted fs-15">{{ user.about }}</p>

            <h6>Book Clubs</h6>
            <ul>
              <li v-for="club in user.clubs" v-bind:key="club.id">
                <router-link v-bind:to="`/clubs/${club.id}`">{{ club.name }}</router-link>
                <p v-if="!club.is_active">{{ club.is_active }}</p>
              </li>
            </ul>
            <a v-if="profile == user.id" v-on:click="selectEdit()" class="btn btn-primary mt-3">
              Edit Profile
              <i class="icon-xs" data-feather="chevrons-right"></i>
            </a>
          </div>
        </div>
      </div>
      <!-- end container -->
    </section>
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
