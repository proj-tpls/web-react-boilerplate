import clonedeep from 'lodash.clonedeep';
import Highlight from 'components/highlight';

export function arrayToTree(
  arr,
  id = 'id',
  pid = 'pid',
  children = 'children',
  callback,
) {
  const data = clonedeep(arr);
  const map = new Map();
  const res = [];

  for (let item of data) {
    let itemInMap = map.get(item[id]);
    let newItem = { ...itemInMap, ...item };
    map.set(item[id], newItem);

    if (typeof callback === 'function' && !callback(item)) {
      continue;
    }

    if (!newItem[pid]) {
      res.push(newItem);
    } else {
      let pItem = map.get(newItem[pid]);
      if (pItem) {
        pItem[children] || (pItem[children] = []);
        pItem[children].push(newItem);
      } else {
        pItem = {
          [id]: newItem[pid],
          [children]: [newItem],
        };
        map.set(pItem[id], pItem);
      }
    }
  }
  return res;
}

export function upOrDown(data) {
  const num = +data;
  if (isNaN(num)) {
    return data;
  }
  let color = 'black';
  if (num < 0) {
    color = 'green';
  } else if (num > 0) {
    color = 'red';
  }
  return <Highlight color={color}>{data}</Highlight>;
}
