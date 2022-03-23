<script>
/* global Quill */

import axios from "axios";
import dayjs from "dayjs";
var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  data: function () {
    return {
      profile: localStorage.getItem("profile"),
      club: {
        book: {
          cover_image: "",
        },
      },
      formalCreateQuill: {},
      informalCreateQuill: {},
      editorFormal: {},
      contents: "",
      messageBody: "",
      categoryType: "",
      messageEdit: "",
      editContent: "",
      errors: [],
      options: {
        debug: "info",
        placeholder: "Add a comment...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            [{ indent: "-1" }, { indent: "+1" }],
            [{ align: [] }],
            ["link"],
            ["clean"],
          ],
        },
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
  mounted: function () {
    this.formalCreateQuill = new Quill("#formal", this.options);
    this.informalCreateQuill = new Quill("#informal", this.options);
    this.editorFormal = new Quill("#editorFormal", this.options);
  },
  computed: {
    formalMessages() {
      return this.club.messages.filter((message) => {
        return message.category == "formal";
      });
    },
    informalMessages() {
      return this.club.messages.filter((message) => {
        return message.category == "informal";
      });
    },
  },
  methods: {
    membershipCreate: function () {
      const params = { club_id: this.club.id };
      axios.post("/memberships", params).then((response) => {
        console.log("Membership create:", response.data);
        this.club.memberships.push(response.data);
        this.club["is_member?"] = true;
        this.formalCreateQuill = new Quill("#formal", this.options);
        this.informalCreateQuill = new Quill("#informal", this.options);
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
      var quill = this.formalCreateQuill;
      if (number == 1) {
        this.categoryType = "informal";
        this.contents = this.informalCreateQuill.root.innerHTML;
        quill = this.informalCreateQuill;
      } else {
        this.categoryType = "formal";
        this.contents = this.formalCreateQuill.root.innerHTML;
      }
      const params = {
        club_id: this.club.id,
        category: this.categoryType,
        body: this.contents,
      };
      axios
        .post("/messages", params)
        .then((response) => {
          console.log(response.data);
          this.club.messages.push(response.data);
          this.errors = [];
          quill.setContents([{ insert: "\n" }]);
        })
        .catch((error) => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
    openEditor: function (message) {
      console.log(message);
    },
    messageUpdate: function (message) {
      const index = this.club.messages.indexOf(message);
      const params = { body: this.editContent };
      axios
        .patch(`/messages/${message.id}`, params)
        .then((response) => {
          console.log("Updated message", response.data);
          this.club.messages[index].body = this.editContent;
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
  <div class="clubs-show">
    <!-- start title -->
    <section class="section bg-light title-section">
      <div class="container">
        <div class="row align-items-center justify-content-center text-center">
          <div class="col-lg-8 mt-5 pt-3">
            <h2 class="fw-bold">
              {{ club.name }}
              <font-awesome-icon
                v-if="club['is_member?']"
                icon="circle-check"
                size="sm"
                color="#1fdfa5"
                v-on:click="membershipDestroy()"
              />
              <font-awesome-icon v-else icon="circle-plus" size="sm" v-on:click="membershipCreate()" />
            </h2>
            <h4 class="fw-bold" v-if="!club.is_active">(Inactive)</h4>
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
              <div class="col-md-5 mt-4">
                <div class="position-relative">
                  <img class="img-fluid rounded-3" img :src="`${club.book['cover_image']['href']}`" alt="cook-cover" />
                </div>
                <button class="btn btn-primary my-2" v-if="!club['is_member?']" v-on:click="membershipCreate()">
                  Join Club
                </button>
                <button v-else v-on:click="membershipDestroy()" class="btn btn-secondary mr-2 my-2">Leave Club</button>
                <button
                  v-if="club.is_active && club['is_member?']"
                  class="btn btn-outline-secondary ml-2 my-2"
                  v-on:click="clubUpdate"
                >
                  Archive Club
                </button>
                <button
                  v-if="!club.is_active && club['is_member?']"
                  class="btn btn-primary ml-2 my-2"
                  v-on:click="clubUpdate"
                >
                  Reactivate Club
                </button>
              </div>
              <!-- Discussion Question Content -->
              <div class="col-md-7 mt-4">
                <div class="pro-detail-content">
                  <div class="price my-3">
                    <h3>
                      <i>{{ club.book["title"] }}</i>
                      <i v-if="club.book['subtitle']">: {{ club.book["subtitle"] }}</i>
                    </h3>
                    <h4>By {{ club.book["author"] }}</h4>
                    <br />
                    <ins class="pe-2 fs-18 text-success fw-semibold text-decoration-none">Discussion Questions</ins>
                  </div>
                  <p class="text-muted fs-16 my-3">
                    <span v-if="club.details" v-html="`${club.details['disc_questions']}`"></span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end pro-detail -->

    <!-- detail tab -->
    <section class="section bg-light" v-show="club['is_member?']">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <nav class="pro-detail-area">
              <div class="nav nav-tabs border-bottom detail-title" id="nav-tab" role="tablist">
                <a
                  class="nav-link border-0 active"
                  id="nav-formal-tab"
                  data-bs-toggle="tab"
                  href="#nav-formal"
                  role="tab"
                  aria-controls="nav-formal"
                  aria-selected="true"
                >
                  Formal Discussion
                </a>
                <a
                  class="nav-link border-0"
                  id="nav-informal-tab"
                  data-bs-toggle="tab"
                  href="#nav-informal"
                  role="tab"
                  aria-controls="nav-informal"
                  aria-selected="false"
                >
                  Informal Discussion
                </a>
                <a
                  class="nav-link border-0"
                  id="nav-member-tab"
                  data-bs-toggle="tab"
                  href="#nav-members"
                  role="tab"
                  aria-controls="nav-members"
                  aria-selected="false"
                >
                  Members
                </a>
              </div>
            </nav>
            <!-- FORMAL TAB -->
            <div class="tab-content py-4" id="nav-tabContent">
              <div class="tab-pane fade show active" id="nav-formal" role="tabpanel" aria-labelledby="nav-formal-tab">
                <ul class="list-unstyled my-4">
                  <li class="list-inline d-flex py-3" v-for="message in formalMessages" v-bind:key="message.id">
                    <div>
                      <router-link v-bind:to="`/users/${message.user['id']}`">
                        <img class="rounded-circle img-thumbnail" :src="`${message.user['image']}`" alt="user-image" />
                      </router-link>
                    </div>
                    <div class="ps-4">
                      <h6 class="d-inline-block fs-16 mb-0">{{ message.user["name"] }}</h6>
                      <p class="text-muted">
                        {{ relativeDate(message.updated_at) }}
                        <font-awesome-icon
                          icon="pen-to-square"
                          size="lg"
                          v-if="profile == message.user['id'] && club.is_active"
                          v-on:click="(messageEdit = message), (editContent = message.body)"
                        />
                      </p>
                      <div v-show="messageEdit == message">
                        <div id="editorFormal"></div>
                        <div>{{ message.body }}</div>
                        <div>
                          <button class="btn btn-primary btn-sm" v-on:click="messageUpdate(message)">Save</button>
                          <button class="btn btn-secondary btn-sm" v-on:click="messageEdit = ''">Cancel</button>
                          <button class="btn btn-outline-secondary btn-sm" v-on:click="messageDelete(message)">
                            Delete
                          </button>
                        </div>
                      </div>
                      <div>
                        <p class="text-muted fs-16">
                          <span v-html="message.body"></span>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-show="club.is_active">
                  <div id="formal"></div>
                  <br />
                  <button v-on:click="messageCreate(0)" class="btn btn-primary">Add Message</button>
                  <br />
                  <small v-for="error in errors" v-bind:key="error">{{ error }}</small>
                </div>
              </div>
              <!-- INFORMAL TAB -->
              <div class="tab-pane fade" id="nav-informal" role="tabpanel" aria-labelledby="nav-informal-tab">
                <ul class="list-unstyled my-4">
                  <li class="list-inline d-flex py-3" v-for="message in informalMessages" v-bind:key="message.id">
                    <div>
                      <router-link v-bind:to="`/users/${message.user['id']}`">
                        <img class="rounded-circle img-thumbnail" :src="`${message.user['image']}`" alt="user-image" />
                      </router-link>
                    </div>
                    <div class="ps-4">
                      <h6 class="d-inline-block fs-16 mb-0">{{ message.user["name"] }}</h6>
                      <p class="text-muted">
                        {{ relativeDate(message.updated_at) }}
                        <font-awesome-icon
                          icon="pen-to-square"
                          size="lg"
                          v-if="profile == message.user['id'] && club.is_active"
                          v-on:click="(messageEdit = message), (editContent = message.body)"
                        />
                      </p>
                      <div v-show="messageEdit == message">
                        <div id="editorInormal"></div>
                        <div>{{ message.body }}</div>
                        <div>
                          <button class="btn btn-primary btn-sm" v-on:click="messageUpdate(message)">Save</button>
                          <button class="btn btn-secondary btn-sm" v-on:click="messageEdit = ''">Cancel</button>
                          <button class="btn btn-outline-secondary btn-sm" v-on:click="messageDelete(message)">
                            Delete
                          </button>
                        </div>
                      </div>
                      <div>
                        <p class="text-muted fs-16">
                          <span v-html="message.body"></span>
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-show="club.is_active">
                  <div id="informal"></div>
                  <br />
                  <button v-on:click="messageCreate(1)" class="btn btn-primary">Add Message</button>
                  <br />
                  <small v-for="error in errors" v-bind:key="error">{{ error }}</small>
                </div>
              </div>
              <div class="tab-pane fade" id="nav-members" role="tabpanel" aria-labelledby="nav-members-tab">
                <h6 class="lh-base fw-medium">Members</h6>
                <ul class="list-unstyled my-4">
                  <li class="list-inline d-flex py-3" v-for="membership in club.memberships" v-bind:key="membership.id">
                    <div>
                      <router-link v-bind:to="`/users/${membership.user['id']}`">
                        <img
                          class="rounded-circle img-thumbnail"
                          :src="`${membership.user['image']}`"
                          alt="user-image"
                        />
                      </router-link>
                    </div>
                    <div class="ps-4">
                      <h6 class="d-inline-block fs-16 mb-0">{{ membership.user["name"] }}</h6>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
img.rounded-circle.img-thumbnail {
  width: 100px;
}

fa-circle-check {
  color: #1fdfa5;
}
</style>
