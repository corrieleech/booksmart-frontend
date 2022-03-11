<script>
import axios from "axios";

export default {
  data: function () {
    return {
      user: {},
    };
  },
  created: function () {
    axios.get(`/users/${this.$route.params.id}`).then((response) => {
      console.log(response.data);
      this.user = response.data;
    });
  },
  methods: {},
};
</script>

<template>
  <div class="users-show">
    <router-link v-bind:to="`/users/${user.id}/edit`">
      <button>Save</button>
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
</template>

<style></style>
