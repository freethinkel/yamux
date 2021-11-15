<script lang="ts" context="module">
  export type CalendarEvents = Record<string, number>;

  const weeks = [...Array(7).keys()];
  const rusWeekMap = [6, 0, 1, 2, 3, 4, 5];
  const weeksMap = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

  const getMonthList = (date: Date) => {
    const days = Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));
    const offset = rusWeekMap[new Date(new Date(date).setDate(1)).getDay()];

    for (let week = 0; week < days.length; week++) {
      for (let day = 0; day < days[week].length; day++) {
        days[week][day] = new Date(
          new Date(date).setDate(7 * week + day - offset + 1)
        );
      }
    }

    return days.filter(
      (week) => !week.every((e) => e.getMonth() !== date.getMonth())
    );
  };

  const compareDates = (a: Date, b: Date) => {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  };

  const rusMonth = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь",
  ];

  const getDateToString = (date: Date) => {
    return `${date.getDate().toString().padStart(2, "0")}_${date
      .getMonth()
      .toString()
      .padStart(2, "0")}_${date.getFullYear()}`;
  };
</script>

<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Button from "./Button.svelte";
  import Icon from "./Icon.svelte";

  export let month: Date = new Date();
  export let selectedDate: Date = new Date();
  export let events: CalendarEvents = {};

  const dispatch = createEventDispatcher();

  $: daysOfMonth = getMonthList(month);

  const onSelectDate = (date: Date) => {
    if (date.getMonth() !== month.getMonth()) {
      onChangeMonth(date);
    }
    dispatch("selectDate", date);
  };
  const onChangeMonth = (date: Date) => dispatch("changeMonth", date);
</script>

<div class="wrapper">
  <div class="toolbar">
    <Button
      on:click={() =>
        onChangeMonth(new Date(month.setMonth(month.getMonth() - 1)))}
      mode="outlined"
      size="small"><Icon name="chevron-left" /></Button
    >
    <span class="toolbar__month">
      {rusMonth[month.getMonth()]}
      <span class="toolbar__year">{month.getFullYear()}</span>
    </span>
    <Button
      on:click={() =>
        onChangeMonth(new Date(month.setMonth(month.getMonth() + 1)))}
      mode="outlined"
      size="small"><Icon name="chevron-right" /></Button
    >
  </div>
  <table>
    <thead>
      <tr>
        {#each weeks as week}
          <th>
            <div class="head__week" class:head__week__weekend={week >= 5}>
              {weeksMap[week]}
            </div>
          </th>
        {/each}
      </tr>
    </thead>
    <tbody>
      {#each daysOfMonth as week}
        <tr>
          {#each week as day}
            <td>
              <button
                on:click={() => onSelectDate(day)}
                class="day_item"
                class:day_item__today={compareDates(day, new Date())}
                class:day_item__selected={compareDates(day, selectedDate)}
                class:day_item__current_month={day.getMonth() ===
                  month.getMonth()}
                class:day_item__weekend={rusWeekMap[day.getDay()] >= 5}
              >
                {day.getDate()}
                {#if events[getDateToString(day)]}
                  <div class="day_item__events">
                    {#each Array(events[getDateToString(day)] > 4 ? 4 : events[getDateToString(day)]) as _}
                      <div class="day_item__event" />
                    {/each}
                  </div>
                {/if}
              </button>
            </td>
          {/each}
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .toolbar :global(button) {
    padding: 0;
    width: 32px;
    height: 32px;
    --button-gap: 0;
    justify-content: center;
    margin-bottom: 6px;
  }

  .toolbar__month {
    font-weight: bold;
  }

  .day_item {
    appearance: none;
    outline: none;
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius);
    background: var(--color-black06);
    width: 32px;
    height: 32px;
    border: 1px solid transparent;
    font-size: 0.9rem;
    padding: 0;
    transition: var(--transition);
    color: var(--color-black);
    opacity: 0.6;
  }
  .day_item__today {
    background-color: var(--color-primary12);
    border-color: var(--color-primary);
    color: var(--color-primary);
  }
  .day_item__current_month {
    opacity: 1;
  }
  .day_item__weekend {
    color: var(--color-black80, rgba(255, 85, 85, 1));
  }

  .day_item__selected {
    background-color: var(--color-primary);
    color: var(--color-white);
  }
  .day_item__selected .day_item__event {
    background-color: var(--color-white);
  }
  .day_item__selected.day_item__weekend {
    background-color: var(--color-red, rgba(255, 85, 85, 1));
  }
  .head__week {
  }
  .head__week__weekend {
    color: var(--color-red, rgba(255, 85, 85, 1));
  }
  .day_item__events {
    position: absolute;
    bottom: 2px;
    left: 0;
    display: flex;
    justify-content: center;
    gap: 2px;
    overflow: hidden;
    width: 100%;
  }
  .day_item__event {
    width: 5px;
    height: 5px;
    min-width: 5px;
    background-color: var(--color-primary);
    border-radius: 2px;
  }
</style>
