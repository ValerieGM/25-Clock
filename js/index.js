$(document).ready(() => {
  const breakLength = $("#break-length");
  const breakIncrement = $("#break-increment");
  const breakDecrement = $("#break-decrement");

  const sessionLength = $("#session-length");
  const sessionIncrement = $("#session-increment");
  const sessionDecrement = $("#session-decrement");

  const stop = $("#stop");
  const start_stop = $("#start_stop");
  const reset = $("#reset");

  const beep = $("#beep");
  const timeLeft = $("#time-left");
  const timeLabel = $("#timer-label");

  //States
  const STATE = {
    BREAK: "Break Time",
    SESSION: "Session Time"
  }

  const STATE_CHANGE = {
    INCREMENT: "INCREMENT",
    DECREMENT: "DECREMENT"
  }

  let currentState = STATE.SESSION;
  let countDownInterval = null;

  // Helper functions
  const addZeros = (time) => {
    const current = time.toString();
    if (current.length === 1)
      return `0${current}`
    else
      return current;
  }

  const setTimer = (min, sec) => {
    timeLeft.text(`${addZeros(min)}:${addZeros(sec)}`);
  }

  // State Settings
  const clockState = () => start_stop.hasClass("active");

  const setTimeLength = (element, state) => {
    const time = parseInt(element.text());

    if (clockState())
      return;

    if (state === STATE_CHANGE.INCREMENT && time < 60) {
      element.text(time + 1);
    } else if (state === STATE_CHANGE.DECREMENT && time > 1) {
      element.text(time - 1);
    }
  }

  //Session Settings
  sessionIncrement.click(() => {
    setTimeLength(sessionLength, STATE_CHANGE.INCREMENT);

    if (clockState())
      return;

    setTimer(sessionLength.text(), 0);
  })

  sessionDecrement.click(() => {
    setTimeLength(sessionLength, STATE_CHANGE.DECREMENT);

    if (clockState())
      return;

    setTimer(sessionLength.text(), 0);
  })

  // Break Settings
  breakIncrement.click(() => {
    setTimeLength(breakLength, STATE_CHANGE.INCREMENT);
  });

  breakDecrement.click(() => {
    setTimeLength(breakLength, STATE_CHANGE.DECREMENT);
  });

  /* Button Settings */
  // Reset`
  reset.click(() => {
    if (clockState()) {
      start_stop.removeClass("active");
      clearInterval(countDownInterval);
    }

    beep.trigger("pause");
    beep.prop("currentTime", 0);

    currentState = STATE.SESSION;
    timeLabel.text(STATE.SESSION);
    breakLength.text(5);
    sessionLength.text(25);
    setTimer(25, 0);
  });

  // Stop
  stop.click(() => {
    if (clockState()) {
      start_stop.removeClass("active");
      clearInterval(countDownInterval);
    }

    beep.trigger("pause");
    beep.prop("currentTime", 0);

    if (currentState === STATE.BREAK) {
      setTimer(breakLength.text(), 0);
    } else {
      setTimer(sessionLength.text(), 0);
    }
  });

  // Start/Pause
  start_stop.click(() => {
    if (clockState()) {
      clearInterval(countDownInterval);
      start_stop.removeClass("active");
      return;
    } else {
      start_stop.addClass("active");
    }

    countDownInterval = setInterval(() => {
      const time = timeLeft.text().split(":");
      let mins = parseInt(time[0]);
      let secs = parseInt(time[1]);

      if (secs === 0) {
        if (mins === 0 && currentState === STATE.BREAK) {
          beep.trigger("play");
          currentState = STATE.SESSION;
          timeLabel.text(STATE.SESSION);
          console.log(timeLabel.text());
          setTimer(sessionLength.text(), 0);
          return;
        } else if (mins === 0 && currentState === STATE.SESSION) {
          beep.trigger("play");
          currentState = STATE.BREAK;
          timeLabel.text(STATE.BREAK);
          setTimer(breakLength.text(), 0);
          return;
        } else {
          secs = 59;
          mins--;
        }
      } else {
        secs--;
      }
      setTimer(mins, secs);
    }, 1000);
  });

  setTimer(25, 0);
  breakLength.text('5');
  sessionLength.text('25');
});