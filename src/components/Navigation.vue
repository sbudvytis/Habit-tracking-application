<template>
  <p class="name">
    <span class="material-symbols-outlined"> person </span>Welcome back, user!
  </p>
  <div class="date-range">
    <button @click="prevWeek">
      <span class="material-symbols-outlined">arrow_back_ios</span>
    </button>
    <div class="date-range-text">{{ formatDateRange() }}</div>
    <button @click="nextWeek">
      <span class="material-symbols-outlined">arrow_forward_ios</span>
    </button>
  </div>

  <div class="date-navigation">
    <div class="date-header">
      <span
        v-for="day in days"
        :key="day.date"
        :class="['date-cell', { today: day.isToday }]"
        @click="openDayHabitPopup(day)"
      >
        <div class="day-name">{{ day.name }}</div>
        <div class="day-number">{{ day.number }}</div>
      </span>
    </div>
    <HabitList
      :habits="habits"
      @save-habits="saveHabits"
      :selectedDate="selectedDate"
      :days="days"
    />
    <DayHabitPopup
      :selectedDate="selectedDate"
      :habits="habits"
      :showPopup="showDayHabitPopup"
      v-if="showDayHabitPopup"
      @close-popup="showDayHabitPopup = false"
    />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from "vue";
import HabitList from "./HabitTracker.vue";
import { useRouter } from "vue-router";
import DayHabitPopup from "./DayHabitPopup.vue";

export default {
  components: {
    HabitList,
    DayHabitPopup,
  },
  setup() {
    const currentDate = ref(new Date());
    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const minDate = new Date("2023-01-01");
    const newHabit = ref("");
    const habits = ref([]);
    const days = ref([]);
    const selectedDate = ref("");
    const showDayHabitPopup = ref(false);

    const router = useRouter();

    const calculateStartOfWeek = (date) => {
      const dayOfWeek = date.getDay();
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
      return new Date(date.setDate(diff));
    };

    const calculateEndOfWeek = (date) => {
      const startOfWeek = calculateStartOfWeek(date);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return endOfWeek;
    };

    const startDate = computed(() => {
      return calculateStartOfWeek(currentDate.value);
    });

    const endDate = computed(() => {
      return calculateEndOfWeek(currentDate.value);
    });

    // Watch for changes in currentDate and regenerate days
    watch(currentDate, () => {
      generateDays();
    });

    const habitsForSelectedDate = computed(() => {
      return habits.value.filter((habit) => habit.date === selectedDate.value);
    });

    const generateDays = () => {
      const startDateValue = new Date(startDate.value);
      startDateValue.setDate(
        startDateValue.getDate() - ((startDateValue.getDay() - 1 + 7) % 7)
      );

      days.value = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDateValue);
        date.setDate(startDateValue.getDate() + i);

        const dayOfMonth = date.getDate();
        const formattedDate = date.toISOString().split("T")[0];
        const isToday = formattedDate === currentDay.value;

        days.value.push({
          name: daysOfWeek[i],
          number: dayOfMonth.toString().padStart(2, "0"),
          date: formattedDate,
          isToday: isToday,
        });
      }
    };

    const currentDay = computed(() => {
      return new Date().toISOString().split("T")[0];
    });

    const prevWeek = () => {
      const newDate = new Date(currentDate.value);
      newDate.setDate(newDate.getDate() - 7);
      if (newDate >= minDate) {
        currentDate.value = newDate;
      }
    };

    const nextWeek = () => {
      const newDate = new Date(currentDate.value);
      newDate.setDate(newDate.getDate() + 7);
      if (newDate <= new Date()) {
        currentDate.value = newDate;
      }
    };

    const formatDateRange = () => {
      const startMonth = startDate.value.toLocaleString("default", {
        month: "short",
      });
      const endMonth = endDate.value.toLocaleString("default", {
        month: "short",
      });

      const startDay = startDate.value.getDate();
      const endDay = endDate.value.getDate();

      return `${startDay} ${startMonth} - ${endDay} ${endMonth}`;
    };

    onMounted(() => {
      generateDays();
      const savedHabits = localStorage.getItem("habits");
      if (savedHabits) {
        habits.value = JSON.parse(savedHabits);
      }
    });

    const openDayHabitPopup = (day) => {
      if (day !== "") {
        const selectedDateValue = new Date(day.date);
        if (selectedDateValue > endDate.value) {
          selectedDateValue.setDate(selectedDateValue.getDate() + 7);
          currentDate.value = new Date(selectedDateValue);
          generateDays();
        }
        selectedDate.value = selectedDateValue.toISOString().split("T")[0];
        showDayHabitPopup.value = true;
        router.push({ name: "day", params: { date: selectedDate.value } });
      }
    };

    return {
      currentDate,
      daysOfWeek,
      minDate,
      newHabit,
      habits,
      days,
      selectedDate,
      startDate,
      endDate,
      habitsForSelectedDate,
      prevWeek,
      nextWeek,
      formatDateRange,
      showDayHabitPopup,
      openDayHabitPopup,
    };
  },
};
</script>

<style>
.name {
  color: rgb(172 170 223 / 87%);
  font-size: 20px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: left;
  margin-left: 50px;
  margin-bottom: 50px;
}

.date-navigation {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.date-range {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  margin-bottom: 10px;
}

.date-range-text {
  text-align: center;
}

.date-range button {
  color: rgb(255 255 255 / 87%);
  border: none;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 600;
  font-family: inherit;
  background: none;
  cursor: pointer;
  transition: none;
}

.date-range button:hover {
  background: none;
  border: none;
}

.date-header {
  display: flex;
  gap: 10px;
  padding: 20px;
}

.date-cell {
  color: #5c6381;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  width: 40px;
  height: 40px;
}

.today {
  color: rgb(255 255 255);
  font-weight: bold;
}

.day-name {
  font-weight: bold;
}

.day-number {
  font-size: 14px;
}

@media (width <= 768px) {
  .date-header {
    flex-wrap: wrap;
    justify-content: center;
  }

  .date-cell {
    width: 5%;
  }
}
</style>
