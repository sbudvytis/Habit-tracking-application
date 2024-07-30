<template>
  <div class="day-habit-popup" v-if="showPopup">
    <div class="popup-content">
      <div class="symbol">
        <h2>
          <span class="material-symbols-outlined"> checklist </span>Habits for
          {{ selectedDate }}
        </h2>
      </div>
      <ul v-if="habits.length > 0">
        <li v-for="(habit, index) in habits" :key="index">
          {{ habit.title }} -
          {{
            habit.completedDays[selectedDate] ? "Completed" : "Not Completed"
          }}
        </li>
      </ul>
      <p v-else>There are no habits to display.</p>
      <button @click="closePopup">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    selectedDate: String,
    habits: Array,
    showPopup: Boolean,
  },

  setup(props, { emit }) {
    const closePopup = () => {
      emit("close-popup");
    };

    return {
      closePopup,
    };
  },
};
</script>

