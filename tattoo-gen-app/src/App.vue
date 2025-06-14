<template>
  <v-app>
    <v-app-bar app color="white" flat>
      <v-toolbar-title class="text-h6 font-weight-bold">Tattoo Studio</v-toolbar-title>
      <v-spacer />
      <v-btn variant="text" to="/studio">Studio</v-btn>
      <v-btn variant="text" to="/packs">Prompt Packs</v-btn>
      <v-btn variant="text" to="/account">My Account</v-btn>
    </v-app-bar>

    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>
