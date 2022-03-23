<script>
export default {
  data: function () {
    return {
      isLoggedIn: !!localStorage.jwt,
      profile: localStorage.getItem("profile"),
    };
  },
  watch: {
    $route: function () {
      this.isLoggedIn = !!localStorage.jwt;
      this.profile = localStorage.getItem("profile");
    },
  },
};
</script>

<template>
  <div>
    <!-- Start Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top sticky mx-auto nav-sticky" id="navbar">
      <div class="container">
        <router-link to="/clubs" class="navbar-brand me-4">
          <img src="/images/logo-light.png" class="logo-light" alt="" height="40" />
          <img src="/images/booksmartlogolg1.png" class="logo-dark" alt="" height="40" />
        </router-link>

        <div class="navbar-header">
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbar-collapse-1"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="mdi mdi-menu"></span>
          </button>
        </div>

        <div class="collapse navbar-collapse" id="navbar-collapse-1">
          <ul class="nav navbar-nav">
            <li class="nav-item">
              <router-link to="/" class="nav-link sub-menu-item">About</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/clubs" class="nav-link sub-menu-item active">All Clubs</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/clubs/new" v-if="isLoggedIn" class="nav-link sub-menu-item">Create A Club</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/signup" v-if="!isLoggedIn" class="nav-link sub-menu-item">Sign Up</router-link>
            </li>
            <li class="nav-item">
              <router-link to="/logout" v-if="isLoggedIn" class="nav-link sub-menu-item">Log Out</router-link>
            </li>
          </ul>
          <div class="ms-auto">
            <router-link to="/login" v-if="!isLoggedIn" class="log-text fw-semibold fs-16 me-4 pe-4">
              Log In
            </router-link>
            <router-link v-bind:to="`/users/${profile}`" v-if="isLoggedIn" class="log-text fw-semibold fs-16 me-4 pe-4">
              My Profile
            </router-link>
          </div>
        </div>
      </div>
    </nav>
    <!-- END NAVBAR -->

    <router-view />
    <!-- START FOOTER ALTER -->
    <div class="footer-alter bg-light py-3">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="text-muted">2022 &copy; Corz</div>
          </div>
          <div class="col-lg-6">
            <ul class="list-inline d-sm-flex social-circle float-sm-end my-sm-0 my-3 mb-0">
              <li class="list-inline-item text-center">
                <a href="https://www.linkedin.com/in/corrieleech/" class="fs-18 d-inline-block">
                  <i class="mdi mdi-linkedin"></i>
                </a>
              </li>
              <li class="list-inline-item text-center">
                <a href="https://twitter.com/corrieleech" class="fs-18 d-inline-block">
                  <i class="mdi mdi-twitter"></i>
                </a>
              </li>
              <li class="list-inline-item text-center">
                <a href="https://github.com/corrieleech" class="fs-18 d-inline-block"><i class="mdi mdi-github"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END FOOTER ALTER -->
</template>
