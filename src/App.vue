<script>
export default {
  data: function () {
    return {
      isLoggedIn: !!localStorage.jwt,
      id: 1,
    };
  },
  watch: {
    $route: function () {
      this.isLoggedIn = !!localStorage.jwt;
    },
  },
};
</script>

<template>
  <nav>
    <router-link to="/about">About</router-link>
    |
    <router-link to="/clubs">All Clubs</router-link>
    |
    <router-link to="/signup" v-if="!isLoggedIn">Sign Up</router-link>
    |
    <router-link to="/login" v-if="!isLoggedIn">Log In</router-link>
    |
    <router-link to="/logout" v-if="isLoggedIn">Log Out</router-link>
    |
    <router-link to="/clubs/new" v-if="isLoggedIn">Create a Club</router-link>
    |
    <router-link v-bind:to="`/users/${id}`" v-if="isLoggedIn">My Profile</router-link>
  </nav>
  <router-view />
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
