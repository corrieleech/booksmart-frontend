<script>
/* global bootstrap */
import axios from "axios";

export default {
  data: function () {
    return {
      user: {},
      updateUserParams: {},
      errors: [],
      editOn: false,
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
          var editProfileModal = bootstrap.Modal.getInstance(document.getElementById("editProfileModal"));
          editProfileModal.hide();
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
    <!-- start title -->
    <section class="section bg-light title-section">
      <div class="container">
        <div class="row align-items-center text-center">
          <div class="col-lg-12 mt-5 pt-3">
            <h2 class="fw-bold">Member Profile</h2>
          </div>
        </div>
      </div>
    </section>
    <!-- end title -->
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
                <i v-if="!club.is_active">&nbsp;(inactive)</i>
              </li>
            </ul>
            <button
              v-if="profile == user.id"
              class="btn btn-primary mt-3"
              data-bs-toggle="modal"
              data-bs-target="#editProfileModal"
              v-on:click="this.updateUserParams = this.user"
            >
              Edit Profile
            </button>
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
      <textarea type="text" id="about" v-model="updateUserParams.about" />
      <br />
      <br />
      <label for="image">Image Url:</label>
      <input type="text" id="image" v-model="updateUserParams.image" />
      <br />
      <br />
      <p v-for="error in errors" v-bind:key="error">{{ error }}</p>
      <button value="default" class="btn btn-primary mt-3" v-on:click="updateUser(updateUserParams)">Update</button>
      <br />
      <button v-on:click="deleteUser(updateUserParams)" class="btn btn-secondary mt-3">Delete Profile</button>
      <br />
      <br />
      <button value="cancel">Cancel</button>
    </form>
  </dialog>
  <!-- MODAL -->
  <div class="modal fade" id="editProfileModal" tabindex="-1" aria-labelledby="editProfileModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editProfileModal">Edit Profile</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <form>
            <div class="mb-3">
              <label for="user-name" class="col-form-label">Name:</label>
              <input type="text" class="form-control" id="user-name" v-model="updateUserParams.name" />
            </div>
            <div class="mb-3">
              <label for="location" class="col-form-label">Location:</label>
              <input type="text" class="form-control" id="location" v-model="updateUserParams.location" />
            </div>
            <div class="mb-3">
              <label for="twitter-handle" class="col-form-label">Twitter Handle:</label>
              <input type="text" class="form-control" id="twitter-handle" v-model="updateUserParams.twitter" />
            </div>
            <div class="mb-3">
              <label for="about" class="col-form-label">About:</label>
              <textarea
                class="form-control"
                id="about"
                v-model="updateUserParams.about"
                rows="5"
                style="height: 100%"
              ></textarea>
            </div>
            <div class="mb-3">
              <label for="image-url" class="col-form-label">Image URL:</label>
              <input type="text" class="form-control" id="image-url" v-model="updateUserParams.image" />
            </div>
          </form>
          <p class="warning" v-for="error in errors" v-bind:key="error">{{ error }}</p>
        </div>
        <div class="modal-footer">
          <!-- <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button> -->
          <button type="button" class="btn btn-primary" v-on:click="updateUser(updateUserParams)">Save Changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- <button v-on:click="deleteUser(updateUserParams)" class="btn btn-secondary mt-3">Delete Profile</button> -->
