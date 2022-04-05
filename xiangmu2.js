// 'http://music.eleuu.com/personalized?limit=3'
const Ajax = (method, url, data) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.send(data);
    xhr.onreadystatechange = () => {
      if (xhr.readyState == 4) {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
          let res = JSON.parse(xhr.response);
          resolve(res);
        } else {
          reject("请求失败");
        }
      }
    };
  });
};

const songList = document.getElementsByClassName("song-list")[0];
// 使用promise then方法来处理异步请求
Ajax(`get`, `http://music.eleuu.com/personalized?limit=10`).then(
  (res) => {
    const { result } = res;
    for (let item of result) {
      const { id, picUrl, name } = item;
      // 获取页面dom元素
      const songlistitem = document.createElement("div");
      const itemImg = document.createElement("img");
      const itemText = document.createElement("span");
      // 给dom元素添加类名来应用css样式
      songlistitem.className = "songlistitem";
      itemImg.className = "item-img";
      itemText.className = "item-text";
      // 把远程获取到的数据装载到dom元素上
      itemImg._id = id;
      itemText._id = id;
      itemImg.src = picUrl;
      itemText.innerText = name;
      // 进行dom结构的填充
      songlistitem.appendChild(itemImg);
      songlistitem.appendChild(itemText);
      songList.appendChild(songlistitem);
    }
  },
  (err) => {
    console.log("失败");
  }
);

songList.addEventListener("click", (e) => {
  const { _id } = e.target;
  Ajax(`get`, `http://music.eleuu.com/playlist/detail?id=${_id}`).then(
    (res) => {
      const {
        playlist: { tracks },
      } = res;
      const songDiv = document.querySelector("#songDiv");
      let number=songDiv.children.length;
      if(number==0){
        for (let item of tracks) {
          const { name, id } = item;
          const song = document.createElement("div");
          song.className = "song";
          song.innerText = name;
          song._id = id;
          songDiv.appendChild(song);
        }
      }
      else{
        songDiv.innerText="";
      }
     
      songDiv.addEventListener("click", (e) => {
        const { _id } = e.target;
        Ajax(`get`, `http://music.eleuu.com/lyric?id=${_id}`).then((res) => {
          const {
            lrc: { lyric },
          } = res;
          const geCiDiv = document.querySelector("#geCiDiv");
          geCiDiv.innerText = lyric;
        });
      });
    }
  );
});
