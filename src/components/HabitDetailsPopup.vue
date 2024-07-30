<template>
  <div class="habit-details-popup" v-if="showPopupList">
    <div class="popup-content-list">
      <div class="symbol">
        <h2>
          <span class="material-symbols-outlined"> format_list_bulleted </span
          >10 Most recent dates for {{ habit.title }} habit
        </h2>
      </div>
      <ul v-if="recentCompletedDates.length > 0">
        <li v-for="completedDate in recentCompletedDates" :key="completedDate">
          {{ completedDate }} - Completed
        </li>
      </ul>
      <p v-else>This habit has never been completed</p>
      <button @click="closePopupList">Close</button>
    </div>
  </div>
</template>

<script>
import { computed } from "vue";

export default {
  props: {
    habit: Object,
    showPopupList: Boolean,
  },
  setup(props, { emit }) {
    const completedDates = computed(() => {
      return Object.keys(props.habit.completedDays)
        .filter((date) => props.habit.completedDays[date])
        .sort((a, b) => new Date(a) - new Date(b));
    });

    const recentCompletedDates = computed(() => {
      return completedDates.value.slice(-10);
    });

    const closePopupList = () => {
      emit("close-popup-list");
    };

    return {
      recentCompletedDates,
      closePopupList,
    };
  },
};
</script>

