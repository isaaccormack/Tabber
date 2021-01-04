export function getAudioFile(lickId: number) {
  return fetch("/api/licks/audio/" + lickId, {
    method: "GET"
  })
  .then((response) => {
    if (response.status === 200) {
      return response.blob();
    }
    throw new Error('Lick audio could not be retrieved: ' + response.status + ' (' + response.statusText + ')');
  })
}