<script>
import axios from "axios";

export default {
  data: function () {
    return {
      clubs: [],
      searchParams: "",
    };
  },
  created: function () {
    axios.get("/clubs").then((response) => {
      console.log(response.data);
      this.clubs = response.data;
    });
  },
  methods: {},
  computed: {
    searchClubs() {
      return this.clubs.filter((club) => {
        return club.book["title"].toLowerCase().includes(this.searchParams.toLowerCase());
      });
    },
  },
};
</script>

<template>
  <div class="clubs-index">
    <h1>Book Clubs</h1>
  </div>
  <div>
    Search:
    <input type="text" v-model="searchParams" list="clubTitles" />
    <br />
    <datalist id="clubTitles">
      <option v-for="club in clubs" v-bind:key="club.id">{{ club.book["title"] }}</option>
    </datalist>
    <br />
  </div>
  <div v-for="club in searchClubs" v-bind:key="club.id">
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

<style scoped>
/* TEMPORARY */
img {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  width: 150px;
}
</style>
