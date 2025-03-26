document.addEventListener('DOMContentLoaded', async () => {
  const model = new MusicPlayerModel();
  const view = new MusicPlayerView(model);
  const controller = new MusicPlayerController(model, view);
  
  await model.fetchSongs();
  model.loadFromLocalStorage();
  view.render();
});