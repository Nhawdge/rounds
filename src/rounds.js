const { createApp } = Vue;

var app = createApp({
  data() {
    return {
      endTime: null,
      time: 0,
      totalTime: 0,
      timerId: null,
      currentState: "Idle",
      roundsData: {},
      userWeeklyGoal: null,
      userYearlyGoal: null,
    };
  },
  methods: {
    startRound(workTime, breakTime) {
      if (this.timerId) {
        clearInterval(this.timerId);
      }
      this.currentState = "Work";

      this.startTimer(workTime, () => {
        this.currentState = "Break";
        this.$refs.alarm.play();

        this.startTimer(breakTime, () => {
          this.$refs.alarm.play();
          this.currentState = "Idle";
          this.roundsData.rounds.push({ workTime, breakTime, points: workTime / 25, date: new Date().toLocaleString() });
          this.save();
        });
      });
    },
    logRound(workTime) {
      this.roundsData.rounds.push({ workTime, breakTime: 0, points: workTime / 25, date: new Date().toLocaleString() });
    },
    save() {
      localStorage.setItem("rounds", JSON.stringify(this.roundsData));
    },
    startTimer(timeInMinutes, endCallBack) {
      this.time = 1000 * 60 * timeInMinutes;
      this.totalTime = this.time;
      this.endTime = new Date(Date.now() + this.time);

      this.timerId = setInterval(() => {
        var now = new Date();
        var diff = this.endTime - now;
        this.time = diff;

        this.time -= 100;
        if (this.time <= 0) {
          clearInterval(this.timerId);
          endCallBack();
        }
      }, 100);
    },

    displayTime() {
      var minutes = ("00" + Math.floor(this.time / 1000 / 60)).substr(-2);
      var seconds = ("00" + Math.floor((this.time / 1000) % 60)).substr(-2);
      return `${minutes}:${seconds}`;
    },
    weeksThisYear() {
      var now = new Date();
      var start = new Date(now.getFullYear(), 0, 0);
      var diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
      var oneWeek = 1000 * 60 * 60 * 24 * 7;
      var week = Math.floor(diff / oneWeek);
      return week;
    },
    pointsThisWeek() {
      var data = this.roundsData.rounds || [];
      var pastSunday = new Date();
      pastSunday.setDate(pastSunday.getDate() - pastSunday.getDay());
      data.filter((x) => x.date > pastSunday);
      return data
        .map((x) => x.points)
        .reduce((a, c) => a + c, 0)
        .toFixed(2);
    },
    handStyle() {
      let rotate = -90 - (this.time / this.totalTime) * 360;

      return {
        transform: `rotate(${rotate}deg) translate(150px, 0px)`,
      };
    },
    updateGoal(e) {
      e.preventDefault();
      console.log(this.userGoal);
      this.roundsData.weeklyGoal = this.userWeeklyGoal;
      this.roundsData.yearlyGoal = this.userYearlyGoal;
      this.save();
    },
    clearAllGoals() {
      this.roundsData = { rounds: [], weeklyGoal: null, yearlyGoal: null };
      this.save();
    },
  },
  computed: {
    totalPoints: function () {
      return this.roundsData.rounds
        ?.map((x) => x.points)
        .reduce((a, c) => a + c, 0)
        .toFixed(2);
    },
    pointsTillGoal: function () {
      return (this.roundsData.weeklyGoal - this.totalPoints).toFixed(2);
    },
    shareText: function () {
      var currentYearExpectation = this.weeksThisYear() * this.roundsData.weeklyGoal;
      var currentYearActual = this.totalPoints;

      return `${this.pointsThisWeek()}/${this.roundsData.weeklyGoal} ${currentYearActual - currentYearExpectation}`;
    },
  },
  mounted() {
    var data = localStorage.getItem("rounds");
    if (data) {
      this.roundsData = JSON.parse(data);
    } else {
      this.roundsData = { rounds: [], goal: null };
    }
  },
});

// app.component('page', {
//     props: ['page'],
//     template: "#page",
//     methods:
//     {

//     },
// })

app.mount("#app");
