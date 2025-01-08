<script lang="ts">
  import '../app.css';

  const { children } = $props();
</script>

<svelte:head>
  <title>Splatris</title>
  <meta name="description" content="Fast-paced, colorful, block-dropping area control!" />
</svelte:head>

<div class="root">
  <header>
    <h1 class="title">Splatris</h1>
  </header>

  <main>
    <div class="main-content">
      {@render children()}
    </div>
  </main>
</div>

<style>
  .root {
    display: flex;
    flex-flow: column;
    align-items: center;
    height: 100vh;
  }

  header {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 768px;
    max-width: 90%;
  }

  .title {
    font-family: var(--title-font);
    font-size: 4rem;
    font-weight: bold;
    margin: 1rem;
    background: linear-gradient(90deg, red, orange, yellow, green, blue, indigo, violet);
    background-clip: text;
    color: transparent;
  }

  main {
    width: 100%;
    flex: 1;

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: auto;
  }

  .main-content {
    display: flex;
    flex-direction: column;

    width: 768px;
    max-width: 90%;

    height: 100%;
  }
</style>
