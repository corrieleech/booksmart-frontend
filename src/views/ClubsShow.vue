<script>
import axios from "axios";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

import { QuillEditor } from "@vueup/vue-quill";
import "@vueup/vue-quill/dist/vue-quill.snow.css";

export default {
  components: {
    QuillEditor,
  },
  data: function () {
    return {
      profile: localStorage.getItem("profile"),
      club: {},
      messageBody: "",
      categoryType: "",
      messageEdit: "",
      errors: [],
      options: {
        debug: "info",
        placeholder: "Add a comment...",
        readOnly: true,
        theme: "snow",
      },
    };
  },
  created: function () {
    axios.get(`/clubs/${this.$route.params.id}`).then((response) => {
      console.log("Created", response.data);
      this.club = response.data;
    });
  },
  methods: {
    membershipCreate: function () {
      const params = { club_id: this.club.id };
      axios.post("/memberships", params).then((response) => {
        console.log("Membership create:", response.data);
        this.club.memberships.push(response.data);
        this.club["is_member?"] = true;
      });
    },
    membershipDestroy: function () {
      const membership = this.club.memberships.find((membership) => membership.user.id == this.profile);
      const index = this.club.memberships.indexOf(membership);
      axios.delete(`/memberships/${membership.id}`).then((response) => {
        console.log("Membership deleted:", response.data);
      });
      this.club.memberships.splice(index, 1);
      this.club["is_member?"] = false;
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
      axios
        .post("/messages", params)
        .then((response) => {
          console.log(response.data);
          this.club.messages.push(response.data);
          this.errors = [];
        })
        .catch((error) => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
      this.messageBody = "";
    },
    messageUpdate: function (message) {
      axios
        .patch(`/messages/${message.id}`, message)
        .then((response) => {
          console.log("Updated message", response.data);
          this.messageEdit = "";
          this.errors = [];
        })
        .catch((error) => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
    messageDelete: function (message) {
      const index = this.club.messages.indexOf(message);
      axios.delete(`/messages/${message.id}`, message).then((response) => {
        console.log("Message has been removed.", response.data);
        this.messageEdit = "";
      });
      this.club.messages.splice(index, 1);
    },
    clubUpdate: function () {
      this.club.is_active = !this.club.is_active;
      const params = { is_active: this.club.is_active };
      axios.patch(`/clubs/${this.club.id}`, params).then((response) => {
        console.log("Club Updated", response.data);
      });
    },
  },
};
</script>

<template>
  <div>
    <div v-if="club.memberships">
      <h1>
        {{ club.name }}
        <font-awesome-icon v-if="club['is_member?']" icon="circle-check" size="sm" />
        <font-awesome-icon v-else icon="circle-plus" size="sm" />
      </h1>
      <h2 v-if="club.is_active">
        (Active)
        <button v-on:click="clubUpdate">Archive Club</button>
      </h2>
      <h2 v-else>
        (Inactive)
        <button v-on:click="clubUpdate">Reactivate Club</button>
      </h2>
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
      <span v-if="club.details" v-html="`${club.details['disc_questions']}`"></span>
    </div>
    <div v-if="club['is_member?']">
      <h2>Formal Messages</h2>
      <div v-for="message in club.messages" v-bind:key="message.id">
        <div v-if="message.category == 'formal'">
          <p>
            <router-link v-bind:to="`/users/${message.user['id']}`">
              <b>{{ message.user["name"] }}</b>
            </router-link>
            -
            <i>{{ relativeDate(message.updated_at) }}</i>
            &nbsp;
            <button v-if="profile == message.user['id']" v-on:click="messageEdit = message.id">Edit</button>
          </p>
          <div v-if="messageEdit == message.id">
            <textarea v-model="message.body"></textarea>
            <br />
            <button v-on:click="messageUpdate(message)">Save</button>
            <button v-on:click="messageEdit = ''">Cancel</button>
            <button v-on:click="messageDelete(message)">Delete</button>
          </div>
          <div v-else><span v-html="message.body"></span></div>
        </div>
      </div>
      <div v-if="club.is_active">
        <br />
        <QuillEditor theme="snow" v-model:content="messageBody" contentType="html" />
        <textarea v-model="messageBody" placeholder="Add a comment..."></textarea>
        <br />
        <button v-on:click="messageCreate(0)">Add Message</button>
        <br />
        <small v-for="error in errors" v-bind:key="error">{{ error }}</small>
      </div>
    </div>
    <div v-if="club['is_member?']">
      <h2>Informal Messages</h2>
      <div v-for="message in club.messages" v-bind:key="message.id">
        <div v-if="message.category == 'informal'">
          <p>
            <router-link v-bind:to="`/users/${message.user['id']}`">
              <b>{{ message.user["name"] }}</b>
            </router-link>
            -
            <i>{{ relativeDate(message.updated_at) }}</i>
            &nbsp;
            <button v-if="profile == message.user['id'] && club.is_active" v-on:click="messageEdit = message.id">
              Edit
            </button>
          </p>
          <div v-if="messageEdit == message.id">
            <textarea v-model="message.body"></textarea>
            <br />
            <button v-on:click="messageUpdate(message)">Save</button>
            <button v-on:click="messageEdit = ''">Cancel</button>
            <button v-on:click="messageDelete(message)">Delete</button>
          </div>
          <div v-else>{{ message.body }}</div>
        </div>
      </div>
      <div v-if="club.is_active">
        <br />
        <textarea v-model="messageBody" placeholder="Add a comment..."></textarea>
        <br />
        <button v-on:click="messageCreate(1)">Add Message</button>
        <br />
        <small v-for="error in errors" v-bind:key="error">{{ error }}</small>
      </div>
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
