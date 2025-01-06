<script lang="ts">
  import '../app.css';

  const { children } = $props();
</script>

<svelte:head>
  <title>Tile</title>
  <meta name="description" content="A game." />
</svelte:head>

<div class="root">
  <header>
    <a href="/"><h1>Tile</h1></a>
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

    width: 768px;
    max-width: 90%;
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
