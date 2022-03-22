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
  <div class="clubs-new">
    <!-- start title -->
    <section class="section bg-light">
      <div class="container">
        <div class="row align-items-center text-center">
          <div class="col-lg-12 mt-5 pt-3">
            <h2 class="fw-bold">Create a Club</h2>
          </div>
        </div>
      </div>
    </section>
    <!-- end title -->
    <section class="sm-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <div class="row">
              <div class="col-md-6 mt-4">
                <div class="mt-3">
                  <img src="/images/yinka.jpeg" class="img-fluid rounded-3 border" alt="" />
                </div>
                <div class="mt-4">
                  <img src="/images/prideandprejudice.jpeg" class="img-fluid rounded-3 border" alt="" />
                </div>
              </div>
              <div class="col-md-6 my-auto">
                <div class="mt-md-0 mt-4">
                  <img src="/images/klaraandthesun.jpeg" class="img-fluid rounded-3 border" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 offset-lg-1 mt-lg-0 mt-4">
            <div class="border-bottom py-3">
              <span class="text-primary"><i class="icon-md" data-feather="users"></i></span>
              <h4 class="lh-base mt-3">Pick a name for your club</h4>
              <h4>and choose a book to get started</h4>
            </div>
            <div>
              <h2>Step 1: Name Your Club</h2>
              <input type="text" v-model="clubName" />
              <h2>Step 2: Pick a Book</h2>
              <input type="text" v-model="search.title_search" />
            </div>
            <p class="text-muted pt-4">
              On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and
              demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the
              pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through
              weakness
            </p>
            <button v-on:click="searchTitle()" class="btn btn-primary mt-3">Search</button>
          </div>
        </div>
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
    </section>
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
