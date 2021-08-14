// import { showInfo, handleMove } from "./handleClick";

import { renderCl, unsucribeCl } from "./sectionClass";

const sidebarSection = new renderCl();
const backbutton = new unsucribeCl();

// const card = document.querySelector(".card__container");
// card.addEventListener("click", (e) => {
// 	e.target.classList.add("remove-load");
// 	e.target.querySelector(".spinner").classList.remove("spinner");
// });

// (async () => {
// 	try {
// 		const val = await getDataTeams();
// 		console.log(val);
// 	} catch (error) {
// 		console.log(error);
// 	}
// })();

if (module.hot) {
	module.hot.accept();
}
