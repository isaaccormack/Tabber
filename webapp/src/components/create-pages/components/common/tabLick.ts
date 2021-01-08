import { throwFormattedError } from "../../../common/utils/formattingHelpers";
import { LickInterface } from "../../../common/lick/interface/LickInterface";

export const tabLick = (history: any,
                        file: File,
                        capo: number, tuning: string,
                        userHasAccount: boolean,
                        redirectURL: string) => {
  if (!file) return;

  history.push('/uploading')

  // must use FormData to send file
  const form = new FormData();
  form.append("file", file);
  form.append("tuning", tuning);
  form.append("capo", capo.toString());
  form.append("name", file.name);
  // form.append("skipTabbing", "true") // for dev
  fetch("/api/lick",{
    method: "POST",
    body: form
  })
    .then((response) => {
    if (response.status === 201) {
      return response.json()
    }
    throwFormattedError('Lick could not be tabbed', response.status, response.statusText);
  })
    .then((responseJson: LickInterface) => {
      if (userHasAccount) {
        history.push("/edit/" + responseJson.id);
      } else {
        history.push({ pathname: "/view",  state: { from: 'uploading' , lick: responseJson } });
      }
  })
    .catch((error) => {
      console.error(error)
      history.push({ pathname: redirectURL,  state: { from: 'uploading', msg: error.message } });
    })
}