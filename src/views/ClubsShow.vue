<script>
import axios from "axios";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

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
      messageBody: "",
      categoryType: "",
    };
  },
  created: function () {
    axios.get(`/clubs/${this.$route.params.id}`).then((response) => {
      console.log(response.data);
      this.club = response.data;
    });
  },
  methods: {
    membershipCreate: function () {
      const params = { club_id: this.club.id };
      axios.post("/memberships", params).then((response) => {
        console.log("Membership create:", response.data);
        this.club.memberships.push(response.data);
      });
    },
    membershipDestroy: function () {
      const membership = this.club.memberships.find((membership) => membership.user.id == 1);
      console.log(membership.id);
      const index = this.club.memberships.indexOf(membership);
      console.log(index);
      // axios.delete(`/memberships/${membership.id}`).then((response) => {
      //   console.log("Membership deleted:", response.data);
      //   this.club.memberships.slice(index, 0);
      // });
    },
    relativeDate: function (date) {
      return dayjs().to(dayjs(date));
    },
    messageCreate: function (number) {
      if (number == 1) {
        this.categoryType = "informal";
      } else {
        this.categoryType = "formal";
      }
      const params = {
        club_id: this.club.id,
        category: this.categoryType,
        body: this.messageBody,
      };
      axios.post("/messages", params).then((response) => {
        console.log(response.data);
        this.club.messages.push(response.data);
      });
      this.messageBody = "";
    },
    messageUpdate: function () {
      console.log("ready to edit message");
    },
  },
};
</script>

<template>
  <div class="clubs-show">
    <div>
      <h1>
        {{ club.name }}
        <font-awesome-icon v-if="club['is_member?']" icon="circle-check" size="sm" />
        <font-awesome-icon v-else icon="user-plus" size="sm" />
      </h1>
      <h2 v-if="club.is_active">(Active)</h2>
      <h2 v-else>(Inactive)</h2>
      <button v-if="!club['is_member?']" v-on:click="membershipCreate()">Join Club</button>
      <button v-else v-on:click="membershipDestroy()">Leave Club</button>
      <br />
      <br />
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
          <router-link v-bind:to="`/users/${message.user['id']}`">
            <b>{{ message.user["name"] }}</b>
          </router-link>
          -
          <i>{{ relativeDate(message.updated_at) }}</i>
          <br />
          {{ message.body }}
        </p>
      </div>
      <textarea v-model="messageBody" placeholder="Add a comment..."></textarea>
      <br />
      <button v-on:click="messageCreate(0)">Add Message</button>
    </div>
    <div v-if="club['is_member?']">
      <h2>Informal Messages</h2>
      <div v-for="message in club.messages" v-bind:key="message.id">
        <p v-if="message.category == 'informal'">
          <router-link v-bind:to="`/users/${message.user['id']}`">
            <b>{{ message.user["name"] }}</b>
          </router-link>
          -
          <i>{{ relativeDate(message.updated_at) }}</i>
          <br />
          {{ message.body }}
        </p>
      </div>
      <textarea v-model="messageBody" placeholder="Add a comment..."></textarea>
      <br />
      <button v-on:click="messageCreate(1)">Add Message</button>
    </div>
    <div>
      <h2>Members</h2>
      <div v-for="membership in club.memberships" v-bind:key="membership.id">
        <p>
          <router-link v-bind:to="`/users/${membership.user['id']}`">
            <img class="user" :src="`${membership.user['image']}`" />
          </router-link>
          <router-link v-bind:to="`/users/${membership.user['id']}`">{{ membership.user["name"] }}</router-link>
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
