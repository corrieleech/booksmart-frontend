<script>
import axios from "axios";

export default {
  data: function () {
    return {
      message: "Create A Club",
      searchParams: "",
    };
  },
  created: function () {},
  methods: {
    searchTitle: function () {
      axios.get("/books").then((response) => {
        console.log(response);
      });
    },
  },
};
</script>

<template>
  <div class="home">
    <h1>{{ message }}</h1>
  </div>
</template>

<style></style>
