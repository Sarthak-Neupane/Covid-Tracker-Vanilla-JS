let deferredPrompt;
const addBtn = document.querySelector('.add-button');
addBtn.style.bottom = '-100%';

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  addBtn.style.bottom = '0';

  addBtn.addEventListener('click', (e) => {
    addBtn.style.bottom = '-100%';
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        deferredPrompt = null;
      });
  });
});

const chart = document.getElementById("chart");
const loading = document.querySelector(".loading");
const main = document.querySelector("main");

const container = document.querySelector(".container");

const total = document.querySelector(".total");
const newConfirmed = document.querySelector(".new");

const newDeaths = document.querySelector(".newDeaths");
const totalDeaths = document.querySelector(".totalDeaths");
const newRecovered = document.querySelector(".newRecovered");
const totalRecovered = document.querySelector(".totalRecovered");

const searchBar = document.querySelector('.searchBar')
const button = document.querySelector('.button')
const reset = document.querySelector('.reset')


const FooterDate = [...document.querySelectorAll(".footer > p")];
const BaseUrl = "https://api.covid19api.com/";
const url1 = `${BaseUrl}world`;
const url2 = `${BaseUrl}summary`;

const options = {
  headers: {
    Accept: "application/json",
  },
};

let global;
let summary;
let dataLabels = [];
let labels = [];

window.addEventListener("load", async () => {

  gsap.registerPlugin(ScrollTrigger);
  try {
    const results = await Promise.all([
      fetch(url1, options),
      fetch(url2, options),
    ]);
    const dataPromises = results.map((result) => result.json());
    const finalData = await Promise.all(dataPromises);
    // console.log(finalData);

    const sorted = finalData[0].sort(sortByDate);
    sorted.forEach((element) => {
      dataLabels.push(element.TotalDeaths);
      labels.push(dayjs(element.Date).format("MMM DD YY"));
    });

    global = { ...finalData[1].Global };
    summary = [...finalData[1].Countries];

    replacingData();
    gettingCountriesData();

    loading.style.display = "none";
    main.style.display = "block";

  } catch (error) {
    console.log(error);
  }
  chartFunction();
  gsapStart();
});

function sortByDate(a, b) {
  if (a.Date > b.Date) {
    return 1;
  }
  if (a.Date < b.Date) {
    return -1;
  }
  return 0;
}

const chartFunction = () => {
  labels;
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Number of Deaths",
        backgroundColor: "#DA2D2D",
        borderColor: "#DA2D2D",
        data: dataLabels,
      },
    ],
  };

  const config = {
    type: "line",
    data,
    options: {},
  };

  const myChart = new Chart(chart, config);
};

const replacingData = () => {
  // console.log(global);
  const date = dayjs(global.Date).format("MMMM DD YYYY, h:mm:ss a");
  FooterDate.forEach((el) => {
    el.innerHTML = `As of ${date}`;
  });
  total.innerHTML = global.TotalConfirmed;
  newConfirmed.innerHTML = global.NewConfirmed;
  newDeaths.innerHTML = global.NewDeaths;
  totalDeaths.innerHTML = global.TotalDeaths;
  newRecovered.innerHTML = global.NewRecovered;
  totalRecovered.innerHTML = global.TotalRecovered;
};

const gettingCountriesData = () => {
  // console.log(summary);
  summary.forEach((el) => {
    const date = dayjs(el.Date).format("MMMM DD YYYY, h:mm:ss a");
    const card = `
      <div class="data-container ${el.CountryCode}">
          <div class="header">
            <h2>${el.Country}</h2>
            <div class="circle">
            <img
            src="https://flagcdn.com/w80/${el.CountryCode.toLowerCase()}.png"
            srcset="https://flagcdn.com/w80/${el.CountryCode.toLowerCase()}.png 2x"
            width="80"
            alt="${el.Country}">
            </div>
          </div>
          <div class="body">
            <p class="TotalConfirmed">Total Confirmed: ${el.TotalConfirmed}</p>
            <p class="TotalDeaths">Total Deaths: ${el.TotalDeaths}</p>
            <p class="TotalRecovered"> TotalRecovered: ${el.TotalRecovered}</p>
          </div>
          <div class="footer">
            <p>As of ${date}</p>
          </div>
        </div>
    `;
    container.innerHTML += card;

  });
};

button.addEventListener('click', (e)=>{
  e.preventDefault()
  // console.log(searchBar.value)
  if(searchBar.value === ""){
    return
  }
  // container.children.forEach((el)=>{
  //   console.log(el)
  // })
  for (let i = 0; i < container.children.length; i++) {
    const element = container.children[i].firstElementChild.firstElementChild;
    const text = element.innerHTML.toLowerCase()
    if(text.includes(searchBar.value.toLowerCase()) ){
      element.parentElement.parentElement.style.display = 'block'
    }else{
      element.parentElement.parentElement.style.display = 'none'
    }
  }
  searchBar.value = null
})

reset.addEventListener('click', (e)=>{
  e.preventDefault()
  for (let i = 0; i < container.children.length; i++) {
    const element = container.children[i]
    element.style.display = 'block'
  }
})

const gsapStart = ()=>{
  const t1 = gsap.timeline()

  t1.from('nav', {
    opacity: 0.1,
    duration: 1
  })

  t1.from('.world-wide-cases', {
    opacity: 0,
    y: -10,
    duration: 1
  }, '-=.5')

  t1.from('.charts', {
    opacity: 0,
    y: 10,
    duration: 1,
  }, '-=.5')

  t1.from('.data-container-hero', {
    opacity: 0,
    y: 10,
    duration: 1,
  }, '-=1')
  
  t1.from('.add-button', {
    y: 30,
    opacity: 0,
    duration: 2
  })
}