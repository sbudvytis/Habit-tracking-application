<template>
  <div id="app">
    <DateNavigation @navigateToDate="navigateToDate" />
    <router-view :date="selectedDate" />
  </div>
</template>

<script>
import { ref } from "vue";
import DateNavigation from "./components/Navigation.vue";

export default {
  components: {
    DateNavigation,
  },
  setup() {
    const selectedDate = ref(null);

    const navigateToDate = (date) => {
      selectedDate.value = date;
      router.push({ name: "date", params: { date } });
    };

    return {
      selectedDate,
      navigateToDate,
    };
  },
};
</script>
