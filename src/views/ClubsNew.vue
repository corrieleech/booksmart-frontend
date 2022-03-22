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
        <div class="row">
          <div class="col-lg-12">
            <div class="row">
              <div class="col-md-7 mt-4">
                <div class="pro-detail-content">
                  <div class="price my-3">
                    <p class="text-muted fs-15 mb-0">
                      Pick a name and a book for your book club then let the discussion begin.
                    </p>
                  </div>
                  <div class="price my-3">
                    <h4 class="lh-base mt-3">Step 1: Name Your Club</h4>
                    <input type="text" v-model="clubName" />
                  </div>
                  <div class="price my-3">
                    <h4 class="lh-base mt-3">Step 2: Pick a Book</h4>
                    <input type="text" v-model="search.title_search" />
                  </div>
                  <div class="hover-content">
                    <button v-if="!hasSearched" v-on:click="searchTitle()" class="btn btn-primary me-2 my-2">
                      Search for Title
                    </button>
                    <button v-else v-on:click="searchTitle()" class="btn btn-secondary me-2 my-2">
                      Search for Title
                    </button>
                  </div>
                  <div v-if="possibleBooks.length && hasSearched" class="price my-3">
                    <h4 class="lh-base mt-3">Step 3: Confirm Book</h4>
                    <div v-for="book in possibleBooks" v-bind:key="book.isbn">
                      <h5 class="muted-text">{{ book.title }}</h5>
                      <h5 class="muted-text">by {{ book.author }}</h5>
                      <button class="btn btn-primary me-2 my-2" v-on:click="createClub(book)">Create Book Club</button>
                    </div>
                  </div>
                  <div v-if="!possibleBooks.length && hasSearched">
                    <br />
                    <br />
                    <h5 class="muted-text">No available books match your search. Try again.</h5>
                  </div>
                </div>
              </div>
              <div class="col-md-5 mt-4">
                <div class="position-relative">
                  <img
                    v-if="!possibleBooks.length && !hasSearched"
                    class="/img-fluid rounded-3"
                    src="/images/createbookclub.png"
                    alt="book search image"
                  />
                  <img
                    v-if="!possibleBooks.length && hasSearched"
                    class="/img-fluid rounded-3"
                    src="/images/nobookfound.png"
                    alt="no book found"
                  />
                  <div v-for="book in possibleBooks" v-bind:key="book.isbn">
                    <img :src="book._links[1]['href']" alt="book cover" class="/img-fluid rounded-3" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
