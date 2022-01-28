<script context="module" lang="ts">
  export type TimeEvent = {
    color?: string;
    title: string;
    timeStart: Date;
    timeEnd: Date;
    description?: string;
  };

  export const getTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;

  const getOffsetFromDate = (date, height) =>
    (date.getHours() + date.getMinutes() / 60) * height;

  const getHeightFromDates = (dateStart, dateEnd, height) => {
    const offset = (dateEnd.getTime() - dateStart.getTime()) / 1000 / 60 / 60;
    return offset < 0 ? 0 : offset * height + 10;
  };
</script>

<script lang="ts">
  import EventCard from "./EventCard.svelte";

  export let events: TimeEvent[] = [];
  export let hourHeight: number = 80;
  const times = [...Array(24).keys()];
  let computedEvents = [];
  $: sortedEvents = events
    .slice()
    .sort((a, b) => a.timeStart.getTime() - b.timeStart.getTime());

  const getEventsCount = (curr, index) =>
    sortedEvents
      .slice(0, index)
      .filter(
        (e, i) =>
          (curr.timeEnd.getTime() <= e.timeEnd.getTime() &&
            curr.timeEnd.getTime() >= e.timeStart.getTime()) ||
          (curr.timeStart.getTime() >= e.timeStart.getTime() &&
            curr.timeStart.getTime() <= e.timeEnd.getTime()) ||
          (curr.timeEnd.getTime() <= e.timeEnd.getTime() &&
            curr.timeEnd.getTime() >= e.timeStart.getTime()) ||
          (curr.timeStart.getTime() <= e.timeEnd.getTime() &&
            curr.timeStart.getTime() >= e.timeStart.getTime()) ||
          (curr.timeEnd.getTime() >= e.timeEnd.getTime() &&
            curr.timeStart.getTime() <= e.timeStart.getTime())
      ).length;

  $: {
    const newEvents = sortedEvents.map((e, i) => {
      const total = getEventsCount(e, events.length);
      const left = getEventsCount(e, i);

      return {
        ...e,
        width: (1 / total) * 100,
        left: (left / total) * 100,
        height: getHeightFromDates(e.timeStart, e.timeEnd, hourHeight),
        top: getOffsetFromDate(e.timeStart, hourHeight),
      };
    });

    computedEvents = newEvents;
  }
</script>

<div class="wrapper">
  <div class="timelist">
    {#each times as time}
      <div class="timelist_item" style={`height: ${hourHeight}px`}>
        <div class="timelist_item__time">
          {getTime(new Date(new Date().setHours(time, 0, 0, 0)))}
        </div>
      </div>
    {/each}
  </div>

  <div class="events">
    <div class="events__inner">
      {#each computedEvents as event}
        <div
          class="event"
          style={`left: ${event.left}%; width: ${event.width}%; height: ${event.height}px; top: ${event.top}px`}
        >
          <EventCard
            title={event.title}
            description={event.description}
            timeEnd={event.timeEnd}
            timeStart={event.timeStart}
            color={event.color}
          />
        </div>
      {/each}
    </div>
  </div>
</div>

<style>
  .wrapper {
    border-left: 2px solid var(--color-primary);
    height: 100%;
    background: var(--color-black06);
    border-radius: var(--border-radius);
    overflow: auto;
    padding: 10px 0;
    position: relative;
  }
  .timelist_item {
    border-bottom: 1px solid var(--color-black12);
    font-size: 0.7rem;
    font-weight: bold;
    color: var(--color-black80);
    padding-left: 3px;
    padding-top: 2px;
  }
  .timelist_item__time {
    position: sticky;
    top: 2px;
  }

  .events {
    position: absolute;
    top: 10px;
    bottom: 0;
    width: 100%;
    padding-left: 42px;
  }
  .events__inner {
    position: relative;
  }
  .event {
    position: absolute;
    top: 120px;
    z-index: 100;
    padding-right: 12px;
    width: 100%;
    padding-bottom: 10px;
  }
</style>
