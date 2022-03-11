<script>
import axios from "axios";

export default {
  data: function () {
    return {
      search: {},
    };
  },
  created: function () {},
  methods: {
    searchTitle: function () {
      const params = { params: this.search };
      console.log("Params:", params);
      axios.get("/books", params).then((response) => {
        console.log(response);
      });
    },
  },
};
</script>

<template>
  <div class="home">
    <h1>Create A Club</h1>
    <h2>Step 1: Search for a Book</h2>
    <input type="text" v-model="search.title_search" />
    <button v-on:click="searchTitle()">Search</button>
    {{ search }}
  </div>
  <div></div>
</template>

<style></style>
