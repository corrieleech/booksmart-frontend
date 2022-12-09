<script>
/* global Quill */

import axios from "axios";
import dayjs from "dayjs";

var relativeTime = require("dayjs/plugin/relativeTime");
dayjs.extend(relativeTime);

export default {
  data: function () {
    return {
      spinner: true,
      profile: localStorage.getItem("profile"),
      club: {
        book: {
          cover_image: "",
        },
        messages: [],
      },
      formalQuill: {},
      informalQuill: {},
      editOn: false,
      editedMessageId: "",
      contents: "",
      messageBody: "",
      categoryType: "",
      messageEdit: "",
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
      this.spinner = false;
    });
  },
  mounted: function () {
    this.formalQuill = new Quill("#formal", this.options);
    this.informalQuill = new Quill("#informal", this.options);
  },
  computed: {
    formalMessages() {
      if (this.club.messages) {
        return this.club.messages.filter((message) => {
          return message.category == "formal";
        });
      } else return {};
    },
    informalMessages() {
      if (this.club.messages) {
        return this.club.messages.filter((message) => {
          return message.category == "informal";
        });
      } else return {};
    },
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
      var quill = this.formalQuill;
      if (number == 1) {
        this.categoryType = "informal";
        this.contents = this.informalQuill.root.innerHTML;
        quill = this.informalQuill;
      } else {
        this.categoryType = "formal";
        this.contents = this.formalQuill.root.innerHTML;
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
      console.log("Opened editor", message);
      this.formalQuill.root.innerHTML = message.body;
      this.informalQuill.root.innerHTML = message.body;
      this.editOn = true;
      this.editedMessageId = message.id;
    },
    messageUpdate: function (number) {
      var quill = this.formalQuill;
      if (number == 1) {
        quill = this.informalQuill;
      }
      const message = this.club.messages.find((message) => message.id == this.editedMessageId);
      const index = this.club.messages.indexOf(message);
      const params = { body: quill.root.innerHTML };
      axios
        .patch(`/messages/${this.editedMessageId}`, params)
        .then((response) => {
          console.log("Updated message", response.data);
          this.club.messages[index].body = quill.root.innerHTML;
          this.messageEdit = "";
          this.errors = [];
          this.editOn = false;
          quill.setContents([{ insert: "\n" }]);
        })
        .catch((error) => {
          console.log(error.response.data.errors);
          this.errors = error.response.data.errors;
        });
    },
    messageDelete: function () {
      const message = this.club.messages.find((message) => message.id == this.editedMessageId);
      const index = this.club.messages.indexOf(message);
      axios.delete(`/messages/${this.editedMessageId}`).then((response) => {
        console.log("Message has been removed.", response.data);
        this.messageEdit = "";
      });
      this.club.messages.splice(index, 1);
      this.editOn = false;
      this.formalQuill.setContents([{ insert: "\n" }]);
      this.informalQuill.setContents([{ insert: "\n" }]);
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
        <div class="row align-items-center justify-content-center text-center" v-if="spinner">
          <div class="col-lg-8 mt-5 pt-3">
            <h2 class="fw-bold">Loading Club...</h2>
          </div>
        </div>
        <div class="row align-items-center justify-content-center text-center" v-else>
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
      <div class="d-flex justify-content-center text-muted" v-if="spinner">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Loading Club...</span>
        </div>
      </div>
      <div class="container" v-else>
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
                    <span v-if="club.details['disc_questions']" v-html="`${club.details['disc_questions']}`"></span>
                    <span v-else>
                      <p>1. What did you like best about this book? The least?</p>
                      <p>2. Share a favorite quote from the book. Why did this quote stand out?</p>
                      <p>3. Would you read another book by this author? Why or why not?</p>
                      <p>4. What feelings did this book evoke for you?</p>
                      <p>
                        5. What do you think of the book’s title? How does it relate to the book’s contents? What other
                        title might you choose?
                      </p>
                      <p>
                        6. If you could hear this same story from another person’s point of view, who would you choose?
                      </p>
                      <p>7. Which character in the book would you most like to meet?</p>
                      <p>
                        8. What did you think of the book’s length? If it’s too long, what would you cut? If too short,
                        what would you add?
                      </p>
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- end pro-detail -->

    <!-- detail tab  -->

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
            <div class="tab-content py-4" id="nav-tabContent">
              <div class="tab-pane fade show active" id="nav-formal" role="tabpanel" aria-labelledby="nav-formal-tab">
                <ul class="list-unstyled my-4">
                  <li class="list-inline d-flex py-3" v-for="message in formalMessages" v-bind:key="message.id">
                    <div>
                      <router-link v-bind:to="`/users/${message.user['id']}`">
                        <img class="rounded-circle img-member" :src="`${message.user['image']}`" alt="user-image" />
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
                          v-on:click="(messageEdit = message), openEditor(message)"
                        />
                      </p>
                      <p class="text-muted fs-16" v-html="message.body"></p>
                    </div>
                  </li>
                </ul>
                <div v-show="club.is_active">
                  <div>
                    <h5 v-if="editOn" class="text-muted">Edit Comment</h5>
                  </div>
                  <div id="formal"></div>
                  <br />
                  <div v-if="editOn">
                    <button class="btn btn-primary btn-sm" v-on:click="messageUpdate(0)">Save</button>
                    <button
                      class="btn btn-secondary btn-sm"
                      v-on:click="(editOn = false), this.formalQuill.setContents([{ insert: '\n' }])"
                    >
                      Cancel
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" v-on:click="messageDelete()">Delete</button>
                  </div>
                  <div v-else><button v-on:click="messageCreate(0)" class="btn btn-primary">Add Message</button></div>
                  <small v-for="error in errors" v-bind:key="error">{{ error }}</small>
                </div>
              </div>
              <div class="tab-pane fade" id="nav-informal" role="tabpanel" aria-labelledby="nav-informal-tab">
                <ul class="list-unstyled my-4">
                  <li class="list-inline d-flex py-3" v-for="message in informalMessages" v-bind:key="message.id">
                    <div>
                      <router-link v-bind:to="`/users/${message.user['id']}`">
                        <img class="rounded-circle img-member" :src="`${message.user['image']}`" alt="user-image" />
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
                          v-on:click="(messageEdit = message), openEditor(message)"
                        />
                      </p>
                      <p class="text-muted fs-16" v-html="message.body"></p>
                    </div>
                  </li>
                </ul>
                <div v-show="club.is_active">
                  <div>
                    <h5 v-if="editOn" class="text-muted">Edit Comment</h5>
                  </div>
                  <div id="informal"></div>
                  <br />
                  <div v-if="editOn">
                    <button class="btn btn-primary btn-sm" v-on:click="messageUpdate(1)">Save</button>
                    <button
                      class="btn btn-secondary btn-sm"
                      v-on:click="(editOn = false), this.informalQuill.setContents([{ insert: '\n' }])"
                    >
                      Cancel
                    </button>
                    <button class="btn btn-outline-secondary btn-sm" v-on:click="messageDelete()">Delete</button>
                  </div>
                  <div v-else><button v-on:click="messageCreate(1)" class="btn btn-primary">Add Message</button></div>
                  <small v-for="error in errors" v-bind:key="error">{{ error }}</small>
                </div>
              </div>
              <div class="tab-pane fade" id="nav-members" role="tabpanel" aria-labelledby="nav-members-tab">
                <h6 class="lh-base fw-medium">Members</h6>
                <ul class="list-unstyled my-4">
                  <li class="list-inline d-flex py-3" v-for="membership in club.memberships" v-bind:key="membership.id">
                    <div>
                      <router-link v-bind:to="`/users/${membership.user['id']}`">
                        <img class="rounded-circle img-member" :src="`${membership.user['image']}`" alt="user-image" />
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

<!-- end detail tab -->

<style scoped>
img.img-member {
  width: 100px;
  padding: 0.25rem;
  background-color: #fff;
  border: 1px solid #dee2e6;
  border-radius: 0.25rem;
}
</style>
