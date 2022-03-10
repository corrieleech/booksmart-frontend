<script>
import axios from "axios";

export default {
  data: function () {
    return {
      clubs: [],
    };
  },
  created: function () {
    axios.get("/clubs").then((response) => {
      this.clubs = response.data;
    });
  },
  methods: {},
};
</script>

<template>
  <div class="users-show">
    <h1>Book Clubs</h1>
  </div>
  <div v-for="club in clubs" v-bind:key="club.id">
    <router-link v-bind:to="`/clubs/${club.id}`">
      <img :src="`${club.book['cover_image']['href']}`" />
    </router-link>
    <br />
    <router-link v-bind:to="`/clubs/${club.id}`">
      <h2>{{ club.name }}</h2>
    </router-link>
    <p>
      Reading
      <i>{{ club.book["title"] }}</i>
      <i v-if="club.book['subtitle']">: {{ club.book["subtitle"] }}</i>
      <br />
      by {{ club.book["author"] }}
    </p>
  </div>
</template>

<style>
/* TEMPORARY */
img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 150px;
}
</style>
