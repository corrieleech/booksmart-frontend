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
    <div class="back-home rounded-3 d-none d-sm-block">
      <router-link to="/home" class="d-inline-block text-center rounded-3 text-white">
        <i class="icon-xs" data-feather="home"></i>
      </router-link>
    </div>
    <section
      class="user-page d-flex align-items-center vh-100 align-self-center position-relative"
      style="background: url(/images/susan-q-yin-2JIvboGLeho-unsplash_ccexpress.jpeg) center center"
    >
      <div class="bg-overlay"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="bg-light shadow rounded-3 p-4">
              <div class="text-center">
                <router-link to="/home" class="d-inline-block my-4">
                  <img src="/images/booksmartlogolg1.png" class="logo-dark" alt="" height="60" />
                </router-link>
                <h4 class="fw-bold mb-2">Welcome to BookSmart</h4>
                <p class="text-muted fs-15 mb-0">Create your account and</p>
                <p class="text-muted fs-15">join better conversations today.</p>
              </div>
              <div class="col-lg-12 mt-4">
                <form v-on:submit.prevent="submit()">
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input
                          type="name"
                          class="form-control"
                          placeholder="Your name"
                          id="name"
                          v-model="newUserParams.name"
                        />
                        <label class="text-muted" for="name">
                          <i class="icon-xxs icon sw-1.5 me-2" data-feather="user"></i>
                          Enter name
                        </label>
                      </div>
                    </div>
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input
                          type="email"
                          class="form-control"
                          placeholder="Your email"
                          id="email"
                          v-model="newUserParams.email"
                        />
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
                        <input
                          type="password"
                          class="form-control"
                          placeholder="Subject"
                          id="password"
                          v-model="newUserParams.password"
                        />
                        <label class="text-muted" for="password">
                          <i class="icon-xxs icon sw-1.5 me-2" data-feather="lock"></i>
                          Password
                        </label>
                      </div>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input
                          type="password"
                          class="form-control"
                          placeholder="Subject"
                          id="password-confirmation"
                          v-model="newUserParams.password_confirmation"
                        />
                        <label class="text-muted" for="password-confirmation">
                          <i class="icon-xxs icon sw-1.5 me-2" data-feather="lock"></i>
                          Password Confirmation
                        </label>
                      </div>
                      <div
                        v-if="
                          newUserParams.password_confirmation &&
                          newUserParams.password_confirmation != newUserParams.password
                        "
                      >
                        <small class="text-muted">Passwords must match</small>
                        <br />
                        <br />
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
                  </div>
                  <ul>
                    <li v-for="error in errors" v-bind:key="error">{{ error }}</li>
                  </ul>
                  <p class="text-muted text-center fs-15">
                    Already have an account?
                    <router-link to="/login" class="text-primary fw-semibold text-decoration-underline">
                      Log In
                    </router-link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
