<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newUserParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/users", this.newUserParams)
        .then((response) => {
          console.log(response.data);
          this.$router.push("/login");
        })
        .catch((error) => {
          this.errors = error.response.data.errors;
        });
    },
  },
};
</script>

<template>
  <div class="signup">
    <section
      class="user-page d-flex align-items-center vh-100 align-self-center position-relative"
      style="background: url(images/login-bg.jpg) center center"
    >
      <div class="bg-overlay"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="bg-light shadow rounded-3 p-4">
              <div class="text-center">
                <a href="index.html" class="d-inline-block my-4">
                  <img src="images/logo-icon.png" class="logo-dark" alt="" height="60" />
                </a>
                <h4 class="fw-bold mb-2">Welcome to BookSmart</h4>
                <p class="text-muted fs-15 mb-0">Create your account and</p>
                <p class="text-muted fs-15">join better conversations today.</p>
              </div>
              <div class="col-lg-12 mt-4">
                <form>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input type="name" class="form-control" placeholder="Your name" id="name" />
                        <label class="text-muted" for="name">
                          <i class="icon-xxs icon sw-1.5 me-2" data-feather="user"></i>
                          Enter name
                        </label>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input type="email" class="form-control" placeholder="Your email" id="email" />
                        <label class="text-muted" for="email">
                          <i class="icon-xxs icon sw-1.5 me-2" data-feather="mail"></i>
                          Email address
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input type="password" class="form-control" placeholder="Subject" id="password" />
                        <label class="text-muted" for="password">
                          <i class="icon-xxs icon sw-1.5 me-2" data-feather="lock"></i>
                          Password
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12 d-grid mb-4">
                      <input
                        type="submit"
                        id="submit"
                        name="send"
                        class="submitBnt btn btn-primary rounded text-uppercase"
                        value="Register"
                      />
                    </div>
                    <ul>
                      <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                    </ul>
                  </div>
                  <p class="text-muted text-center fs-15">
                    Alaready have an account?
                    <a class="text-primary fw-semibold text-decoration-underline" href="login.html">Log In</a>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <form v-on:submit.prevent="submit()">
      <h1>Signup</h1>
      <ul>
        <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
      </ul>
      <div>
        <label>Name:</label>
        <input type="text" v-model="newUserParams.name" />
      </div>
      <div>
        <label>Email:</label>
        <input type="email" v-model="newUserParams.email" />
      </div>
      <div>
        <label>Password:</label>
        <input type="password" v-model="newUserParams.password" />
      </div>
      <div>
        <label>Password confirmation:</label>
        <input type="password" v-model="newUserParams.password_confirmation" />
        <br />
        <small
          v-if="newUserParams.password_confirmation && newUserParams.password_confirmation != newUserParams.password"
        >
          Passwords must match
        </small>
      </div>
      <input type="submit" value="Submit" />
    </form>
    <p>
      Already have an account?
      <router-link to="/login">Log in</router-link>
    </p>
  </div>
</template>
