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
      <h2 v-if="club.is_active">(Active)</h2>
      <h2 v-else>(Inactive)</h2>
      <font-awesome-icon icon="fa-solid fa-comment-check" />
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
      <span v-html="`${club.details['disc_questions']}`"></span>
    </div>
    <div v-if="club['is_member?']">
      <h2>Formal Messages</h2>
      <div v-for="message in club.messages" v-bind:key="message.id">
        <p v-if="message.category == 'formal'">
          User ID: {{ message.user_id }} - {{ message.updated_at }}
          <br />
          {{ message.body }}
        </p>
      </div>
    </div>
    <div v-if="club['is_member?']">
      <h2>Informal Messages</h2>
      <div v-for="message in club.messages" v-bind:key="message.id">
        <p v-if="message.category == 'informal'">
          User ID: {{ message.user_id }} - {{ message.updated_at }}
          <br />
          {{ message.body }}
        </p>
      </div>
    </div>
    <div>
      <h2>Members</h2>
      <div v-for="membership in club.memberships" v-bind:key="membership.id">
        <p>
          <img class="user" :src="`${membership.user['image']}`" />
          {{ membership.user["name"] }}
        </p>
      </div>
    </div>
  </div>
</template>

<style>
/* TEMPORARY */
img.user {
  border-radius: 50%;
  width: 50px;
  height: 50px;
}
</style>
