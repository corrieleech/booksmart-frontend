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
    <!-- light-dark mode button -->
    <a
      href="javascript: void(0);"
      id="mode"
      data-class="light"
      class="p-3 text-white rounded-circle mode-btn"
      onclick="changeMode(event)"
    >
      <i class="icon-xs fs-24 mode-dark" data-feather="moon"></i>
      <i class="icon-xs fs-24 bx-spin mode-light" data-feather="sun"></i>
    </a>
    <!-- Start Navbar -->
    <nav class="navbar navbar-expand-lg fixed-top sticky mx-auto" id="navbar">
      <div class="container">
        <router-link to="/clubs" class="navbar-brand me-4">
          <img src="/images/logo-light.png" class="logo-light" alt="" height="40" />
          <img src="/images/booksmartlogosmall.png" class="logo-dark" alt="" height="40" />
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
              <router-link to="/about" class="nav-link sub-menu-item">About</router-link>
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
            <router-link to="/login" v-if="!isLoggedIn" class="log-text fw-semibold fs-16 me-4 pe-4 border-end">
              Log In
            </router-link>
            <router-link
              v-bind:to="`/users/${profile}`"
              v-if="isLoggedIn"
              class="log-text fw-semibold fs-16 me-4 pe-4 border-end"
            >
              My Profile
            </router-link>
            <a href="cart.html" class="cart-icon position-relative d-inline-block">
              <span class="cart-count bg-danger text-white fw-medium text-center rounded-circle shadow fs-12"></span>
              <i class="icon-s" data-feather="shopping-cart"></i>
            </a>
          </div>
        </div>
      </div>
    </nav>
    <!-- END NAVBAR -->

    <section class="section">
      <router-view />
    </section>

    <!-- START FOOTER ALTER -->
    <div class="footer-alter bg-light py-3">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-6">
            <div class="text-muted">
              2022 &copy; Xacon by
              <a class="text-dark text-decoration-underline" href="#!">Pichforest</a>
            </div>
          </div>
          <div class="col-lg-6">
            <ul class="list-inline d-sm-flex social-circle float-sm-end my-sm-0 my-3 mb-0">
              <li class="list-inline-item text-center">
                <a href="javascript:void(0)" class="fs-18 d-inline-block"><i class="mdi mdi-facebook"></i></a>
              </li>
              <li class="list-inline-item text-center">
                <a href="javascript:void(0)" class="fs-18 d-inline-block"><i class="mdi mdi-twitter"></i></a>
              </li>
              <li class="list-inline-item text-center">
                <a href="javascript:void(0)" class="fs-18 d-inline-block"><i class="mdi mdi-google"></i></a>
              </li>
              <li class="list-inline-item text-center">
                <a href="javascript:void(0)" class="fs-18 d-inline-block"><i class="mdi mdi-instagram"></i></a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- END FOOTER ALTER -->
</template>
