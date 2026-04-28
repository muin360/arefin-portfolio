// /lib/sanity.ts

export const projectId = "skiYTgO73Ck2p07URnLWwlq4wwpcRfRWQ4NEQ6gboGz3Lwtsyq5r3XDo8dH51k0IfNvBbPDbmfgULl5lXllEMStRfeTMawWecDGbsSRvy5BAxak5SHOTEowJ854bar3iEQWvNNTU4GBobXqyuOhHenCbp4qWwBj7F2B4ohBTgI6gXDRPJmhH";
export const dataset = "production";
export const apiVersion = "2024-01-01";

export const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}`;

export async function getPosts() {
  const query = encodeURIComponent(`*[_type == "post"]{_id, title}`);
  const res = await fetch(`${url}?query=${query}`);
  const data = await res.json();
  return data.result;
}