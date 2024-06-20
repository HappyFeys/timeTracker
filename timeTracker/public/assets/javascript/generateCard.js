import * as DOM from "./generateElement.js";


function updateValues(data) {
    const currentPath = getCurrentPath();
    const timeElements = document.querySelectorAll(".reportSection__Timer");

    data.forEach((element, index) => {
        const timeElement = timeElements[index];
        const current = element.timeframes[currentPath]?.current ?? "0";
        const previous = element.timeframes[currentPath]?.previous ?? "0";

        const currentElement = timeElement.querySelector("p:first-child");
        const previousElement = timeElement.querySelector("p.previous");

        currentElement.textContent = `${current} hrs`;
        previousElement.textContent = `Last Week - ${previous} hrs`;
    });
}

function generateCard(data) {
    const mainContainer = document.querySelector(".reportSection");
    
    for (const element of data) {
        const sectionTask = DOM.createDiv(mainContainer, "reportSection__" + element.title.split(' ').join(''));
        sectionTask.classList.add("reportSection__el")
        DOM.generateImg(switchImg(element.title), element.title, sectionTask, "icon-task");
        
        const sectionTaskTime = DOM.createDiv(sectionTask, "reportSection__Timer");
        const timeTitle = DOM.createDiv(sectionTaskTime, "reportSection__Timer--title");
        
        DOM.generateElement("h2", element.title, timeTitle);
        DOM.generateElement("p", "...", timeTitle, "more");
        
        const timeTimer = DOM.createDiv(sectionTaskTime, "reportSection__Timer--timer");
        DOM.generateElement("p", "0 hrs", timeTimer, "current");
        DOM.generateElement("p", "Last Week - 0 hrs", timeTimer, "previous");
    }

    // Initialiser les écouteurs de clic une fois
    switchTimer(data);

    // Mettre à jour les valeurs initiales
    updateValues(data);
}

export function fetchJSONData(data) {
    fetch(data)
        .then((res) => {
            if (!res.ok) {
                throw new Error
                    (`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) =>{
            console.log(data);  
            generateCard(data)
        })
        .catch((error) => 
               console.error("Unable to fetch data:", error));
}

/**
 * Returns the source URL of an image based on the given title.
 *
 * @param {string} title - The title of the image.
 * @return {string} The source URL of the image.
 */
function switchImg(title) {
    let src;
    switch (title) {
        case "Work":
            src = "./public/assets/images/icon-work.svg"
            break;
        case "Play":
            src = "./public/assets/images/icon-play.svg"
            break;
        case "Study":
            src = "./public/assets/images/icon-study.svg"
            break;
        case "Exercise":
            src = "./public/assets/images/icon-exercise.svg"
            break;
        case "Social":
            src = "./public/assets/images/icon-social.svg"
            break;
        case "Self Care":
            src = "./public/assets/images/icon-self-care.svg"
            break;
    
        default:
            console.log("bad src");
            break;
    }
    return src
}

function switchTimer(data) {
    const daily = document.querySelector("#daily");
    const weekly = document.querySelector("#weekly");
    const monthly = document.querySelector("#monthly");

    const array = [daily, weekly, monthly];

    array.forEach(item => {
        item.addEventListener("click", () => {
            array.forEach(el => el.classList.remove("active"));
            item.classList.add("active");
            updateValues(data);
        });
    });
}

function getCurrentPath() {
    const activeElement = document.querySelector(".active");
    return activeElement ? activeElement.id : null;
}

