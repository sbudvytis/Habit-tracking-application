<template>
  <div class="habit-list">
    <div v-if="habits.length === 0">
      <p class="empty-message">
        Currently there are no habits to track. Please add new habit.
      </p>
    </div>
    <div v-else>
      <div
        v-for="(habit, index) in habits"
        :key="index"
        class="habit-item-container"
      >
        <div class="habit-title">
          <h2 @click="openHabitDetailsPopup(habit)">{{ habit.title }}</h2>
          <button @click="openEditPopup(habit)" alt="edit">
            <span class="material-symbols-outlined">edit_square</span>
          </button>
        </div>
        <div class="habit-item">
          <div v-for="(day, index) in days" :key="index" class="day-checkbox">
            <input
              type="checkbox"
              :checked="habit.completedDays[day.date]"
              :disabled="!isPastDay(day) || habit.stopped"
              @change="markHabitCompleted(habit, day.date)"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="center-button-container">
      <button @click="openAddHabitPopup" class="icon-button">
        <span class="material-symbols-outlined">add</span> Add habit
      </button>
    </div>
    <!-- Habit Input Popup -->
    <div v-if="showAddHabitPopup" class="habit-input-popup">
      <div class="habit-input-content">
        <div class="input-container">
          <input
            v-model="newHabit"
            @keyup.enter="addHabit"
            placeholder="Add a new habit or task"
          />
        </div>
        <div class="button-container">
          <button @click="addHabit">Add</button>
          <button @click="closeAddHabitPopup">Cancel</button>
        </div>
      </div>
    </div>
    <!-- Edit Habit Popup -->
    <div v-if="showEditHabitPopup" class="habit-input-popup">
      <div class="habit-input-content">
        <div class="input-container">
          <input v-model="editedHabit.title" placeholder="Edit habit title" />
        </div>
        <div class="button-container">
          <button @click="renameHabit">Rename</button>
          <button @click="toggleStopHabit">
            {{ editedHabit.stopped ? "Revoke" : "Stop" }}
          </button>
          <button @click="deleteHabit">Delete</button>
          <button @click="closeEditHabitPopup">Cancel</button>
        </div>
      </div>
    </div>
  </div>
  <HabitDetailsPopup
    :habit="selectedHabit"
    :showPopupList="showHabitDetailsPopup"
    @close-popup-list="showHabitDetailsPopup = false"
  />
</template>

<script>
import swal from "sweetalert";
import { ref } from "vue";
import HabitDetailsPopup from "./HabitDetailsPopup.vue";

export default {
  components: {
    HabitDetailsPopup,
  },
  emits: ["save-habits"],
  props: {
    habitTitle: String,
    habits: Array,
    selectedDate: String,
    days: Array,
  },
  setup(props, { emit }) {
    const newHabit = ref("");
    const showAddHabitPopup = ref(false);
    const showEditHabitPopup = ref(false);
    const editedHabit = ref(null);
    const selectedHabit = ref(null);
    const showHabitDetailsPopup = ref(false);

    const addHabit = () => {
      const MAX_HABIT_LENGTH = 35;

      if (newHabit.value.trim() !== "") {
        if (newHabit.value.length <= MAX_HABIT_LENGTH) {
          // Calculate the maximum id from existing habits
          const existingIds = props.habits.map((habit) => habit.id);
          const maxId = Math.max(...existingIds, 0);

          const newHabitValue = {
            id: maxId + 1,
            title: newHabit.value,
            completedDays: {},
          };
          props.days.forEach((day) => {
            newHabitValue.completedDays[day.date] = false;
          });
          props.habits.push(newHabitValue);
          newHabit.value = "";
          saveHabits();
          closeAddHabitPopup();
        } else {
          swal(
            "Oops!",
            "Habit title should be 30 characters or less!",
            "error"
          );
        }
      }
    };

    const isPastDay = (day) => {
      const today = new Date();
      const dayDate = new Date(day.date);
      return dayDate <= today;
    };

    const openEditPopup = (habit) => {
      editedHabit.value = { ...habit };
      showEditHabitPopup.value = true;
    };

    const closeEditHabitPopup = () => {
      editedHabit.value = null;
      showEditHabitPopup.value = false;
    };

    const renameHabit = () => {
      const MAX_HABIT_LENGTH = 35;

      if (editedHabit.value.title.trim() !== "") {
        if (editedHabit.value.title.length <= MAX_HABIT_LENGTH) {
          const habitId = editedHabit.value.id;
          const habitToUpdate = props.habits.find(
            (habit) => habit.id === habitId
          );
          if (habitToUpdate) {
            habitToUpdate.title = editedHabit.value.title;
            saveHabits();
            closeEditHabitPopup();
          }
        } else {
          swal(
            "Oops!",
            "Habit title should be 30 characters or less!",
            "error"
          );
        }
      }
    };

    const stopHabit = () => {
      const habitId = editedHabit.value.id;
      const habitToUpdate = props.habits.find((habit) => habit.id === habitId);
      if (habitToUpdate) {
        habitToUpdate.stopped = true;
        saveHabits();
        closeEditHabitPopup();
      }
    };

    const toggleStopHabit = () => {
      if (editedHabit.value) {
        const habitId = editedHabit.value.id;
        const habitToUpdateIndex = props.habits.findIndex(
          (habit) => habit.id === habitId
        );
        if (habitToUpdateIndex !== -1) {
          props.habits[habitToUpdateIndex].stopped =
            !props.habits[habitToUpdateIndex].stopped;
          saveHabits();
          closeEditHabitPopup();
        }
      }
    };

    const deleteHabit = () => {
      if (editedHabit.value) {
        const habitId = editedHabit.value.id;
        const habitToDeleteIndex = props.habits.findIndex(
          (habit) => habit.id === habitId
        );
        if (habitToDeleteIndex !== -1) {
          props.habits.splice(habitToDeleteIndex, 1);
          saveHabits();
          closeEditHabitPopup();
        }
      }
    };

    const markHabitCompleted = (habit, dayIndex) => {
      if (!habit.stopped) {
        habit.completedDays[dayIndex] = !habit.completedDays[dayIndex];
        saveHabits();
      }
    };

    const saveHabits = () => {
      localStorage.setItem("habits", JSON.stringify(props.habits));
      emit("save-habits", props.habits);
    };

    const openAddHabitPopup = () => {
      showAddHabitPopup.value = true;
    };

    const closeAddHabitPopup = () => {
      showAddHabitPopup.value = false;
    };

    const openHabitDetailsPopup = (habit) => {
      selectedHabit.value = habit; // Set the selected habit
      showHabitDetailsPopup.value = true;
    };

    return {
      newHabit,
      showAddHabitPopup,
      addHabit,
      showEditHabitPopup,
      openEditPopup,
      closeEditHabitPopup,
      stopHabit,
      toggleStopHabit,
      renameHabit,
      deleteHabit,
      editedHabit,
      markHabitCompleted,
      saveHabits,
      openAddHabitPopup,
      closeAddHabitPopup,
      isPastDay,
      selectedHabit,
      showHabitDetailsPopup,
      openHabitDetailsPopup,
    };
  },
};
</script>

<style>
.habit-item-container {
  display: flex;
  flex-direction: column;
  margin: 20px;
  gap: 10px;
  background-color: #2c3041;
  border-radius: 10px;
  padding: 20px;
}

.empty-message {
  text-align: center;
  font-size: 18px;
  margin: 20px;
  background-color: #464665;
  border-radius: 10px;
  padding: 20px;
}

.habit-title {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.habit-title h2 {
  text-align: center;
}

.habit-title button {
  position: absolute;
  right: 0;
  margin-right: 10px;
  color: rgb(223 222 255 / 87%);
  border: none;
  font-family: inherit;
  background: none;
  cursor: pointer;
  transition: none;
}

.habit-title button:hover {
  transition: color 0.25s;
  color: #7950f2;
  background: none;
  border: none;
}

.habit-item {
  display: flex;
  align-items: center;
  margin: 0 20px 20px;
  gap: 10px;
  background-color: #464665;
  border-radius: 10px;
  padding: 20px;
}

.habit-list {
  border-radius: 10px;
  padding: 20px;
  align-items: center;
  text-align: center;
}

</style>
