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
    <!-- start title -->
    <section class="section bg-light title-section">
      <div class="container">
        <div class="row align-items-center text-center">
          <div class="col-lg-12 mt-5 pt-3">
            <h2 class="fw-bold">Current Book Clubs</h2>
          </div>
        </div>
      </div>
    </section>
    <!-- end title -->
    <!-- shuffle portfolio -->
    <section class="sm-section">
      <div class="container">
        <div class="d-flex justify-content-center">
          <p class="text-muted fs-16">
            Quick Search by Title:
            <input type="text" v-model="searchParams" list="clubTitles" />
          </p>

          <datalist id="clubTitles">
            <option v-for="club in clubs" v-bind:key="club.id">{{ club.book["title"] }}</option>
          </datalist>
        </div>
        <div id="grid" class="row">
          <div v-for="club in searchClubs" v-bind:key="club.id" class="col-lg-4 col-md-6 col-12 spacing picture-item">
            <div class="card border-0 work-container work-grid position-relative d-block overflow-hidden rounded">
              <div class="card-body p-0">
                <router-link
                  v-bind:to="`/clubs/${club.id}`"
                  href="javascript:void(0)"
                  data-src="images/work/img-1.jpg"
                  data-gallery="myGal"
                  class="mfp-image d-inline-block"
                  title=""
                >
                  <img :src="`${club.book['cover_image']['href']}`" class="img-fluid rounded" alt="work-image" />
                </router-link>
                <div class="content bg-light p-3 shadow">
                  <h6>
                    <a href="javascript:void(0)" class="text-dark title fw-medium text-uppercase fs-15">
                      {{ club.name }}
                    </a>
                  </h6>
                  <p class="fs-15 text-muted font-weight-normal tag mb-0">
                    Reading
                    <i>{{ club.book["title"] }}</i>
                    <i v-if="club.book['subtitle']">: {{ club.book["subtitle"] }}</i>
                    <br />
                    by {{ club.book["author"] }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <!--end col-->
        </div>
        <!--end row-->
      </div>
    </section>
  </div>
</template>

<style></style>
