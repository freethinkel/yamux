<script lang="ts">
  import EntityCard from "../components/EntityCard.svelte";
  import TrackCard from "../components/TrackCard.svelte";

  import { homeStore } from "../store/home";
  import { modalStore } from "../store/modal";
  import { playerStore } from "../store/player";
  import PlaylistSide from "./PlaylistSide.svelte";

  $: blocks = $homeStore.blocks;
</script>

<div class="wrapper">
  <h1>Главная</h1>

  {#each blocks as block}
    <div class="block">
      <h3 class="entity__title">{block.title}</h3>
      {#if block.type === "chart"}
        <div class="chart">
          {#each block.entities as entity}
            <TrackCard
              track={entity.data.track}
              on:select={() => playerStore.setTrack(entity.data.track)}
            />
          {/each}
        </div>
      {:else if block.type === "personal-playlists"}
        <div class="entities">
          {#each block.entities as entity}
            <div class="entity">
              <EntityCard
                title={entity.data.data.title}
                photo={entity.data.data.animatedCoverUri ||
                  entity.data.data.cover.uri}
                on:select={() => {
                  console.log(entity);
                  modalStore.openModal(PlaylistSide, {
                    isSidebar: true,
                    props: {
                      playlist: entity.data.data,
                      title: entity.data?.data?.title,
                    },
                  });
                }}
              />
            </div>
          {/each}
        </div>
      {:else if block.type === "podcasts"}
        <div class="entities">
          {#each block.entities as entity}
            <div class="entity">
              <EntityCard
                title={entity?.data.podcast.title}
                photo={entity?.data.podcast.coverUri}
                on:select={() => {
                  console.log(entity);
                  modalStore.openModal(PlaylistSide, {
                    isSidebar: true,
                    props: {
                      playlist: entity.data,
                      title: entity.data?.podcast.title,
                    },
                  });
                }}
              />
            </div>
          {/each}
        </div>
      {:else if block.type === "promotions"}
        <div class="entities">
          {#each block.entities as entity}
            <div class="entity">
              <EntityCard
                title={entity?.data.title}
                photo={entity?.data.image}
                on:select={() => {
                  console.log(entity);
                  // modalStore.openModal(SideTracklist, {
                  //   isSidebar: true,
                  //   props: {
                  //     // playlist: entity.data.,
                  //     title: entity.data?.title,
                  //   },
                  // });
                }}
              />
            </div>
          {/each}
        </div>
      {:else if block.type === "new-releases"}
        <div class="entities">
          {#each block.entities as entity}
            <div class="entity">
              <EntityCard
                title={entity?.data.title}
                photo={entity?.data.coverUri}
                on:select={() => {
                  console.log(entity);
                  modalStore.openModal(PlaylistSide, {
                    isSidebar: true,
                    props: {
                      title: entity.data?.title,
                      // playlist: { ...entity.data, kind: entity.data.id },
                    },
                  });
                }}
              />
            </div>
          {/each}
        </div>
      {:else if block.type === "new-playlists"}
        <div class="entities">
          {#each block.entities as entity}
            <div class="entity">
              <EntityCard
                title={entity?.data.title}
                photo={entity?.data.cover.uri}
                on:select={() => {
                  console.log(entity);
                  modalStore.openModal(PlaylistSide, {
                    isSidebar: true,
                    props: {
                      title: entity.data?.title,
                      playlist: entity.data,
                    },
                  });
                }}
              />
            </div>
          {/each}
        </div>
      {:else if block.type === "mixes"}
        <div class="entities">
          {#each block.entities as entity}
            <div
              class="entity"
              style={`--enitity-background-color: ${entity?.data.backgroundColor}`}
            >
              <EntityCard
                title={entity?.data.title}
                photo={entity?.data.backgroundImageUri}
                on:select={() => {
                  console.log(entity);
                  modalStore.openModal(PlaylistSide, {
                    isSidebar: true,
                    props: {
                      title: entity.data?.title,
                      playlist: entity.data,
                    },
                  });
                }}
              />
            </div>
          {/each}
        </div>
      {:else if block.type === "play-contexts"}
        <div class="entities">
          {#each block.entities as entity}
            <div class="entity">
              {#if entity.data.context === "artist"}
                <EntityCard
                  title={entity?.data.payload.name}
                  photo={entity?.data.payload.cover.uri}
                  on:select={() => {}}
                />
              {:else if entity.data.context === "playlist"}
                <EntityCard
                  title={entity.data.payload.title}
                  photo={entity.data.payload.cover.uri}
                  on:select={() => {
                    if (entity.data.context === "playlist")
                      modalStore.openModal(PlaylistSide, {
                        isSidebar: true,
                        props: {
                          title: entity.data.payload.title,
                          playlist: entity.data.payload,
                        },
                      });
                  }}
                />
              {:else if entity.data.context === "album"}
                <EntityCard
                  title={entity?.data.payload.title}
                  photo={entity?.data.payload.coverUri}
                  on:select={() => {}}
                />
              {/if}
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}
</div>

<style>
  .wrapper {
    padding: 0 12px;
  }

  .entities {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
    grid-gap: 8px;
    margin-top: 8px;
  }
  .entity {
    min-height: 150px;
  }

  .entity__title {
    margin-bottom: 6px;
  }

  .chart {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 8px;
  }

  .block {
    margin-top: 12px;
  }
</style>
