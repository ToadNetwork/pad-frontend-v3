<template>
  <v-row
  align="center"
  justify="center">
    <a class="dashboard-link" href="/">
    <v-icon>mdi-arrow-left</v-icon> Back to Dashboard</a>
  </v-row>
</template>

<style scoped>
.dashboard-link {
  background-color: rgba(20, 20, 20, 0.8);
  padding: 20px;
  border-radius: 20px;
  text-decoration: none;
  font-size: 1.1em;
  color: white;
}

.dashboard-link:hover {
  background-color: rgba(50, 50, 50, 1.0);
}
</style>