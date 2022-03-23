<template>
  <div class="home">
    <!-- start title -->
    <section class="section bg-light title-section">
      <div class="container">
        <div class="row align-items-center text-center">
          <div class="col-lg-12 mt-5 pt-3">
            <h2 class="fw-bold">What is BookSmart?</h2>
          </div>
        </div>
      </div>
    </section>
    <section class="sm-section">
      <div class="container">
        <div class="row align-items-center">
          <div class="col-lg-5">
            <div class="row">
              <div class="col-md-6 mt-4">
                <div class="mt-3">
                  <img src="/images/aliasgrace.jpeg" class="img-fluid rounded-3 border" alt="" />
                </div>
                <div class="mt-4">
                  <img src="/images/thingsfallapart.jpeg" class="img-fluid rounded-3 border" alt="" />
                </div>
              </div>
              <div class="col-md-6 my-auto">
                <div class="mt-md-0 mt-4">
                  <img src="/images/joyluckclub.jpeg" class="img-fluid rounded-3 border" alt="" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-6 offset-lg-1 mt-lg-0 mt-4">
            <div class="border-bottom py-3">
              <span class="text-primary"><i class="icon-md" data-feather="users"></i></span>
              <h4 class="lh-base mt-3">
                "The answers you get from literature depend on the questions you pose." — Margaret Atwood
              </h4>
            </div>
            <p class="text-muted pt-4">
              BookSmart is a place for book lovers who don't have the time, current network or desire to join an
              in-person book club but crave quality discussions about the books they read.
              <br />
              <br />
              Get started by joining a club or creating a new one.
            </p>
            <router-link to="/clubs" class="btn btn-primary mt-3">Join a Club</router-link>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
