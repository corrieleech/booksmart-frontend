<script>
import axios from "axios";

export default {
  data: function () {
    return {
      newSessionParams: {},
      errors: [],
    };
  },
  methods: {
    submit: function () {
      axios
        .post("/sessions", this.newSessionParams)
        .then((response) => {
          axios.defaults.headers.common["Authorization"] = "Bearer " + response.data.jwt;
          localStorage.setItem("jwt", response.data.jwt);
          localStorage.setItem("profile", response.data.user_id);
          this.$router.push("/clubs");
        })
        .catch((error) => {
          console.log(error.response);
          this.errors = ["Invalid email or password."];
          this.email = "";
          this.password = "";
        });
    },
  },
};
</script>

<template>
  <div class="login">
    <div class="back-home rounded-3 d-none d-sm-block">
      <a href="index.html" class="d-inline-block text-center rounded-3 text-white">
        <i class="icon-xs" data-feather="home"></i>
      </a>
    </div>

    <section
      class="user-page d-flex align-items-center vh-100 align-self-center position-relative"
      style="background: url(images/susan-q-yin-2JIvboGLeho-unsplash_ccexpress.jpeg) center center"
    >
      <div class="bg-overlay"></div>
      <div class="container">
        <div class="row justify-content-center">
          <div class="col-lg-6 col-md-8">
            <div class="bg-light shadow rounded-3 p-4">
              <div class="text-center">
                <a href="index.html" class="d-inline-block my-4">
                  <img src="images/booksmartlogolg1.png" class="logo-dark" alt="" height="60" />
                </a>
                <h4 class="fw-bold mb-2">Welcome Back</h4>
                <p class="text-muted fs-15 mb-0">Log in to your account</p>
                <p class="text-muted fs-15">to continue the conversation.</p>
              </div>
              <div class="col-lg-12 mt-4">
                <form v-on:submit.prevent="submit()">
                  <div class="row">
                    <div class="col-lg-12">
                      <div class="form-floating mb-3">
                        <input
                          type="email"
                          class="form-control"
                          placeholder="Your email"
                          id="email"
                          v-model="newSessionParams.email"
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
                          v-model="newSessionParams.password"
                        />
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
                        value="Log In"
                      />
                    </div>
                    <div>
                      <p v-for="error in errors" v-bind:key="error" class="text-muted text-center">{{ error }}</p>
                    </div>
                  </div>
                  <p class="text-muted text-center fs-15">
                    Don't have an account?
                    <router-link to="/signup" class="text-primary fw-semibold text-decoration-underline">
                      Create One
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
