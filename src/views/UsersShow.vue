<script>
import axios from "axios";

export default {
  data: function () {
    return {
      user: {},
      updateUserParams: {},
      editProfileOn: false,
    };
  },
  created: function () {
    axios.get(`/users/${this.$route.params.id}`).then((response) => {
      console.log(response.data);
      this.user = response.data;
    });
  },
  methods: {
    updateUser: function (edits) {
      console.log(edits);
    },
  },
};
</script>

<template>
  <div class="users-show">
    <router-link v-bind:to="`/users/${user.id}/edit`">
      <button>Edit Profile</button>
    </router-link>
    <h1>Profile</h1>
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
  <form v-on:submit.prevent="updateUser(updateUserParams)">
    <h2>Edit Profile</h2>
    <label for="name">Name:</label>
    <input type="text" id="name" v-model="updateUserParams.name" />
    <br />
    <label for="location">Location:</label>
    <input type="text" id="location" v-model="updateUserParams.location" />
    <br />
    <label for="twitter">Twitter Handle:</label>
    <input type="text" id="twitter" v-model="updateUserParams.twitter" />
    <br />
    <label for="about">About:</label>
    <input type="text" id="about" v-model="updateUserParams.about" />
    <br />
    <label for="image">Image Url:</label>
    <input type="text" id="image" v-model="updateUserParams.image" />
    <br />
    <input type="submit" value="Save" />
  </form>
</template>

<style></style>
