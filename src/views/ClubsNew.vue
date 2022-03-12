<script>
import axios from "axios";

export default {
  data: function () {
    return {
      search: {},
      possibleBooks: [],
      hasSearched: false,
      clubName: "",
    };
  },
  created: function () {},
  methods: {
    searchTitle: function () {
      const params = { params: this.search };
      axios.get("/books", params).then((response) => {
        console.log("Search", response.data);
        this.possibleBooks = response.data;
        this.hasSearched = true;
      });
    },
    createClub: function (book) {
      const params = {
        isbn: book.isbn,
        name: this.clubName,
      };
      axios.post("/clubs", params).then((response) => {
        console.log(response);
        this.$router.push(`/clubs/${response.data.id}`);
      });
    },
  },
};
</script>

<template>
  <div class="home">
    <h1>Create a Club</h1>
    <p>Pick a name for your club and choose a book to get started.</p>
    <h2>Step 1: Name Your Club</h2>
    <input type="text" v-model="clubName" />
    <h2>Step 2: Pick a Book</h2>
    <input type="text" v-model="search.title_search" />
    <button v-on:click="searchTitle()">Search</button>
    <br />
    <br />
  </div>
  <div v-if="!possibleBooks.length && hasSearched">
    <p>No available books match your search. Try again.</p>
  </div>
  <div v-for="book in possibleBooks" v-bind:key="book.isbn">
    <img :src="book._links[1]['href']" alt="book cover" />
    <br />
    <h3>{{ book.title }} by {{ book.author }}</h3>
    <button v-on:click="createClub(book)">Create Book Club</button>
  </div>
</template>

<style></style>
