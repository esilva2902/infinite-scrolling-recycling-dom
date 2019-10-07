const _getCatImg = () => {
    const randomNum = () => {
      return Math.floor(Math.random() * 100000);
    };
    const url = "https://source.unsplash.com/collection/139386/100x100/?sig=";
    return url + randomNum();
  };
  
  let topSentinelPreviousY = 0;
  let topSentinelPreviousRatio = 0;
  let bottomSentinelPreviousY = 0;
  let bottomSentinelPreviousRatio = 0;
  
  let listSize = 20;
  let DBSize = 200;
  
  const initDB = num => {
      const db = [];
    for (let i = 0; i < num; i++) {
        db.push({
          catCounter: i,
        title: `cat image number ${i}`,
        imgSrc: _getCatImg()
      })
    }
    return db;
  }
  
  let DB = [];
  
  let currentIndex = 0;
  
  const initList = num => {
      const container = document.querySelector(".cat-list");
    
    for (let i = 0; i < num; i++) {
        const tile = document.createElement("LI");
      tile.setAttribute("class", "cat-tile");
      tile.setAttribute("id", "cat-tile-" + i);
      const title = document.createElement("H3");
      const t = document.createTextNode(DB[i].title);
      title.appendChild(t);
      tile.appendChild(title);
      const img = document.createElement("IMG");
      img.setAttribute("src", DB[i].imgSrc);
      tile.appendChild(img);
        container.appendChild(tile);
    }
    
  }
  
  const getSlidingWindow = isScrollDown => {
      const increment = listSize / 2;
      let firstIndex;
    
    if (isScrollDown) {
        firstIndex = currentIndex + increment;
    } else {
      firstIndex = currentIndex - increment;
    }
    
    if (firstIndex < 0) {
        firstIndex = 0;
    }
    
    return firstIndex;
  }
  
  const recycleDOM = firstIndex => {
      for (let i = 0; i < listSize; i++) {
        const tile = document.querySelector("#cat-tile-" + i);
      tile.firstElementChild.innerText = DB[i + firstIndex].title;
      tile.lastChild.setAttribute("src", DB[i + firstIndex].imgSrc);
    }
  }
  
  const getNumFromStyle = numStr => Number(numStr.substring(0, numStr.length - 2));
  
  const adjustPaddings = isScrollDown => {
      const container = document.querySelector(".cat-list");
    const currentPaddingTop = getNumFromStyle(container.style.paddingTop);
    const currentPaddingBottom = getNumFromStyle(container.style.paddingBottom);
    const remPaddingsVal = 170 * (listSize / 2);
      if (isScrollDown) {
        container.style.paddingTop = currentPaddingTop + remPaddingsVal + "px";
      container.style.paddingBottom = currentPaddingBottom === 0 ? "0px" : currentPaddingBottom - remPaddingsVal + "px";
    } else {
        container.style.paddingBottom = currentPaddingBottom + remPaddingsVal + "px";
      container.style.paddingTop = currentPaddingTop === 0 ? "0px" : currentPaddingTop - remPaddingsVal + "px";
      
    }
  }
  
  const topSentCallback = entry => {
      if (currentIndex === 0) {
          const container = document.querySelector(".cat-list");
        container.style.paddingTop = "0px";
        container.style.paddingBottom = "0px";
    }
  
    const currentY = entry.boundingClientRect.top;
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;
  
    // conditional check for Scrolling up
    if (
      currentY > topSentinelPreviousY &&
      isIntersecting &&
      currentRatio >= topSentinelPreviousRatio &&
      currentIndex !== 0
    ) {
      const firstIndex = getSlidingWindow(false);
      adjustPaddings(false);
      recycleDOM(firstIndex);
      currentIndex = firstIndex;
    }
  
    topSentinelPreviousY = currentY;
    topSentinelPreviousRatio = currentRatio;
  }
  
  const botSentCallback = entry => {
      if (currentIndex === DBSize - listSize) {
        return;
    }
    const currentY = entry.boundingClientRect.top;
    const currentRatio = entry.intersectionRatio;
    const isIntersecting = entry.isIntersecting;
  
    // conditional check for Scrolling down
    if (
      currentY < bottomSentinelPreviousY &&
      currentRatio > bottomSentinelPreviousRatio &&
      isIntersecting
    ) {
      const firstIndex = getSlidingWindow(true);
      adjustPaddings(true);
      recycleDOM(firstIndex);
      currentIndex = firstIndex;
    }
  
    bottomSentinelPreviousY = currentY;
    bottomSentinelPreviousRatio = currentRatio;
  }
  
  const initIntersectionObserver = () => {
    const options = {
        /* root: document.querySelector(".cat-list") */
    }
  
    const callback = entries => {
      entries.forEach(entry => {
        if (entry.target.id === 'cat-tile-0') {
          topSentCallback(entry);
        } else if (entry.target.id === `cat-tile-${listSize - 1}`) {
          botSentCallback(entry);
        }
      });
    }
  
    var observer = new IntersectionObserver(callback, options);
    observer.observe(document.querySelector("#cat-tile-0"));
    observer.observe(document.querySelector(`#cat-tile-${listSize - 1}`));
  }
  
  const start = () => {
      const input1 = document.querySelector("#input1");
    const input2 = document.querySelector("#input2");
    if (!input1.value) {
        DBSize = 200;
      input1.value = DBSize;
    } else {
        DBSize = input1.value;
    }
    
    if (input2.value < 20) {
        listSize = 20;
      input2.value = 20;
    } else {
        listSize = input2.value;
    }
    DB = initDB(DBSize);
      initList(listSize);
      initIntersectionObserver();
    
    input1.style.display = "none";
    input2.style.display = "none";
    document.querySelector("#start-btn").style.display = "none";
  }