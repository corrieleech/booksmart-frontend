<script>
import axios from "axios";

export default {
  data: function () {
    return {
      club: {
        name: "",
        book: {
          title: "",
          author: "",
          cover_image: {
            rel: "icon",
            href: "",
          },
        },
        memberships: [],
      },
    };
  },
  created: function () {
    axios.get(`/clubs/${this.$route.params.id}`).then((response) => {
      console.log(response.data);
      this.club = response.data;
    });
  },
  methods: {},
};
</script>

<template>
  <div class="clubs-show">
    <div>
      <h1>{{ club.name }}</h1>
      <img :src="`${club.book['cover_image']['href']}`" />
      <p>
        Book:
        <i>{{ club.book["title"] }}</i>
        <i v-if="club.book['subtitle']">: {{ club.book["subtitle"] }}</i>
      </p>
      <p>Author: {{ club.book["author"] }}</p>
    </div>
    <div>
      <h2>Discussion Questions</h2>
      <p>{{ club.details["disc_questions"] }}</p>
    </div>
    <div>
      <h2>Formal Messages</h2>
    </div>
    <div>
      <h2>Informal Messages</h2>
    </div>
    <div>
      <h2>Members</h2>
      <div v-for="member in club.memberships" v-bind:key="member.id">{{ member }}</div>
    </div>
  </div>
</template>

<style></style>
