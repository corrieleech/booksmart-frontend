<script>
import axios from "axios";

export default {
  data: function () {
    return {
      search: {},
      searching: false,
      possibleBooks: [],
      hasSearched: false,
      clubName: "",
    };
  },
  created: function () {},
  methods: {
    searchTitle: function () {
      this.searching = true;
      this.possibleBooks = [];
      this.hasSearched = false;
      const params = { params: this.search };
      axios.get("/books", params).then((response) => {
        console.log("Search", response.data);
        this.possibleBooks = response.data;
        this.hasSearched = true;
        this.searching = false;
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
    <section class="section bg-light title-section">
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
                    <button
                      v-if="!hasSearched && !searching"
                      v-on:click="searchTitle()"
                      class="btn btn-primary me-2 my-2"
                    >
                      Search for Title
                    </button>
                    <button v-if="searching" class="btn btn-primary me-2 my-2">
                      <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Searching...
                    </button>
                    <button
                      v-if="!searching && hasSearched"
                      v-on:click="searchTitle()"
                      class="btn btn-secondary me-2 my-2"
                    >
                      Search for Title
                    </button>
                  </div>
                  <div v-if="possibleBooks.length && hasSearched" id="grid" class="row">
                    <h4 class="lh-base mt-3">Step 3: Confirm Book</h4>
                    <div
                      v-for="book in possibleBooks"
                      v-bind:key="book.isbn"
                      class="col-lg-4 col-md-6 col-12 spacing picture-item"
                    >
                      <div
                        class="card border-0 work-container work-grid position-relative d-block overflow-hidden rounded"
                      >
                        <div class="card-body p-0">
                          <img :src="book.coverUrl" class="img-fluid rounded" alt="work-image" />
                          <div class="content bg-light p-3 shadow">
                            <h6>
                              <a class="text-dark title fw-medium text-uppercase fs-15">
                                {{ book.name }}
                              </a>
                            </h6>
                            <p class="fs-15 text-muted font-weight-normal tag mb-0">
                              by {{ book.authors[0]["authorDisplay"] }}
                            </p>
                            <button class="btn btn-primary me-2 my-2" v-on:click="createClub(book)">Select Book</button>
                          </div>
                        </div>
                      </div>
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
